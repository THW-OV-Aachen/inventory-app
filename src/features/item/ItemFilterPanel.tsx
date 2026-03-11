import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DamageLevelType } from '../../db/items';
import styled from 'styled-components';
import {
    ArrowDownAZ,
    ArrowDownZA,
    Search,
    ArrowDownNarrowWide,
    Check,
    X,
    Plus,
    Package,
    Save,
    ScanLine,
} from 'lucide-react';
import IconContainer from '../../utils/IconContainer';
import React from 'react';
import { Form } from 'react-bootstrap';
import DamageLevelTranslation from '../../utils/damageLevels';
import { theme } from '../../styles/theme';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
    clearFilters,
    setSearchTerm,
    setSortDirection,
    setSortField,
    updateFilter,
} from '../../store/slices/searchSlice';
import type { SortField } from '../../app/api';
import { usePackMode } from './usePackMode';
import {
    LabelBadge,
    LabelSelectorWrapper,
    LabelSearchInput,
    LabelDropdown,
    LabelOption,
    NoLabels,
    SelectedLabels,
} from '../../utils/LabelBadge';
import type { ILabel } from '../../db/labels';
import { labelsApi } from '../../app/api';
import BarcodeScannerModal from '../barcodeScanner/BarcodeScannerModal';

const sortFieldLabels: Record<string, string> = {
    nextInspection: 'Nächste Inspektion',
    inventoryNumber: 'Inventarnummer',
    name: 'Name',
    damageLevel: 'Zustand',
    location: 'Ort',
};

interface ItemFilterProps {
    packModeState: ReturnType<typeof usePackMode>;
    onSavePackingPlan?: () => void;
}

export const ItemFilter = ({ packModeState, onSavePackingPlan }: ItemFilterProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isExistingPlan = !!(location.state as any)?.planId;
    const [showScanner, setShowScanner] = useState(false);

    const handleBarcodeDetected = async (code: string) => {
        dispatch(setSearchTerm(code));
    };

    return (
        <ItemFilterWrapper>
            <MainFilterRow>
                <ItemFilterSearchbar />
                <MainActions>
                    {!packModeState.packMode && (
                        <PrimaryButton onClick={() => navigate('/items/add')}>
                            <IconContainer icon={Plus} />
                            <span>Artikel</span>
                        </PrimaryButton>
                    )}
                    <SecondaryButton type="button" onClick={() => setShowScanner(true)}>
                        <IconContainer icon={ScanLine} />
                        <span>Scannen</span>
                    </SecondaryButton>
                </MainActions>
            </MainFilterRow>

            <PackActionsRow 
                $centered={!packModeState.packMode} 
                $isPackMode={packModeState.packMode}
            >
                {packModeState.packMode && (
                    <PlanNameInput
                        type="text"
                        placeholder="Name des Packplans..."
                        value={packModeState.planName}
                        onChange={(e) => packModeState.setPlanName(e.target.value)}
                        disabled={isExistingPlan}
                        title={isExistingPlan ? "Name kann bei bestehendem Plan nicht hier geändert werden" : ""}
                    />
                )}
                {packModeState.packMode && onSavePackingPlan && (
                    <PrimaryButton 
                        onClick={onSavePackingPlan} 
                        disabled={packModeState.selectedItemIds.size === 0}
                        $noCollapse
                    >
                        <IconContainer icon={Save} />
                        <span>Speichern</span>
                    </PrimaryButton>
                )}
                <SecondaryButton 
                    onClick={packModeState.togglePackMode}
                    $noCollapse
                >
                    <IconContainer icon={Package} />
                    <span>{packModeState.packMode ? 'Abbrechen' : 'Packen'}</span>
                </SecondaryButton>
            </PackActionsRow>

            <BarcodeScannerModal
                show={showScanner}
                onClose={() => setShowScanner(false)}
                onDetected={handleBarcodeDetected}
                helpText="Halte die Kamera auf den Barcode. Der erkannte Code wird in die Suche übernommen."
                readerId="item-filter-barcode-reader"
            />
        </ItemFilterWrapper>
    );
};

