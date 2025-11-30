import React from 'react';
import type { IDbInventoryItem } from '../../../db/items';
import ItemsListSmall from './ItemsListSmall';
import ItemsListLarge from './ItemsListLarge';

interface ItemsListProps {
    items: IDbInventoryItem[];
    onItemClick?: (itemId: number) => void;
}

/**
 * ItemsList - Orchestrator component for responsive item display
 * Delegates rendering to specialized components based on screen size:
 * - Small screens (< lg): Card layout via ItemsListSmall
 * - Large screens (≥ lg): Table layout via ItemsListLarge
 */
const ItemsList: React.FC<ItemsListProps> = ({ items, onItemClick }) => {
    return (
        <>
            {/* Small screens: Cards */}
            <div className="block lg:hidden">
                <ItemsListSmall items={items} onItemClick={onItemClick} />
            </div>

            {/* Large screens: Table */}
            <div className="hidden lg:block">
                <ItemsListLarge items={items} onItemClick={onItemClick} />
            </div>
        </>
    );
};

export default ItemsList;

