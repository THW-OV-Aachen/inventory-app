// itemoverview.tsx

import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../db/db';
import { type IItem, DamageLevelType } from '../../db/items';
import styled from 'styled-components';
import { ArrowDownAZ, ArrowDownZA, Hourglass, Icon, Info, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import IconContainer from '../../utils/IconContainer';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { parseLocationString, mapLocationKey, parseLocationStringRaw } from '../../utils/locationString';
import React from 'react';
import StatusBadge from '../../utils/StatusBadge';
import { inventoryApi } from '../../app/api';
import { Button } from 'react-bootstrap';

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
    padding: 16px 16px;
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
    const navigate = useNavigate();
    const [items, setItems] = useState<IItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortField, setSortField] = useState<SortField | null>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(50); // Items per page
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch items with pagination
    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const result = await inventoryApi.fetchItemsPaginatedWithFilter(
                    { page: currentPage, pageSize },
                    searchTerm
                );
                setItems(result.data);
                setTotalItems(result.pagination.totalItems);
                setTotalPages(result.pagination.totalPages);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [currentPage, pageSize, searchTerm]);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

    const sortedItems = getSortedItems(items);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div>
            <ItemFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {isLoading ? (
                <LoadingContainer>
                    <IconContainer icon={Hourglass} />
                    <span>Lade Inventar...</span>
                </LoadingContainer>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <HeaderCell onClick={() => handleSort('inventoryNumber')}>
                                <HeaderContent>
                                    <span>Inventar-Nr.</span>
                                    <SortIndicator
                                        active={sortField === 'inventoryNumber'}
                                        sortDirection={sortDirection}
                                    />
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
                                    <SortIndicator
                                        active={sortField === 'amountActual'}
                                        sortDirection={sortDirection}
                                    />
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
                                    <InfoIndicator>
                                        <p>
                                            <b>Lagerkennung:</b>{' '}
                                        </p>
                                        <p>[Ebene]-[Containertyp*][Container-Nr.].[Subcontainer-Nr.]-[Werkzeug-Nr.]</p>
                                        <p>(*R=Rollcontainer, G=EU-Box)</p>
                                    </InfoIndicator>
                                    <SortIndicator active={sortField === 'location'} sortDirection={sortDirection} />
                                </HeaderContent>
                            </HeaderCell>
                            <HeaderCell onClick={() => handleSort('id')}>
                                <HeaderContent>
                                    <span>ID</span>
                                    <SortIndicator active={sortField === 'id'} sortDirection={sortDirection} />
                                </HeaderContent>
                            </HeaderCell>
                            <HeaderCell onClick={() => handleSort('deviceNumber')}>
                                <HeaderContent>
                                    <span>Geräte-Nr.</span>
                                    <SortIndicator
                                        active={sortField === 'deviceNumber'}
                                        sortDirection={sortDirection}
                                    />
                                </HeaderContent>
                            </HeaderCell>
                        </TableHeader>
                        {sortedItems.map((item) => (
                            <TableRow key={item.id} onClick={() => navigate(`/items/${item.id}`)}>
                                <TableCell>{item.inventoryNumber ?? '-'}</TableCell>
                                <TableCell>{item.name ?? '-'}</TableCell>
                                <TableCell>{item.isSet ? 'Satz' : 'Teil'}</TableCell>
                                <CellAmount>
                                    <span>
                                        <InfoInline infoComponent={<span>Verfügbare Menge</span>}>
                                            {item.availability ?? '-'}
                                        </InfoInline>
                                    </span>
                                    <span>
                                        <InfoInline infoComponent={<span>Tatsächliche Menge</span>}>
                                            {item.amountActual ?? '-'}
                                        </InfoInline>
                                    </span>
                                    <span>
                                        <InfoInline infoComponent={<span>Zielmenge</span>}>
                                            {item.amountTarget ?? '-'}
                                        </InfoInline>
                                    </span>
                                </CellAmount>
                                <TableCell>
                                    <StatusBadge damageLevelType={item.damageLevel} />
                                </TableCell>
                                <TableCell>
                                    {(() => {
                                        const components = parseLocationStringRaw(item.location);
                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
                                                {Object.entries(components).map(([key, value]) => {
                                                    return (
                                                        <React.Fragment key={`${item.id}-${key}`}>
                                                            {key === 'subcontainerNumber' && '.'}
                                                            {key === 'toolNumber' && '-'}
                                                            <InfoInline
                                                                infoComponent={
                                                                    <span>
                                                                        {mapLocationKey(key)}
                                                                        {key === 'type' && ': '}{' '}
                                                                        {key === 'type' &&
                                                                            (value === 'R'
                                                                                ? 'Rollcontainer'
                                                                                : 'Box (EU-Palette)')}
                                                                    </span>
                                                                }
                                                            >
                                                                <span>{value}</span>
                                                            </InfoInline>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </TableCell>
                                <TableCell>{item.id ?? '-'}</TableCell>
                                <TableCell>{item.deviceNumber ?? '-'}</TableCell>
                            </TableRow>
                        ))}
                    </Table>

                    <PaginationContainer>
                        <PaginationInfo>
                            Zeige {items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} bis{' '}
                            {Math.min(currentPage * pageSize, totalItems)} von {totalItems} Gegenständen
                        </PaginationInfo>
                        <PaginationControls>
                            <PaginationButton
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || isLoading}
                                variant="outline-primary"
                            >
                                <IconContainer icon={ChevronLeft} />
                            </PaginationButton>

                            <PageNumbers>
                                {currentPage > 3 && (
                                    <>
                                        <PageNumber
                                            variant="outline-primary"
                                            onClick={() => handlePageChange(1)}
                                            $active={false}
                                        >
                                            1
                                        </PageNumber>
                                        {currentPage > 4 && <PageEllipsis>...</PageEllipsis>}
                                    </>
                                )}

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((page) => page >= currentPage - 2 && page <= currentPage + 2)
                                    .map((page) => (
                                        <PageNumber
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            $active={page === currentPage}
                                            variant={`${page === currentPage ? 'primary' : 'outline-primary'}`}
                                        >
                                            {page}
                                        </PageNumber>
                                    ))}

                                {currentPage < totalPages - 2 && (
                                    <>
                                        {currentPage < totalPages - 3 && <PageEllipsis>...</PageEllipsis>}
                                        <PageNumber
                                            variant="outline-primary"
                                            onClick={() => handlePageChange(totalPages)}
                                            $active={false}
                                        >
                                            {totalPages}
                                        </PageNumber>
                                    </>
                                )}
                            </PageNumbers>

                            <PaginationButton
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || isLoading}
                                variant="outline-primary"
                            >
                                <IconContainer icon={ChevronRight} />
                            </PaginationButton>
                        </PaginationControls>
                    </PaginationContainer>
                </>
            )}
        </div>
    );
};

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    gap: 12px;
    color: var(--color-font-secondary);
`;

const PaginationContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 20px;
    border-top: 1px solid var(--color-bg-accent);

    @media (max-width: 812px) {
        flex-direction: column;
        gap: 16px;
    }
`;

const PaginationInfo = styled.div`
    font-size: 14px;
`;

const PaginationControls = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
`;

const PaginationButton = styled(Button)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const PageNumbers = styled.div`
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
`;

const PageNumber = styled(Button)<{ $active: boolean }>`
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: ${(props) => (props.$active ? '600' : '400')};
`;

const PageEllipsis = styled.span`
    padding: 0 4px;
    color: var(--color-font-secondary);
`;

const TableCell = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 4px;
`;

const InfoInline = (props: { children: ReactNode | ReactNode[]; infoComponent: ReactNode | ReactNode[] }) => {
    const { children, infoComponent } = props;

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="info-tooltip" style={{ fontSize: '14px' }}>
                    {infoComponent}
                </Tooltip>
            }
            delay={{ show: 150, hide: 300 }}
        >
            <span style={{ position: 'relative', display: 'inline-block' }}>
                <span>{children}</span>
                <span
                    style={{
                        width: '100%',
                        height: '0px',
                        display: 'block',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        content: '',
                        borderBottom: '2px dotted rgba(var(--color-primary-rgb), .2)',
                    }}
                />
            </span>
        </OverlayTrigger>
    );
};

const InfoIndicator = (props: { children: ReactNode | ReactNode[] }) => {
    const { children } = props;

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="info-tooltip" style={{ fontSize: '14px' }}>
                    {children}
                </Tooltip>
            }
            delay={{ show: 150, hide: 300 }}
        >
            <span
                className="info-icon"
                style={{
                    width: '1em',
                    height: '1em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Info />
            </span>
        </OverlayTrigger>
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

    & span.info-icon {
        opacity: 0;
    }

    &:hover span.info-icon {
        opacity: 1;
    }
`;

const HeaderCell = styled.div`
    cursor: pointer;
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
