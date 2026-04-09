import { useState, useEffect, useCallback } from 'react';
import { getAllProducts, getAllUsers, bulkAssignProducts } from '../../../shared/di';
import { useAuth } from '../../../shared/contexts/AuthContext';
export function useProductAssignment() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const [p, u] = await Promise.all([
        getAllProducts.execute(user.id),
        getAllUsers.execute(user.id),
      ]);
      setProducts(p);
      setUsers(u);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  useEffect(() => {
    load();
  }, [load]);
  async function assign(productIds, targetUserId) {
    if (!user) return;
    await bulkAssignProducts.execute(user.id, productIds, targetUserId);
    // Reflect changes locally
    setProducts((prev) =>
      prev.map((p) => (productIds.includes(p.id) ? { ...p, assignedUserId: targetUserId } : p))
    );
  }
  return { products, users, loading, error, assign };
}
