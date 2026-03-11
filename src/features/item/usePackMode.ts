import { useState } from 'react';

// usePackMode.ts
// Shared pack-mode state for selecting items + quantities and naming a plan.
export const usePackMode = (initialActive = false) => {
    const [packMode, setPackMode] = useState(initialActive);
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
    const [qtyByItemId, setQtyByItemId] = useState<Record<string, number>>({});
    const [planName, setPlanName] = useState(initialActive ? `Packplan - ${new Date().toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}` : '');

    const togglePackMode = () => {
        setPackMode((prev) => {
            if (prev) {
                // Exiting pack mode - reset state
                setSelectedItemIds(new Set());
                setQtyByItemId({});
                setPlanName('');
            } else {
                // Entering pack mode - set default plan name
                setPlanName(`Packplan - ${new Date().toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}`);
            }
            return !prev;
        });
    };

    const toggleItem = (id: string, defaultQuantity: number = 1) => {
        setSelectedItemIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                // Remove quantity when unchecking
                setQtyByItemId((prevQty) => {
                    const nextQty = { ...prevQty };
                    delete nextQty[id];
                    return nextQty;
                });
            } else {
                next.add(id);
                // Set default quantity when checking (only if not set already)
                setQtyByItemId((prevQty) => ({
                    ...prevQty,
                    [id]: prevQty[id] ?? defaultQuantity,
                }));
            }
            return next;
        });
    };

    const setQuantity = (id: string, quantity: number) => {
        setQtyByItemId((prev) => ({
            ...prev,
            [id]: quantity,
        }));
    };

    const preselectItems = (items: { id: string; quantity: number }[]) => {
        setSelectedItemIds((prev) => {
            const next = new Set(prev);
            items.forEach((i) => next.add(i.id));
            return next;
        });
        setQtyByItemId((prev) => {
            const next = { ...prev };
            items.forEach((i) => {
                next[i.id] = i.quantity;
            });
            return next;
        });
    };

    return {
        packMode,
        selectedItemIds,
        qtyByItemId,
        planName,
        setPlanName,
        togglePackMode,
        toggleItem,
        setQuantity,
        preselectItems,
        // Clear selection but keep pack mode active.
        clear: () => {
            setSelectedItemIds(new Set());
            setQtyByItemId({});
            setPlanName(`Packplan - ${new Date().toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}`);
        },
    };
};
