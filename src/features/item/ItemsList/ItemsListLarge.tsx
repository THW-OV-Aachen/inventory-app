import React from 'react';
import type { IDbInventoryItem } from '../../../db/items';

interface ItemsListLargeProps {
    items: IDbInventoryItem[];
    onItemClick?: (itemId: number) => void;
}

/**
 * ItemsListLarge - Renders items as a table for large screens
 * Uses Tailwind CSS for responsive and modern styling
 */
const ItemsListLarge: React.FC<ItemsListLargeProps> = ({ items, onItemClick }) => {
    const getMaintenanceStatus = (item: IDbInventoryItem): string => {
        if (item.amountActual >= item.amountTarget) return 'Good';
        if (item.amountActual > 0) return 'Soon';
        return 'Danger!';
    };

    const handleItemClick = (itemId?: number) => {
        if (itemId && onItemClick) {
            onItemClick(itemId);
        }
    };

    const getStatusColor = (status: string) => {
        if (status === 'Good') return 'bg-green-200 text-green-800';
        if (status === 'Soon') return 'bg-yellow-200 text-yellow-800';
        return 'bg-red-200 text-red-800';
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Item #</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Maintenance Status</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Location</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Floor</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Available</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const status = getMaintenanceStatus(item);
                        return (
                            <tr
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                className={`border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">#{item.externalId}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
                                        {status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{item.position}</td>
                                <td className="px-6 py-4 text-gray-700">{item.floor}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                            item.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        {item.isAvailable ? 'Yes' : 'No'}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ItemsListLarge;

