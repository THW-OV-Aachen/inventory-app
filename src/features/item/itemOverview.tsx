import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import styled from 'styled-components';
import PageHeader from '../../layout/PageHeader';
import ItemsList from './ItemsList/ItemsList';
import { db } from '../../db/db';

const contentWidth = '400px';

const TopBar = styled.div`
    width: ${contentWidth};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
`;

const SearchAndSortContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 8px;
    margin-right: 10px;
`;

const SearchInput = styled.input`
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const SortSelect = styled.select`
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: white;
`;

const ButtonColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Button = styled.button`
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    width: 80px;
    &:hover {
        background-color: #0056b3;
    }
`;

const ItemOverview = () => {
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState('item');

    // Fetch inventory items from IndexedDB with live updates
    const inventoryItemsFromDB = useLiveQuery(() => db.inventoryItems.toArray(), []);

    // Hardcoded test data (fallback when DB is empty)
    const hardcodedItems = [
        {
            id: 1,
            externalId: '001',
            floor: 3,
            amountTarget: 5,
            amountActual: 5,
            isAvailable: true,
            position: '3B',
            compoundType: 'set' as const,
            organisationalUnitId: 1,
            itemDefinitionId: 1,
        },
        {
            id: 2,
            externalId: '002',
            floor: 2,
            amountTarget: 5,
            amountActual: 3,
            isAvailable: true,
            position: '2C',
            compoundType: 'part' as const,
            organisationalUnitId: 1,
            itemDefinitionId: 2,
        },
        {
            id: 3,
            externalId: '003',
            floor: 1,
            amountTarget: 10,
            amountActual: 0,
            isAvailable: false,
            position: '1C',
            compoundType: 'set' as const,
            organisationalUnitId: 1,
            itemDefinitionId: 3,
        },
        {
            id: 4,
            externalId: '004',
            floor: 3,
            amountTarget: 8,
            amountActual: 8,
            isAvailable: true,
            position: '3C',
            compoundType: 'part' as const,
            organisationalUnitId: 1,
            itemDefinitionId: 4,
        },
        {
            id: 5,
            externalId: '005',
            floor: 3,
            amountTarget: 2,
            amountActual: 2,
            isAvailable: true,
            position: '3D',
            compoundType: 'set' as const,
            organisationalUnitId: 1,
            itemDefinitionId: 5,
        },
    ];

    // Use DB items if available, otherwise use hardcoded test data
    const inventoryItems = inventoryItemsFromDB && inventoryItemsFromDB.length > 0 
        ? inventoryItemsFromDB 
        : hardcodedItems;

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSortOption(value);
        // TODO: Implement sorting logic
    };

    const handleItemClick = (itemId: number) => {
        navigate(`/itemDetails`, { state: { itemId } });
    };

    return (
        <div>
            <PageHeader title="Items Overview" />

            <TopBar>
                <SearchAndSortContainer>
                    <SearchInput placeholder="Search" />
                    <SortSelect value={sortOption} onChange={handleSortChange}>
                        <option value="item">Sort by Item #</option>
                        <option value="status">Sort by Status</option>
                        <option value="location">Sort by Location</option>
                    </SortSelect>
                </SearchAndSortContainer>

                <ButtonColumn>
                    <Button onClick={() => navigate('/itemAdding')}>+Item</Button>
                    <Button>+Pack</Button>
                </ButtonColumn>
            </TopBar>

            {/* Responsive items list (cards on small, table on large) */}
            <ItemsList items={inventoryItems} onItemClick={handleItemClick} />
        </div>
    );
};

export default ItemOverview;
