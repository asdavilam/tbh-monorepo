// IAuthService — interfaz de autenticación para la capa de aplicación.
// Infrastructure implementa esta interfaz (SupabaseAuthClient).
// Domain y UI no dependen de ella directamente; UI la usa a través de DI.

export interface AuthSession {
  userId: string;
  email: string;
}

export interface IAuthService {
  signIn(email: string, password: string): Promise<AuthSession>;
  signUp(email: string, password: string, name: string): Promise<AuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
}
