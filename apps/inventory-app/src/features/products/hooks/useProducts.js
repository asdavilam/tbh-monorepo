import { useState, useEffect, useCallback } from 'react';
import { getAllProducts, deleteProduct } from '../../../shared/di';
import { useAuth } from '../../../shared/contexts/AuthContext';
export function useProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const load = useCallback(async () => {
        if (!user)
            return;
        setLoading(true);
        setError('');
        try {
            const result = await getAllProducts.execute(user.id);
            setProducts(result);
        }
        catch {
            setError('No se pudieron cargar los productos');
        }
        finally {
            setLoading(false);
        }
    }, [user?.id]);
    useEffect(() => {
        load();
    }, [load]);
    async function remove(productId) {
        if (!user)
            return;
        await deleteProduct.execute(user.id, productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
    return { products, loading, error, reload: load, remove };
}