const SearchInputWrapper = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 13px;

    &:focus-within {
        border-color: #007bff;
        background: white;
    }

    & > input {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        color: var(--color-font-primary);

        font-size: 13px;

        &::placeholder {
            color: #94a3b8;
        }

        &:focus {
            box-shadow: none;
        }
    }
`;

const MainFilterRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    width: 100%;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        gap: 4px;
    }
`;

const MainActions = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
    flex-shrink: 0;
`;

const PackActionsRow = styled.div<{ $centered?: boolean; $isPackMode?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: ${({ $centered }) => ($centered ? 'center' : 'flex-end')};
    gap: 4px;
    width: 100%;
    margin-top: 4px;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        margin-top: 2px;
        ${({ $isPackMode }) => $isPackMode && `
            justify-content: space-between;
            & > * {
                flex: 1;
            }
            & > input {
                flex: 2;
            }
        `}
    }
`;

const AddButton = styled.button<{ $noCollapse?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 36px;
    padding: 0 18px;
    border-radius: ${theme.borderRadius.lg};
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 10px;
        span {
            display: ${({ $noCollapse }) => $noCollapse ? 'inline' : 'none'};
        }
    }
`;

const PrimaryButton = styled(AddButton)`
    border: none;
    background-color: #4a90e2;
    color: white;

    &:hover {
        background-color: #3a7bc8;
    }
`;

const SecondaryButton = styled(AddButton)`
    border: 1px solid #6b7a90;
    background-color: #f1f3f6;
    color: #6b7a90;

    &:hover {
        background-color: #e9eef5;
    }
`;

const PlanNameInput = styled.input`
    height: 36px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background-color: white;
    font-size: 12px;
    min-width: 150px;
    flex: 1;
    max-width: 300px;

    &:focus {
        outline: none;
        border-color: #007bff;
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        min-width: 80px;
        flex: 1;
    }
`;

const ItemFilterWrapper = styled.div<{ $isScrolled?: boolean }>`
    position: sticky;
    top: 0;
    z-index: 100;

    display: flex;
    flex-direction: column;
    gap: 4px;

    padding: ${theme.spacing.lg};
    border-radius: 6px;
    border: 1px solid var(--color-bg-accent);
    background-color: var(--color-bg);
    margin-bottom: ${theme.spacing.lg};
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 8px;
        gap: 2px;
    }
`;

import { store } from '../../store/store';

export const removeLabel = (labelId: string) => {
    const activeFilter = store.getState().search.filters?.labels || [];
    const newFilter = activeFilter.filter((l) => l !== labelId);
    store.dispatch(updateFilter({ labels: newFilter }));
};

const LabelSelector = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.search.filters);
    const selectedLabels = filters?.labels || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [allLabels, setAllLabels] = useState<ILabel[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchLabels = async () => {
            const labels = await labelsApi.getAllLabels();
            setAllLabels(labels);
        };
        fetchLabels();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const filteredLabels = allLabels.filter((label) => label.name.toLowerCase().includes(searchTerm.toLowerCase()));

    function handleLabelClick(id: string): void {
        let newSelectedLabels: string[] = [];
        if (selectedLabels.includes(id)) {
            newSelectedLabels = selectedLabels.filter((labelId) => labelId !== id);
        } else {
            newSelectedLabels = [...selectedLabels, id];
        }
        dispatch(updateFilter({ labels: newSelectedLabels }));
    }

    return (
        <LabelSelectorWrapper>
            <DropdownContainer ref={dropdownRef}>
                <LabelSearchInput
                    type="text"
                    placeholder="Labels suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                />
                {isDropdownOpen && (
                    <LabelDropdown>
                        {filteredLabels.length > 0 ? (
                            filteredLabels.map((label) => (
                                <LabelOption
                                    key={label.id}
                                    onClick={() => handleLabelClick(label.id)}
                                    $isSelected={selectedLabels.includes(label.id)}
                                    color={label.color}
                                >
                                    {label.name}
                                    {selectedLabels.includes(label.id) && <IconContainer icon={Check} />}
                                </LabelOption>
                            ))
                        ) : (
                            <NoLabels>Keine Labels gefunden</NoLabels>
                        )}
                    </LabelDropdown>
                )}
            </DropdownContainer>
            {selectedLabels.length > 0 && (
                <SelectedLabels>
                    {selectedLabels.map((labelId) => {
                        const label = allLabels.find((l) => l.id === labelId);
                        return label ? (
                            <LabelBadge key={labelId} onClick={() => removeLabel(labelId)} color={label.color}>
                                {label.name} <IconContainer icon={X} />
                            </LabelBadge>
                        ) : null;
                    })}
                </SelectedLabels>
            )}
        </LabelSelectorWrapper>
    );
};

const DropdownContainer = styled.div`
    position: relative;
