import { useState } from 'react';

// usePackMode.ts
export const usePackMode = () => {
    const [packMode, setPackMode] = useState(false);
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set()); // use string

    const togglePackMode = () => {
        setPackMode((prev) => !prev);
        setSelectedItemIds(new Set());
    };

    const toggleItem = (id: string) => {
        setSelectedItemIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return {
        packMode,
        selectedItemIds,
        togglePackMode,
        toggleItem,
        clear: () => setSelectedItemIds(new Set()),
    };
};
