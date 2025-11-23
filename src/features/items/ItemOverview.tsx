import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../db/db';
import { type IItem, DamageLevelType } from '../../db/items';
import styled from 'styled-components';
import { ArrowDownAZ, ArrowDownZA, Hourglass, Search } from 'lucide-react';
import IconContainer from '../../utils/IconContainer';

const DamageLevelTranslation = {
    none: 'unbeschädigt',
    minor: 'leicht beschädigt',
    major: 'stark beschädigt',
    total: 'zerstört',
} as const;

type SortField =
    | 'id'
    | 'name'
    | 'type'
    | 'amountActual'
    | 'availability'
    | 'damageLevel'
    | 'location'
    | 'inventoryNumber'
    | 'deviceNumber';
type SortDirection = 'asc' | 'desc';

const ItemFilter = (props: { searchTerm: string; setSearchTerm: React.Dispatch<React.SetStateAction<string>> }) => {
    const navigate = useNavigate();
    const { searchTerm, setSearchTerm } = props;

    return (
        <ItemFilterWrapper>
            <ItemFilterSearchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <AddEntityButtons>
                <button className="btn btn-primary" onClick={() => navigate('/itemAdding')}>
                    Gegenstand hinzufügen
                </button>
                <button className="btn btn-primary">Pack hinzufügen</button>
            </AddEntityButtons>
        </ItemFilterWrapper>
    );
};

const ItemFilterWrapper = styled.div<{ $isScrolled?: boolean }>`
    position: sticky;
    top: 0;
    z-index: 100;

    display: flex;
    flex-direction: row;

    gap: 4px;

    padding: 16px;

    border-radius: 6px;

    border: 1px solid var(--color-bg-accent);
    background-color: var(--color-bg);

    margin-bottom: 16px;

    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const ItemFilterSearchbar = (props: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const { searchTerm, setSearchTerm } = props;

    return (
        <SearchbarWrapper>
            <IconContainer icon={Search} />
            <input
                className="form-control"
                type="text"
                placeholder="Suche nach ID, Name, Ort, Inventar- oder Gerätenummer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </SearchbarWrapper>
    );
};

const SearchbarWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    border: 1px solid var(--color-bg-accent-darker);
    padding: 0 16px;
    border-radius: 8px;
    gap: 12px;

    background: var(--color-bg);

    & > input {
        border: none;
        padding: 0;
        margin: 0;
        outline: none;

        &:focus {
            box-shadow: none;
        }
    }
`;

