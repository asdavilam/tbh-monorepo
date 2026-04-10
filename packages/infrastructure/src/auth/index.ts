// Auth client — wrapper sobre Supabase Auth
// Expone operaciones de sesión en términos de la aplicación.
// No importa componentes React, hooks ni UseCases.

import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserRole } from '@tbh/domain';
import { RepositoryError } from '../errors';

export interface AuthSession {
  userId: string;
  email: string;
}

export class SupabaseAuthClient {
  constructor(private readonly client: SupabaseClient) {}

  async signIn(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });

    if (error) throw new RepositoryError(`Error al iniciar sesión: ${error.message}`);
    if (!data.user) throw new RepositoryError('No se pudo obtener el usuario tras el login');

    return { userId: data.user.id, email: data.user.email ?? email };
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw new RepositoryError(`Error al cerrar sesión: ${error.message}`);
  }

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.client.auth.getSession();

    if (error) throw new RepositoryError(`Error al obtener sesión: ${error.message}`);
    if (!data.session?.user) return null;

    return {
      userId: data.session.user.id,
      email: data.session.user.email ?? '',
    };
  }

  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    const { data } = this.client.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }
      callback({ userId: session.user.id, email: session.user.email ?? '' });
    });

    return () => data.subscription.unsubscribe();
  }

  async inviteUser(email: string, name: string, role: UserRole): Promise<void> {
    const { error } = await this.client.functions.invoke('invite-user', {
      body: { email, name, role },
    });

    if (error) {
      let message = error.message;
      try {
        const body = await (error as { context?: Response }).context?.json();
        if (body?.error) message = body.error;
      } catch {
        /* ignore */
      }
      throw new RepositoryError(message);
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({ password: newPassword });
    if (error) throw new RepositoryError(`Error al actualizar contraseña: ${error.message}`);
  }

  async exchangeCodeForSession(code: string): Promise<AuthSession> {
    const { data, error } = await this.client.auth.exchangeCodeForSession(code);
    if (error)
      throw new RepositoryError(`Error al procesar código de invitación: ${error.message}`);
    if (!data.session?.user) throw new RepositoryError('No se pudo establecer la sesión');
    return { userId: data.session.user.id, email: data.session.user.email ?? '' };
  }
}
