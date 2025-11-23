import React from 'react';
import { Package, MapPin, Layers, CheckCircle2, AlertCircle, XCircle, Check, X } from 'lucide-react';
import type { IDbInventoryItem } from '../../../db/items';

interface ItemsListLargeProps {
    items: IDbInventoryItem[];
    onItemClick?: (itemId: number) => void;
}

/**
 * ItemsListLarge - Renders items as a table for large screens
 * Uses Tailwind CSS for responsive and modern styling with Material icons
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
        if (status === 'Good') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (status === 'Soon') return 'bg-amber-100 text-amber-800 border-amber-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    const getStatusIcon = (status: string) => {
        const iconSize = 14;
        if (status === 'Good') return <CheckCircle2 size={iconSize} />;
        if (status === 'Soon') return <AlertCircle size={iconSize} />;
        return <XCircle size={iconSize} />;
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <Package size={18} />
                                <span>Item #</span>
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                <span>Status</span>
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} />
                                <span>Location</span>
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                            <div className="flex items-center gap-2">
                                <Layers size={18} />
                                <span>Floor</span>
                            </div>
                        </th>
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
                                className={`border-b hover:bg-blue-50 cursor-pointer transition-colors ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <Package size={16} className="text-gray-400" />
                                        #{item.externalId}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(status)}`}>
                                        {getStatusIcon(status)}
                                        {status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-gray-400" />
                                        {item.position}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Layers size={14} className="text-gray-400" />
                                        Floor {item.floor}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            item.isAvailable 
                                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                                : 'bg-gray-200 text-gray-700 border border-gray-300'
                                        }`}
                                    >
                                        {item.isAvailable ? <Check size={12} /> : <X size={12} />}
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

