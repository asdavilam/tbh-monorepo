// IAuthService — interfaz de autenticación para la capa de aplicación.
// Infrastructure implementa esta interfaz (SupabaseAuthClient).
// Domain y UI no dependen de ella directamente; UI la usa a través de DI.

import type { UserRole } from '@tbh/domain';

export interface AuthSession {
  userId: string;
  email: string;
}

export interface IAuthService {
  signIn(email: string, password: string): Promise<AuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
  /** Invita a un usuario por email. Llama a la Edge Function invite-user (Admin API). */
  inviteUser(email: string, name: string, role: UserRole): Promise<void>;
  /** Actualiza la contraseña del usuario autenticado. Usado en el flujo de primera entrada. */
  updatePassword(newPassword: string): Promise<void>;
  /** Intercambia un código de autorización (PKCE) por una sesión. Usado en auth callback. */
  exchangeCodeForSession(code: string): Promise<AuthSession>;
}
