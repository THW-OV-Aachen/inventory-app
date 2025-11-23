import React from 'react';
import styled from 'styled-components';
import { MapPin, CheckCircle2, AlertCircle, XCircle, Layers, Box } from 'lucide-react';
import type { IDbInventoryItem } from '../../../db/items';

interface ExtendedInventoryItem extends IDbInventoryItem {
    name?: string;
    inventoryNumber?: string;
    damageLevel?: 'none' | 'minor' | 'major' | 'total';
    location?: string;
    amountCurrent?: number;
    amountMinimum?: number;
    amountMaximum?: number;
    availability?: boolean;
    isSet?: boolean;
}

interface ItemsListSmallProps {
    items: ExtendedInventoryItem[];
    onItemClick?: (itemId: number) => void;
}

const ItemCard = styled.div<{ status: string }>`
    width: 100%;
    max-width: 100%;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 12px;
    background-color: white;
    box-sizing: border-box;
    border-left: 4px solid ${({ status }) => {
        if (status === 'Good') return '#10b981';
        if (status === 'Minor' || status === 'Soon') return '#f59e0b';
        if (status === 'Damaged') return '#ef4444';
        if (status === 'Out of order') return '#dc2626';
        return '#ef4444';
    }};
    border: 1px solid ${({ status }) => {
        if (status === 'Good') return '#d1fae5';
        if (status === 'Minor' || status === 'Soon') return '#fed7aa';
        if (status === 'Damaged') return '#fecaca';
        if (status === 'Out of order') return '#fee2e2';
        return '#fecaca';
    }};
    border-left-width: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease,
        border-color 0.15s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        border-color: ${({ status }) => {
            if (status === 'Good') return '#10b981';
            if (status === 'Minor' || status === 'Soon') return '#f59e0b';
            if (status === 'Damaged') return '#ef4444';
            if (status === 'Out of order') return '#dc2626';
            return '#ef4444';
        }};
    }
`;

const CardHeader = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
`;

const CardHeaderLeft = styled.div`
    flex: 1;
    min-width: 0;
`;

const CardHeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    color: #64748b;
    font-size: 13px;
`;

const ItemTitle = styled.div`
    font-weight: 600;
    font-size: 16px;
    color: #1e293b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 4px;
`;

const InventoryNumber = styled.div`
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 12px;
    color: #475569;
    gap: 12px;
    margin-top: 8px;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
`;

const InfoItemRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    text-align: right;
`;

const StatusBadge = styled.span<{ status: string }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    background-color: ${({ status }) => {
        if (status === 'Good') return '#d1fae5';
        if (status === 'Soon' || status === 'Minor') return '#fed7aa';
        if (status === 'Damaged') return '#fecaca';
        if (status === 'Out of order') return '#fee2e2';
        return '#fecaca';
    }};
    color: ${({ status }) => {
        if (status === 'Good') return '#065f46';
        if (status === 'Soon' || status === 'Minor') return '#92400e';
        if (status === 'Damaged') return '#991b1b';
        if (status === 'Out of order') return '#7f1d1d';
        return '#991b1b';
    }};
`;

const QuantityLabel = styled.div`
    font-size: 11px;
    color: #64748b;
    white-space: nowrap;
`;

const UnavailableBadge = styled.span`
    display: inline-flex;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    background-color: #fee2e2;
    color: #991b1b;
`;

const CardsContainer = styled.div`
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
`;

/**
 * ItemsListSmall - Renders items as cards for small screens
 * Modern design with colored left border and clean white background
 */
const ItemsListSmall: React.FC<ItemsListSmallProps> = ({ items, onItemClick }) => {
    const getDamageStatus = (item: ExtendedInventoryItem): string => {
        if (item.damageLevel === 'none') return 'Good';
        if (item.damageLevel === 'minor') return 'Minor';
        if (item.damageLevel === 'major') return 'Damaged';
        if (item.damageLevel === 'total') return 'Out of order';
        
        // Fallback to old logic if damageLevel not available
        if (item.amountActual >= item.amountTarget) return 'Good';
        if (item.amountActual > 0) return 'Soon';
        return 'Danger!';
    };

    const handleItemClick = (itemId?: number) => {
        if (itemId && onItemClick) {
            onItemClick(itemId);
        }
    };

    const getStatusIcon = (status: string) => {
        const iconSize = 14;
        if (status === 'Good') return <CheckCircle2 size={iconSize} />;
        if (status === 'Minor' || status === 'Soon') return <AlertCircle size={iconSize} />;
        return <XCircle size={iconSize} />;
    };

    const getItemIcon = (item: ExtendedInventoryItem) => {
        const iconSize = 20;
        const isSet = item.isSet ?? (item.compoundType === 'set');
        return isSet ? <Layers size={iconSize} color="#64748b" /> : <Box size={iconSize} color="#64748b" />;
    };

    const getItemName = (item: ExtendedInventoryItem): string => {
        return item.name || `Item #${item.externalId}`;
    };

    const getLocation = (item: ExtendedInventoryItem): string => {
        return item.location || item.position || '';
    };

    const getQuantityInfo = (item: ExtendedInventoryItem): string => {
        const current = item.amountCurrent ?? item.amountActual ?? 0;
        const minimum = item.amountMinimum ?? item.amountTarget ?? 0;
        const maximum = item.amountMaximum ?? item.amountTarget ?? 0;
        return `Now: ${current} | Min: ${minimum} | Max: ${maximum}`;
    };

    const getAvailability = (item: ExtendedInventoryItem): boolean => {
        return item.availability ?? item.isAvailable ?? true;
    };

    return (
        <CardsContainer>
            {items.map((item) => {
                const status = getDamageStatus(item);
                const location = getLocation(item);
                const quantityInfo = getQuantityInfo(item);
                const isAvailable = getAvailability(item);
                const itemName = getItemName(item);
                
                return (
                    <ItemCard key={item.id} status={status} onClick={() => handleItemClick(item.id)}>
                        <CardHeader>
                            {getItemIcon(item)}
                            <CardHeaderLeft>
                                <ItemTitle title={itemName}>{itemName}</ItemTitle>
                                {item.inventoryNumber && (
                                    <InventoryNumber>Inv.-Nr.: {item.inventoryNumber}</InventoryNumber>
                                )}
                            </CardHeaderLeft>
                            <CardHeaderRight>
                                <MapPin size={14} />
                                <span>{location}</span>
                            </CardHeaderRight>
                        </CardHeader>
                        <InfoRow>
                            <InfoItem>
                                <StatusBadge status={status}>
                                    {getStatusIcon(status)}
                                    {status}
                                </StatusBadge>
                            </InfoItem>
                            <InfoItemRight>
                                <QuantityLabel>{quantityInfo}</QuantityLabel>
                                {!isAvailable && (
                                    <UnavailableBadge>Unavailable</UnavailableBadge>
                                )}
                            </InfoItemRight>
                        </InfoRow>
                    </ItemCard>
                );
            })}
        </CardsContainer>
    );
};

export default ItemsListSmall;

