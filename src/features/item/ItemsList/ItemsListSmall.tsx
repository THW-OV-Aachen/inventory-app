import React from 'react';
import styled from 'styled-components';
import type { IDbInventoryItem } from '../../../db/items';

interface ItemsListSmallProps {
    items: IDbInventoryItem[];
    onItemClick?: (itemId: number) => void;
}

const CONTENT_WIDTH = '400px';

const ItemCard = styled.div<{ status: string }>`
    width: ${CONTENT_WIDTH};
    border-radius: 10px;
    padding: 10px 15px;
    margin-bottom: 15px;
    background-color: ${({ status }) => {
        if (status === 'Good') return '#b8f3c1';
        if (status === 'Soon') return '#ffe8a1';
        return '#f8a6a6';
    }};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition:
        transform 0.1s ease,
        box-shadow 0.1s ease;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    }
`;

const ItemTitle = styled.div`
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 5px;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #333;
`;

const Label = styled.span`
    font-weight: 600;
`;

/**
 * ItemsListSmall - Renders items as cards for small screens
 * Uses styled-components for consistent styling with existing design
 */
const ItemsListSmall: React.FC<ItemsListSmallProps> = ({ items, onItemClick }) => {
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

    return (
        <div>
            {items.map((item) => {
                const status = getMaintenanceStatus(item);
                return (
                    <ItemCard key={item.id} status={status} onClick={() => handleItemClick(item.id)}>
                       {/* <ItemTitle>Item #{item.externalId}</ItemTitle> */}
                        <InfoRow>
                            <div>
                                <Label>Maintenance Stat:</Label> {status}
                            </div>
                            <div>
                                <Label>Location:</Label> {item.position}
                            </div>
                        </InfoRow>
                    </ItemCard>
                );
            })}
        </div>
    );
};

export default ItemsListSmall;