`;

const ItemSortButton = () => {
    const dispatch = useDispatch();
    const searchState = useSelector((state: RootState) => state.search);
    const { sortField, sortDirection, filters } = searchState;

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [localLocation, setLocalLocation] = useState(filters?.location || '');
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        setLocalLocation(filters?.location || '');
    }, [filters?.location]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleFieldSelect = (field: SortField) => {
        if (sortField === field) {
            if (field === 'nextInspection') {
                dispatch(setSortField(null));
                dispatch(setSortDirection('asc'));
            } else {
                dispatch(setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'));
            }
        } else {
            dispatch(setSortField(field));
            dispatch(setSortDirection('asc'));
        }
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalLocation(value);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            dispatch(updateFilter({ location: value || '' }));
        }, 300);
    };

    return (
        <>
            <div
                style={{
                    display: 'block',
                    height: '1.5rem',
                    width: '1px',
                    content: '',
                    background: 'var(--color-bg-accent-darker)',
                }}
            />
            <SortButtonWrapper ref={dropdownRef}>
                <SortButton onClick={() => setIsOpen(!isOpen)} $isActive={sortField !== null}>
                    <IconContainer icon={ArrowDownNarrowWide} />
                </SortButton>

                {isOpen && (
                    <>
                        <DropdownBackgroundOverlay onClick={() => setIsOpen(false)} />
                        <SortFilterDropdown>
                            <DropdownHeader>
                            <span>Sortieren nach</span>
                            <ClearButton
                                onClick={() => {
                                    dispatch(setSortField(null));
                                    dispatch(setSortDirection('asc'));
                                }}
                                isVisible={sortField !== null}
                            />
                        </DropdownHeader>

                        <DropdownContent>
                            {(Object.keys(sortFieldLabels) as SortField[]).map((field) => (
                                <SortOption
                                    key={field}
                                    onClick={() => handleFieldSelect(field)}
                                    $isActive={sortField === field}
                                >
                                    <SortOptionLabel>
                                        {sortField === field && (
                                            <IconContainer icon={sortDirection === 'asc' ? ArrowDownAZ : ArrowDownZA} />
                                        )}
                                        <span>{sortFieldLabels[field]}</span>
                                    </SortOptionLabel>
                                    {sortField === field && <IconContainer icon={Check} />}
                                </SortOption>
                            ))}
                        </DropdownContent>

                        <DropdownHeader>
                            <span>Filtern nach</span>
                            <ClearButton
                                onClick={() => {
                                    dispatch(clearFilters());
                                }}
                                isVisible={[filters?.damageLevel, filters?.type, filters?.location].some(
                                    (e) => e !== null && e !== undefined && e !== ''
                                )}
                            />
                        </DropdownHeader>
                        <DropdownContent>
                            <FilterOptionLabel>
                                <span>Zustand</span>
                                <Form.Select
                                    value={filters?.damageLevel || ''}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const damageLevelFilter =
                                            e.target.value === '' ? null : (e.target.value as DamageLevelType);
                                        dispatch(updateFilter({ damageLevel: damageLevelFilter }));
                                    }}
                                >
                                    <option value="">Alle</option>
                                    {Object.entries(DamageLevelTranslation).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </FilterOptionLabel>
                            <FilterOptionLabel>
                                <span>Typ</span>
                                <Form.Select
                                    value={filters?.type || ''}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const typeFilter =
                                            e.target.value === '' ? null : (e.target.value as 'isSet' | 'isPart');
                                        dispatch(updateFilter({ type: typeFilter }));
                                    }}
                                >
                                    <option value="">Alle</option>
                                    <option value="isSet">Satz</option>
                                    <option value="isPart">Teil</option>
                                </Form.Select>
                            </FilterOptionLabel>
                            <FilterOptionLabel>
                                <span>Labels</span>
                                <LabelSelector />
                            </FilterOptionLabel>
                            <FilterOptionLabel>
                                <span>Ort</span>
                                <Form.Control
                                    type="text"
                                    placeholder="Ort filtern..."
                                    onChange={handleLocationChange}
                                    value={localLocation}
                                />
                            </FilterOptionLabel>
                        </DropdownContent>
                    </SortFilterDropdown>
                    </>
                )}
            </SortButtonWrapper>
        </>
    );
};

const FilterOptionLabel = styled.div``;

const SortButtonWrapper = styled.div`
    position: relative;
