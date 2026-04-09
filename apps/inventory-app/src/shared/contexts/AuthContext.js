import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { authClient, getCurrentUser } from '../di';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    async function loadUser(userId, email) {
        const domainUser = await getCurrentUser.execute(userId, email);
        if (domainUser) {
            setUser({
                id: domainUser.id,
                email: domainUser.email,
                name: domainUser.name,
                role: domainUser.role,
            });
        }
        else {
            setUser(null);
        }
    }
    useEffect(() => {
        // Recuperar sesión existente al montar
        authClient.getSession().then((session) => {
            if (session) {
                loadUser(session.userId, session.email).finally(() => setLoading(false));
            }
            else {
                setLoading(false);
            }
        });
        // Escuchar cambios de sesión (login / logout / token refresh)
        const unsubscribe = authClient.onAuthStateChange((session) => {
            if (session) {
                loadUser(session.userId, session.email);
            }
            else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);
    async function signIn(email, password) {
        const session = await authClient.signIn(email, password);
        await loadUser(session.userId, session.email);
    }
    async function signUp(email, password, name) {
        await authClient.signUp(email, password, name);
        // El trigger de Supabase crea el perfil automáticamente.
        // onAuthStateChange disparará loadUser cuando la sesión esté lista.
    }
    async function signOut() {
        await authClient.signOut();
        setUser(null);
    }
    return (_jsx(AuthContext.Provider, { value: { user, loading, signIn, signUp, signOut }, children: children }));
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
}
