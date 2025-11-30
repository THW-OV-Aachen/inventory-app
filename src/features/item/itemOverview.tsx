import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import styled from 'styled-components';
import { Search, SlidersHorizontal, Plus, Package } from 'lucide-react';
import PageHeader from '../../layout/PageHeader';
import ItemsList from './ItemsList/ItemsList';
import { db } from '../../db/db';

const ControlsWrapper = styled.div`
    width: 100%;
    max-width: 100%;
    margin-top: 8px;
    margin-bottom: 16px;
    box-sizing: border-box;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: #f8f9fa;
    padding-top: 8px;
    padding-bottom: 8px;

    @media (min-width: 1024px) {
        width: 100%;
        max-width: 896px;
        margin: 8px auto 20px auto;
        padding: 8px 16px;
        background-color: #f8f9fa;
    }
`;

const FilterBar = styled.div`
    background: white;
    border: 0.5px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const SearchRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SearchInputWrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 10px;

    &:focus-within {
        border-color: #007bff;
        background: white;
    }
`;

const SearchInput = styled.input`
    flex: 1;
    border: none;
    background: transparent;
    font-size: 13px;
    outline: none;
    color: #1e293b;

    &::placeholder {
        color: #94a3b8;
    }
`;

const SortRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SortSelectWrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 10px;
`;

const SortSelect = styled.select`
    flex: 1;
    border: none;
    background: transparent;
    font-size: 13px;
    outline: none;
    color: #1e293b;
    cursor: pointer;

    &:focus {
        outline: none;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: flex-end;
    padding-top: 6px;
    border-top: 1px solid #e2e8f0;
`;

const PrimaryButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    border: none;
    background-color: #4A90E2;
    color: white;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #3a7bc8;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const SecondaryButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    border: 1px solid #6B7A90;
    background-color: #f1f3f6;
    color: #6B7A90;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #e8ebef;
        border-color: #5a6878;
        color: #5a6878;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
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
        {
            id: 6,
            externalId: '006',
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
            id: 7,
            externalId: '007',
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
            id: 8,
            externalId: '008',
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
            id: 9,
            externalId: '009',
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
            id: 10,
            externalId: '010',
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

            <ControlsWrapper>
                <FilterBar>
                    <SearchRow>
                        <SearchInputWrapper>
                            <Search size={18} color="#64748b" />
                            <SearchInput placeholder="Search items..." />
                        </SearchInputWrapper>
                    </SearchRow>

                    <SortRow>
                        <SortSelectWrapper>
                            <SlidersHorizontal size={18} color="#64748b" />
                            <SortSelect value={sortOption} onChange={handleSortChange}>
                                <option value="item">Sort by Item #</option>
                                <option value="status">Sort by Status</option>
                                <option value="location">Sort by Location</option>
                            </SortSelect>
                        </SortSelectWrapper>
                    </SortRow>

                    <ActionButtons>
                        <PrimaryButton onClick={() => navigate('/itemAdding')}>
                            <Plus size={14} />
                            <span>Item</span>
                        </PrimaryButton>
                        <SecondaryButton>
                            <Package size={14} />
                            <span>Pack</span>
                        </SecondaryButton>
                    </ActionButtons>
                </FilterBar>
            </ControlsWrapper>

            {/* Responsive items list (cards on small, table on large) */}
            <ItemsList items={inventoryItems} onItemClick={handleItemClick} />
        </div>
    );
};

export default ItemOverview;
