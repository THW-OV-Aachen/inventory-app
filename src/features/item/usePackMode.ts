import { useState } from 'react';

// usePackMode.ts
// Shared pack-mode state for selecting items + quantities and naming a plan.
export const usePackMode = (initialActive = false) => {
    const [packMode, setPackMode] = useState(initialActive);
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
    const [qtyByItemId, setQtyByItemId] = useState<Record<string, number>>({});
    const [scenarioType, setScenarioType] = useState<string>('custom');
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
                setScenarioType('custom');
            } else {
                // Entering pack mode - set default plan name
                setPlanName(`Packplan - ${new Date().toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}`);
                setScenarioType('custom');
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
        scenarioType,
        setScenarioType,
        planName,
        setPlanName,
        togglePackMode,
        toggleItem,
        setQuantity,
        preselectItems,
        unselectAll: () => {
            setSelectedItemIds(new Set());
            setQtyByItemId({});
        },
        unselectItems: (ids: string[]) => {
            setSelectedItemIds((prev) => {
                const next = new Set(prev);
                ids.forEach(id => next.delete(id));
                return next;
            });
            setQtyByItemId((prev) => {
                const next = { ...prev };
                ids.forEach(id => delete next[id]);
                return next;
            });
        },
        // Clear selection but keep pack mode active.
        clear: () => {
            setSelectedItemIds(new Set());
            setQtyByItemId({});
            setScenarioType('custom');
            setPlanName(`Packplan - ${new Date().toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}`);
        },
    };
};