`;

const SortButton = styled.button<{ $isActive: boolean }>`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: ${(props) => (props.$isActive ? 'var(--color-primary)' : 'var(--color-font-secondary)')};
    transition: color 0.2s ease;

    &:hover {
        color: var(--color-primary);
    }
`;

const SortFilterDropdown = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: var(--color-bg);
    border: 1px solid var(--color-bg-accent-darker);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 250px;
    z-index: 1000;

    @media only screen and (max-device-width: 812px) and (orientation: portrait),
        only screen and (max-width: 812px) {
        max-height: 60vh;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        /* Ensure touch events are strictly caught by the dropdown */
        touch-action: pan-y;
    }
`;

const DropdownBackgroundOverlay = styled.div`
    display: none;
    
    @media only screen and (max-device-width: 812px) and (orientation: portrait),
        only screen and (max-width: 812px) {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999; /* Just below the dropdown (which is 1000) */
        background: transparent;
        cursor: default;
    }
`;

const DropdownHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-bg-accent);
    font-weight: 600;
    font-size: 14px;
`;

const ClearButton = (props: { onClick: React.MouseEventHandler<HTMLButtonElement>; isVisible?: boolean }) => {
    return (
        <ClearButtonWrapper onClick={props.onClick} $isVisible={props.isVisible}>
            <IconContainer icon={X} />
            Zurücksetzen
        </ClearButtonWrapper>
    );
};

const ClearButtonWrapper = styled.button<{ $isVisible?: boolean }>`
    background: none;
    border: none;
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--color-font-secondary);
    font-size: 12px;
    font-weight: 500;
    border-radius: 4px;
    transition: all 0.2s ease;

    visibility: ${(props) => (props.$isVisible ? 'visible' : 'hidden')};
    pointer-events: ${(props) => (props.$isVisible ? 'auto' : 'none')};

    &:hover {
        background: var(--color-bg-accent);
        color: var(--color-font);
    }
`;

const DropdownContent = styled.div`
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 14px;

    & input,
    & select {
        font-size: 14px;
        margin: 4px 0 8px 0;
    }

    & input:last-of-type {
        margin-bottom: 0;
    }
`;

const SortOption = styled.button<{ $isActive: boolean }>`
    background: ${(props) => (props.$isActive ? 'var(--color-bg-accent)' : 'transparent')};
    border: none;
    padding: 10px 12px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    color: ${(props) => (props.$isActive ? 'var(--color-primary)' : 'var(--color-font-secondary)')};
    font-weight: ${(props) => (props.$isActive ? '600' : '400')};

    &:hover {
        background: var(--color-bg-accent);
    }
`;

const SortOptionLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ItemFilterSearchbar = () => {
    const dispatch = useDispatch();
    const searchState = useSelector((state: RootState) => state.search);
    const { query: searchTerm } = searchState;

    return (
        <SearchInputWrapper>
            <IconContainer icon={Search} />
            <input
                className="form-control"
                type="text"
                placeholder="Suche nach ID, Name, Ort, Inventar- oder Gerätenummer..."
                value={searchTerm || ''}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
            <ItemSortButton />
        </SearchInputWrapper>
    );
};