const AddEntityButtons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
`;

const ItemOverview = () => {
    const [items, setItems] = useState<IItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortField, setSortField] = useState<SortField | null>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    useEffect(() => {
        const fetchItems = async () => {
            const dbItems = await db.items.toArray();
            setItems(dbItems);
        };
        fetchItems();
    }, []);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else {
                setSortField(null);
                setSortDirection('asc');
            }
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortedItems = (itemsToSort: IItem[]) => {
        if (!sortField) return itemsToSort;

        const sorted = [...itemsToSort];
        sorted.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case 'id':
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'type':
                    aValue = a.isSet ? 'Satz' : 'Teil';
                    bValue = b.isSet ? 'Satz' : 'Teil';
                    break;
                case 'amountActual':
                    aValue = a.amountActual ?? 0;
                    bValue = b.amountActual ?? 0;
                    break;
                case 'availability':
                    aValue = a.availability;
                    bValue = b.availability;
                    break;
                case 'damageLevel':
                    aValue = a.damageLevel;
                    bValue = b.damageLevel;
                    break;
                case 'location':
                    aValue = a.location;
                    bValue = b.location;
                    break;
                case 'inventoryNumber':
                    aValue = a.inventoryNumber ?? '';
                    bValue = b.inventoryNumber ?? '';
                    break;
                case 'deviceNumber':
                    aValue = a.deviceNumber ?? '';
                    bValue = b.deviceNumber ?? '';
                    break;
                default:
                    return 0;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const comparison = aValue.localeCompare(bValue);
                return sortDirection === 'asc' ? comparison : -comparison;
            } else {
                const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                return sortDirection === 'asc' ? comparison : -comparison;
            }
        });

        return sorted;
    };

    // Flexible search across multiple fields including inventoryNumber and deviceNumber
    const filteredItems = items.filter((item) => {
        const term = searchTerm.toLowerCase();
        return [item.name, item.location, item.id, item.inventoryNumber || '', item.deviceNumber || ''].some((field) =>
            field.toLowerCase().includes(term)
        );
    });

    const sortedAndFilteredItems = getSortedItems(filteredItems);

    return (
        <div>
            <ItemFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Table>
                <TableHeader>
                    <HeaderCell onClick={() => handleSort('id')}>
                        <HeaderContent>
                            <span>ID</span>
                            <SortIndicator active={sortField === 'id'} sortDirection={sortDirection} />
                        </HeaderContent>
                    </HeaderCell>
                    <HeaderCell onClick={() => handleSort('name')}>
                        <HeaderContent>
                            <span>Name</span>
                            <SortIndicator active={sortField === 'name'} sortDirection={sortDirection} />
                        </HeaderContent>
                    </HeaderCell>
                    <HeaderCell onClick={() => handleSort('type')}>
                        <HeaderContent>
                            <span>Typ</span>
                            <SortIndicator active={sortField === 'type'} sortDirection={sortDirection} />
                        </HeaderContent>
                    </HeaderCell>
                    <HeaderCell onClick={() => handleSort('amountActual')}>
                        <HeaderContent>
                            <span>Menge</span>
                            <SortIndicator active={sortField === 'amountActual'} sortDirection={sortDirection} />
                        </HeaderContent>
                    </HeaderCell>
                    <HeaderCell onClick={() => handleSort('damageLevel')}>
                        <HeaderContent>
                            <span>Zustand</span>
                            <SortIndicator active={sortField === 'damageLevel'} sortDirection={sortDirection} />
                        </HeaderContent>
                    </HeaderCell>
                    <HeaderCell onClick={() => handleSort('location')}>
                        <HeaderContent>
                            <span>Ort</span>
                            <SortIndicator active={sortField === 'location'} sortDirection={sortDirection} />
                        </HeaderContent>
                    </HeaderCell>
                    <HeaderCell onClick={() => handleSort('inventoryNumber')}>
                        <HeaderContent>
                            <span>Inventar-Nr.</span>
                            <SortIndicator active={sortField === 'inventoryNumber'} sortDirection={sortDirection} />
                        </HeaderContent>
                    </HeaderCell>
                    <HeaderCell onClick={() => handleSort('deviceNumber')}>
                        <HeaderContent>
                            <span>Geräte-Nr.</span>
                            <SortIndicator active={sortField === 'deviceNumber'} sortDirection={sortDirection} />
                        </HeaderContent>
                    </HeaderCell>
                </TableHeader>
                {sortedAndFilteredItems.map((item) => (
                    <TableRow key={item.id}>
                        <div>{item.id ?? '-'}</div>
                        <div>{item.name ?? '-'}</div>
                        <div>{item.isSet ? 'Satz' : 'Teil'}</div>
                        <CellAmount>
                            <span>{item.amountActual ?? '-'}</span>
                            <span>{item.amountTarget ?? '-'}</span>
                            <span>{item.availability ?? '-'}</span>
                        </CellAmount>
                        <div>{DamageLevelTranslation[item.damageLevel] ?? '-'}</div>
                        <div>{item.location ?? '-'}</div>
                        <div>{item.inventoryNumber ?? '-'}</div>
                        <div>{item.deviceNumber ?? '-'}</div>
                    </TableRow>
                ))}
            </Table>
        </div>
    );
};

const SortIndicator = (props: { active: boolean; sortDirection: SortDirection }) => {
    const { active, sortDirection } = props;

    return (
        <SortIndicatorWrapper $isActive={active}>
            <IconContainer icon={!active ? ArrowDownAZ : sortDirection == 'asc' ? ArrowDownAZ : ArrowDownZA} />
        </SortIndicatorWrapper>
    );
};

const CellAmount = styled.div`
    --flex-gap: 6px;
    display: flex;
    flex-direction: row;
    gap: var(--flex-gap);

    & > span:not(:last-child)::after {
        position: relative;
        display: block;
        content: '/';
        float: right;
        margin-left: var(--flex-gap);
    }
`;

const Table = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    border-radius: 8px;
    overflow: hidden;
`;

const TableRowBase = styled.div`
    --border-color: var(--color-bg-accent);

    display: contents;

    & > * {
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-color);
    }

    & > *:first-child {
        border-left: 1px solid var(--border-color);
    }

    & > *:last-child {
        border-right: 1px solid var(--border-color);
    }
`;

const TableHeader = styled(TableRowBase)`
    & > * {
        background-color: var(--border-color);
        color: var(--color-font-secondary);
        font-weight: 600;
        border-bottom: 2px solid var(--border-color);
    }
`;

const TableRow = styled(TableRowBase)`
    & > * {
        background-color: white;
    }

    &:hover > * {
        background-color: var(--color-bg-hover, #f8f9fa);
        cursor: pointer;
    }
`;

const HeaderCell = styled.div`
    cursor: pointer;
    user-select: none;
`;

const HeaderContent = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
`;

const SortIndicatorWrapper = styled.span<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    transition: opacity 0.1s;

    opacity: ${(props) => (props.$isActive ? '1' : '0')};

    ${HeaderCell}:hover & {
        opacity: ${(props) => (props.$isActive ? '1' : '0.5')} !important;
    }
`;

export default ItemOverview;
