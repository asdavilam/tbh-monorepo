import { useState, useEffect, useCallback } from 'react';
import { registerPurchase, getAllProducts, getRecentPurchases } from '../../../shared/di';
import { removeManualItemByProduct } from '../../../shared/shoppingListStorage';
export function usePurchase(user) {
    const [state, setState] = useState({
        products: [],
        history: [],
        saving: false,
        loadingHistory: true,
        success: false,
        error: '',
    });
    useEffect(() => {
        getAllProducts
            .execute(user.id)
            .then((products) => setState((s) => ({ ...s, products })))
            .catch(() => setState((s) => ({ ...s, products: [] })));
    }, [user.id]);
    const loadHistory = useCallback(async () => {
        setState((s) => ({ ...s, loadingHistory: true }));
        try {
            const history = await getRecentPurchases.execute({ daysBack: 7 });
            setState((s) => ({ ...s, history, loadingHistory: false }));
        }
        catch {
            setState((s) => ({ ...s, history: [], loadingHistory: false }));
        }
    }, []);
    useEffect(() => {
        loadHistory();
    }, [loadHistory]);
    async function submit(productId, quantity, notes) {
        setState((s) => ({ ...s, saving: true, error: '', success: false }));
        try {
            await registerPurchase.execute({ productId, userId: user.id, quantity, notes });
            removeManualItemByProduct(user.id, productId);
            setState((s) => ({ ...s, saving: false, success: true }));
            loadHistory();
        }
        catch (err) {
            setState((s) => ({ ...s, saving: false, error: String(err) }));
        }
    }
    function clearSuccess() {
        setState((s) => ({ ...s, success: false }));
    }
    return { ...state, submit, clearSuccess };
}
