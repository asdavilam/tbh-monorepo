import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserRole } from '@tbh/domain';
import { authClient, getCurrentUser } from '../di';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser(userId: string, email: string) {
    const domainUser = await getCurrentUser.execute(userId, email);
    if (domainUser) {
      setUser({
        id: domainUser.id,
        email: domainUser.email,
        name: domainUser.name,
        role: domainUser.role,
      });
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    // Recuperar sesión existente al montar
    authClient.getSession().then((session) => {
      if (session) {
        loadUser(session.userId, session.email).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de sesión (login / logout / token refresh)
    const unsubscribe = authClient.onAuthStateChange((session) => {
      if (session) {
        loadUser(session.userId, session.email);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    const session = await authClient.signIn(email, password);
    await loadUser(session.userId, session.email);
  }

  async function signUp(email: string, password: string, name: string) {
    await authClient.signUp(email, password, name);
    // El trigger de Supabase crea el perfil automáticamente.
    // onAuthStateChange disparará loadUser cuando la sesión esté lista.
  }

  async function signOut() {
    await authClient.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
