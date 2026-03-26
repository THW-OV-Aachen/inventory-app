import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
    ChevronLeft,
    Pen,
    Plus,
    X,
    Trash2,
    Package,
    Check,
    CheckCircle2,
    GripVertical,
    MessageSquare,
} from 'lucide-react';
import { packingPlanApi } from '../../app/packingPlanApi';
import { inventoryApi } from '../../app/api';
import type { IPackingPlanItem, IScenarioType } from '../../db/packingPlans';
import type { IItem } from '../../db/items';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconContainer from '../../utils/IconContainer';
import { theme } from '../../styles/theme';
import {
    Container,
    Header,
    BackButton,
    Card,
    Button,
    ContentWrapper,
    Label,
    DataValue,
    Input,
} from '../../styles/components';

import { getIconComponent } from '../../utils/scenarioIcons';

// ─── Styled Components ────────────────────────────────────

const StyledContainer = styled(Container)`
    padding-top: 0px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};
    @media (min-width: ${theme.breakpoints.lg}) {
        margin: 0 auto;
    }
`;

const StyledHeader = styled(Header)`
    padding: ${theme.spacing.md} 0;
    margin-bottom: 0;
    margin-left: 0;
    position: relative;
`;

const HeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    width: 100%;
    padding: 0 ${theme.spacing.lg};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.md};
    }
`;

const HeaderEditButton = styled(Button)`
    display: flex;
    align-items: center;
    box-shadow: ${theme.shadows.sm};
    margin-left: auto;
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};

    &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.sm};
        span {
            display: none;
        }
    }
`;

const DetailActionButton = styled(Button)`
    box-sizing: border-box;
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
    min-width: 132px;
    border: 1px solid transparent;

    display: flex;
    align-items: center;
    box-shadow: ${theme.shadows.sm};
    margin-left: auto;
    
    &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        min-width: auto;
        padding: 0 ${theme.spacing.sm};
        span {
            display: none;
        }
    }
`;

const StyledBackButton = styled(BackButton)`
    padding-left: 0;
    margin-left: 0;
`;

const Title = styled.h1`
    font-size: ${theme.typography.fontSize.lg};
    margin: 0;
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.medium};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
`;

const StyledContentWrapper = styled(ContentWrapper)`
    padding: 0 ${theme.spacing.lg};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.md};
    }
`;

const InfoCard = styled(Card)`
    margin-bottom: ${theme.spacing.lg};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const DetailsCard = styled(Card)`
    margin-bottom: ${theme.spacing.lg};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.secondary};
    gap: ${theme.spacing.md};
`;

const InfoLabel = styled(Label)`
    margin-bottom: ${theme.spacing.xs};
`;

const InfoValue = styled(DataValue)`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const HeaderDangerActionButton = styled(Button)`
    display: flex;
    align-items: center;
    box-shadow: ${theme.shadows.sm};
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
    background-color: ${theme.colors.status.error.main};
    color: white;
    border-color: ${theme.colors.status.error.main};

    &:hover:not(:disabled) {
        background-color: ${theme.colors.status.error.dark};
        border-color: ${theme.colors.status.error.dark};
        transform: translateY(-1px);
        box-shadow: ${theme.shadows.md};
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.sm};
        span {
            display: none;
        }
    }
`;

const LoadingMessage = styled.p`
    text-align: center;
    margin-top: ${theme.spacing.xl};
    color: ${theme.colors.text.secondary};
`;

const ItemsSection = styled(Card)`
    margin-bottom: ${theme.spacing.lg};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const ItemsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.md};
`;

const ItemsHeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
`;

const AddItemButton = styled(DetailActionButton)``;

const PackButton = styled(AddItemButton)``;

const EmptyItemsMessage = styled.div`
    text-align: center;
    padding: ${theme.spacing.xl};
    color: ${theme.colors.text.secondary};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.md};
`;

const ItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const PackProgress = styled.div`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    margin-right: ${theme.spacing.xs};
    white-space: nowrap;
`;

const DragHandle = styled.div<{ $isDragging?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.text.muted};
    cursor: grab;
    padding: ${theme.spacing.xs};
    margin-left: -${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    touch-action: none;

    &:hover {
        background-color: ${theme.colors.background.gray};
        color: ${theme.colors.text.secondary};
    }

    &:active {
        cursor: grabbing;
    }
    
    ${props => props.$isDragging && `
        opacity: 0;
    `}
`;

const ItemCard = styled.div<{ $isPackMode?: boolean; $isDragging?: boolean; $isDragOver?: boolean }>`
    display: flex;
    flex-direction: column;
    background-color: ${theme.colors.background.light};
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border.default};
    cursor: ${props => props.$isPackMode ? 'pointer' : 'default'};
    transition: box-shadow 0.2s ease, border-color 0.2s ease;

    &[data-packed='true'] {
        background-color: ${theme.colors.status.good.light};
        border-color: ${theme.colors.status.good.main};
    }

    ${props => props.$isDragging && `
        opacity: 0.5;
        border-style: dashed;
        cursor: grabbing;
        box-shadow: ${theme.shadows.md};
    `}
`;

const ItemRowMain = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md};
`;

const ActionIconButton = styled.button<{ $isActive?: boolean }>`
    background: none;
    border: none;
    color: ${props => props.$isActive ? theme.colors.primary : theme.colors.text.muted};
    cursor: pointer;
    padding: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    transition: all 0.2s ease;
    margin-top: 6px;

    &:hover {
        color: ${theme.colors.primary};
        background-color: ${theme.colors.background.gray};
    }
`;

const NoteSection = styled.div`
    padding: 0 ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md};
    border-top: 1px dashed ${theme.colors.border.light};
    margin-top: -${theme.spacing.sm};
    display: flex;
    flex-direction: column;
`;

const NoteInput = styled.textarea`
    width: 100%;
    min-height: 60px;
    padding: ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid transparent;
    background-color: transparent;
    font-size: ${theme.typography.fontSize.sm};
    font-family: inherit;
    resize: vertical;
    margin-top: ${theme.spacing.xs};
    transition: all 0.2s ease;
    
    &:hover {
        background-color: ${theme.colors.background.gray};
    }
    
    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        background-color: ${theme.colors.primary}0a;
        box-shadow: 0 0 0 1px ${theme.colors.primary}33;
    }
`;

const NoteDisplay = styled.div`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    white-space: pre-wrap;
    margin-top: ${theme.spacing.xs};
    padding: ${theme.spacing.sm};
    background-color: transparent;
`;

const Checkbox = styled.input`
    margin-top: 3px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${theme.colors.primary};
`;

const PackCheckboxWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    padding-top: 2px;
`;

const ItemInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const ItemName = styled.div`
    font-weight: ${theme.typography.fontWeight.medium};
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing.sm};
`;

const PackedBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px;
    border-radius: 999px;
    background-color: ${theme.colors.status.good.main};
    color: white;
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.semibold};

    & svg {
        color: white;
    }
`;

const ItemMeta = styled.div`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.muted};
`;

const QuantityInput = styled(Input)<{ $isError?: boolean }>`
    width: 65px;
    padding: ${theme.spacing.sm};
    text-align: center;
    ${({ $isError }) => $isError && `
        color: ${theme.colors.status.error.main};
        border-color: ${theme.colors.status.error.main};
        background-color: ${theme.colors.status.error.light};
    `}
`;

const QuantityWarning = styled.div`
    color: ${theme.colors.status.error.main};
    font-size: 10px;
    margin-top: 2px;
    font-weight: ${theme.typography.fontWeight.medium};
`;

const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.sm};
    border: none;
    background: transparent;
    color: ${theme.colors.status.error.main};
    cursor: pointer;
    border-radius: ${theme.borderRadius.md};
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${theme.colors.status.error.light};
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalBox = styled.div`
    background: white;
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.lg};
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
`;

const ModalText = styled.p`
    margin: 0 0 ${theme.spacing.lg} 0;
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    line-height: 1.5;
`;

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.xs};
    border: none;
    background: transparent;
    color: ${theme.colors.text.secondary};
    cursor: pointer;
    border-radius: ${theme.borderRadius.md};
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${theme.colors.background.light};
        color: ${theme.colors.text.primary};
    }
`;

const ModalContent = styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
`;

const SearchInput = styled(Input)`
    width: 100%;
`;

const ItemsSelect = styled.div`
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.borderRadius.md};
    background-color: ${theme.colors.background.light};
`;

const ItemOption = styled.div<{ $selected: boolean }>`
    padding: ${theme.spacing.md};
    cursor: pointer;
    border-bottom: 1px solid ${theme.colors.border.default};
    background-color: ${({ $selected }) => ($selected ? theme.colors.primaryLight : theme.colors.background.white)};
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${({ $selected }) => ($selected ? theme.colors.primaryLight : theme.colors.background.light)};
    }

    &:last-child {
        border-bottom: none;
    }
`;

const ItemOptionName = styled.div`
    font-weight: ${theme.typography.fontWeight.medium};
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs};
`;

const ItemOptionMeta = styled.div`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.muted};
`;

const EmptyMessage = styled.div`
    padding: ${theme.spacing.xl};
    text-align: center;
    color: ${theme.colors.text.muted};
`;

const QuantitySection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const ModalButtons = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    width: 100%;
    
    & > * {
        flex: 1;
    }
`;

const ModalButton = styled(DetailActionButton)`
    padding: 0 ${theme.spacing.lg};
    min-width: 0;
`;

const DangerModalButton = styled(ModalButton)`
    background-color: ${theme.colors.status.error.main};
    color: white;
    border: 1px solid ${theme.colors.status.error.main};

    &:hover:not(:disabled) {
        background-color: ${theme.colors.status.error.dark};
        border-color: ${theme.colors.status.error.dark};
        transform: translateY(-1px);
        box-shadow: ${theme.shadows.md};
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
`;

const PackingPlanDetails = () => {
    const { planId } = useParams<{ planId: string }>();
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeletingPlan, setIsDeletingPlan] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('1');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [editingQuantities, setEditingQuantities] = useState<Record<string, string>>({});
    const [packMode, setPackMode] = useState(false);
    const [packedItemIds, setPackedItemIds] = useState<Set<string>>(new Set());
    const [localPlanItems, setLocalPlanItems] = useState<IPackingPlanItem[]>([]);
    const navigate = useNavigate();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const plan = planId ? packingPlanApi.usePackingPlan(planId) : undefined;
    const planItems = planId ? packingPlanApi.usePackingPlanItems(planId) : [];
    const allInventoryItems = inventoryApi.useItems();
    const scenarioTypes = packingPlanApi.useScenarioTypes();

    useEffect(() => {
        setLocalPlanItems(planItems);
    }, [planItems]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setLocalPlanItems((items) => {
                const oldIndex = items.findIndex((i: IPackingPlanItem) => i.id === active.id);
                const newIndex = items.findIndex((i: IPackingPlanItem) => i.id === over.id);
                const newArray = arrayMove(items, oldIndex, newIndex);
                
                const updatedItems = newArray.map((item, i) => ({ ...item, order: i }));
                
                // Fire and forget save
                const updates = updatedItems.map(item => ({ id: item.id, order: item.order }));
                packingPlanApi.updatePackingPlanItemOrders(updates).catch(err => {
                    console.error(err);
                    alert('Fehler beim Speichern der neuen Reihenfolge.');
                });

                return updatedItems;
            });
        }
    };

    const handleUpdateNote = async (itemId: string, newNote: string) => {
        try {
            await packingPlanApi.updatePackingPlanItem(itemId, { notes: newNote });
        } catch (error) {
            console.error('Failed to update note:', error);
            alert('Fehler beim Speichern der Notiz.');
        }
    };

    const handleAddItem = async () => {
        // Add a new item row to the plan (after basic checks).
        const qtyNum = parseInt(quantity, 10);
        if (!planId || !selectedItemId || isNaN(qtyNum) || qtyNum < 1) {
            alert('Bitte wählen Sie einen Artikel und geben Sie eine gültige Menge ein.');
            return;
        }

        // Check if item already exists in plan
        const existingItem = planItems.find((item: IPackingPlanItem) => item.Iid.toString() === selectedItemId);
        if (existingItem) {
            alert('Dieser Artikel befindet sich bereits im Packplan.');
            return;
        }

        try {
            const maxOrder = planItems.length > 0 ? Math.max(...planItems.map((i) => i.order)) : -1;
            await packingPlanApi.addPackingPlanItem({
                packingPlanId: planId,
                Iid: Number(selectedItemId),
                requiredQuantity: qtyNum,
                order: maxOrder + 1,
            });
            setShowAddItemModal(false);
            setSelectedItemId('');
            setQuantity('1');
            setSearchTerm('');
        } catch (error) {
            console.error('Failed to add item:', error);
            alert('Fehler beim Hinzufügen des Artikels zum Packplan.');
        }
    };

    // Sync editing quantities with plan items
    useEffect(() => {
        if (planItems.length > 0) {
            setEditingQuantities(prev => {
                const next = { ...prev };
                planItems.forEach((item: IPackingPlanItem) => {
                    // Initialize with current value if not already being edited
                    if (next[item.id] === undefined) {
                        next[item.id] = item.requiredQuantity.toString();
                    }
                });
                return next;
            });
        }
    }, [planItems]);

    const handleUpdateQuantity = async (itemId: string, newValue: string) => {
        // Update local editing state
        setEditingQuantities(prev => ({ ...prev, [itemId]: newValue }));

        const newQuantity = parseInt(newValue, 10);
        // Only update DB if it's a valid positive number
        if (!isNaN(newQuantity) && newQuantity >= 1) {
            try {
                await packingPlanApi.updatePackingPlanItem(itemId, { requiredQuantity: newQuantity });
            } catch (error) {
                console.error('Failed to update quantity:', error);
                // We keep the local value as is, but could potentially revert if needed
            }
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        // Remove an item row from the plan.
        if (!window.confirm('Sind Sie sicher, dass Sie diesen Artikel aus dem Packplan entfernen möchten?')) {
            return;
        }
        try {
            await packingPlanApi.deletePackingPlanItem(itemId);
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('Fehler beim Entfernen des Artikels aus dem Packplan.');
        }
    };

    // Get item details for display
    const getItemDetails = (itemId: number): IItem | undefined => {
        return allInventoryItems.find((item) => item.id === itemId);
    };

    // Persist per-plan packed state in localStorage (if available).
    const packedStorageKey = useMemo(() => {
        if (!planId) return '';
        return `packingPlan:${planId}:packedItemIds`;
    }, [planId]);

    useEffect(() => {
        if (!packedStorageKey) return;
        try {
            const raw = localStorage.getItem(packedStorageKey);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return;
            setPackedItemIds(new Set(parsed.filter((x) => typeof x === 'string')));
        } catch {}
    }, [packedStorageKey]);

    useEffect(() => {
        if (!packedStorageKey) return;
        if (packedItemIds.size === 0) return;
        try {
            localStorage.setItem(packedStorageKey, JSON.stringify(Array.from(packedItemIds)));
        } catch {}
    }, [packedItemIds, packedStorageKey]);

    useEffect(() => {
        if (!planId || planItems.length === 0) return;
        const itemIdsInPlan = new Set(planItems.map((pi: IPackingPlanItem) => pi.Iid.toString()));
        setPackedItemIds((prev) => {
            if (prev.size === 0) return prev;
            const next = new Set(Array.from(prev).filter((id) => itemIdsInPlan.has(id)));
            return next.size === prev.size ? prev : next;
        });
    }, [planId, planItems]);

    const togglePacked = (itemId: string) => {
        // Toggle packed/unpacked for an item row.
        setPackedItemIds((prev) => {
            const next = new Set(prev);
            if (next.has(itemId)) next.delete(itemId);
            else next.add(itemId);
            return next;
        });
    };

    const packedCount = planItems.reduce((acc: number, pi: IPackingPlanItem) => acc + (packedItemIds.has(pi.Iid.toString()) ? 1 : 0), 0);

    // Filter inventory items for modal
    const filteredInventoryItems = allInventoryItems.filter((item) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(term) ||
            item.id.toString().includes(term) ||
            (item.inventoryNumber && item.inventoryNumber.toLowerCase().includes(term)) ||
            (item.location && item.location.toLowerCase().includes(term))
        );
    });

    // Exclude items already in the plan
    const availableItems = filteredInventoryItems.filter(
        (item) => !planItems.some((planItem) => planItem.Iid === item.id)
    );

    if (!plan) {
        return (
            <StyledContainer>
                <LoadingMessage>Lade Einstellungen...</LoadingMessage>
            </StyledContainer>
        );
    }

    const scenario = scenarioTypes.find((t: IScenarioType) => t.id === plan.scenarioType);
    const Icon = scenario ? getIconComponent(scenario.icon) : getIconComponent('Package');
    const scenarioLabel = scenario ? scenario.name : 'Unbekannt';

    const openDeleteConfirm = () => setShowDeleteConfirm(true);

    const handleConfirmDeletePlan = async () => {
        if (!planId) return;
        setIsDeletingPlan(true);
        try {
            await packingPlanApi.deletePackingPlan(planId);
            navigate('/packing-plans', { replace: true });
        } catch (error) {
            console.error('Failed to delete packing plan:', error);
            alert('Failed to delete packing plan.');
        } finally {
            setIsDeletingPlan(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <StyledContainer>
            <StyledHeader>
                <HeaderContent>
                    <StyledBackButton onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                    </StyledBackButton>
                    <Title>
                        <IconContainer icon={Icon} />
                        {plan.name}
                    </Title>
                    <HeaderEditButton $variant="primary" onClick={() => navigate(`/packing-plans/${plan.id}/edit`)}>
                        <IconContainer icon={Pen} />
                        <span>Bearbeiten</span>
                    </HeaderEditButton>
                    <HeaderDangerActionButton type="button" onClick={openDeleteConfirm}>
                        <IconContainer icon={Trash2} />
                        <span>Löschen</span>
                    </HeaderDangerActionButton>
                </HeaderContent>
            </StyledHeader>

            <StyledContentWrapper>
                <InfoCard>
                    <InfoRow>
                        <div style={{ flex: 1 }}>
                            <InfoLabel>Szenario</InfoLabel>
                            <InfoValue>{scenarioLabel}</InfoValue>
                        </div>
                    </InfoRow>
                </InfoCard>

                <DetailsCard>
                    <InfoLabel>Beschreibung</InfoLabel>
                    <InfoValue style={{ whiteSpace: 'pre-wrap' }}>
                        {plan.description || <span style={{ whiteSpace: 'normal', fontStyle: 'italic', color: theme.colors.text.muted }}>Keine Beschreibung vorhanden</span>}
                    </InfoValue>
                </DetailsCard>

                <ItemsSection>
                    <ItemsHeader>
                        <InfoLabel>Artikel ({planItems.length})</InfoLabel>
                        <ItemsHeaderActions>
                            {packMode ? (
                                <>
                                    <PackProgress>
                                        {packedCount}/{planItems.length} gepackt
                                    </PackProgress>
                                    <PackButton $variant="primary" onClick={() => setPackMode(false)}>
                                        <IconContainer icon={Check} />
                                        <span>Speichern</span>
                                    </PackButton>
                                </>
                            ) : (
                                <>
                                    <AddItemButton
                                        $variant="primary"
                                        onClick={() =>
                                            navigate('/items', {
                                                state: {
                                                    packMode: true, // automatically activate pack mode
                                                    planId: planId, // remember which packing plan to add to
                                                    planName: plan.name, // Pass the plan name
                                                },
                                            })
                                        }
                                    >
                                        <IconContainer icon={Plus} />
                                        <span>Artikel hinzufügen</span>
                                    </AddItemButton>
                                    <PackButton $variant="ghost" onClick={() => setPackMode(true)}>
                                        <IconContainer icon={Package} />
                                        <span>Packen</span>
                                    </PackButton>
                                </>
                            )}
                        </ItemsHeaderActions>
                    </ItemsHeader>

                    {localPlanItems.length === 0 ? (
                        <EmptyItemsMessage>
                            <p>Noch keine Artikel in diesem Packplan vorhanden.</p>
                        </EmptyItemsMessage>
                    ) : (
                        <DndContext 
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext 
                                items={localPlanItems.map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <ItemsList>
                                    {localPlanItems.map((planItem) => (
                                        <SortableItemRow
                                            key={planItem.id}
                                            planItem={planItem}
                                            itemDetails={getItemDetails(planItem.Iid)}
                                            isPacked={packedItemIds.has(planItem.Iid.toString())}
                                            packMode={packMode}
                                            editingQuantity={editingQuantities[planItem.id] || ''}
                                            onUpdateQuantity={handleUpdateQuantity}
                                            onTogglePacked={togglePacked}
                                            onDelete={handleDeleteItem}
                                            onUpdateNote={handleUpdateNote}
                                        />
                                    ))}
                                </ItemsList>
                            </SortableContext>
                        </DndContext>
                    )}
                </ItemsSection>
            </StyledContentWrapper>

            {showDeleteConfirm && (
                <ModalOverlay
                    onClick={() => {
                        if (isDeletingPlan) return;
                        setShowDeleteConfirm(false);
                    }}
                >
                    <ModalBox onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <ModalHeader>
                            <ModalTitle>Packplan löschen?</ModalTitle>
                            <CloseButton
                                type="button"
                                onClick={() => {
                                    if (isDeletingPlan) return;
                                    setShowDeleteConfirm(false);
                                }}
                                aria-label="Close"
                            >
                                <IconContainer icon={X} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalText>
                            Diese Aktion kann nicht rückgängig gemacht werden.
                        </ModalText>

                        <ModalButtons>
                            <ModalButton
                                $variant="ghost"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeletingPlan}
                            >
                                Abbrechen
                            </ModalButton>
                            <DangerModalButton onClick={handleConfirmDeletePlan} disabled={isDeletingPlan}>
                                {isDeletingPlan ? 'Löschen…' : 'Löschen'}
                            </DangerModalButton>
                        </ModalButtons>
                    </ModalBox>
                </ModalOverlay>
            )}

            {showAddItemModal && (
                <ModalOverlay onClick={() => setShowAddItemModal(false)}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Add Item to Packing Plan</ModalTitle>
                            <CloseButton onClick={() => setShowAddItemModal(false)}>
                                <IconContainer icon={X} />
                            </CloseButton>
                        </ModalHeader>
                        <ModalContent>
                            <SearchInput
                                type="text"
                                placeholder="Suche Artikel nach Name, ID, Inventarnummer oder Ort..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <ItemsSelect>
                                {availableItems.length === 0 ? (
                                    <EmptyMessage>
                                        {searchTerm
                                            ? 'Keine Artikel gefunden, die der Suche entsprechen.'
                                            : 'Keine Artikel zum Hinzufügen vorhanden.'}
                                    </EmptyMessage>
                                ) : (
                                    availableItems.map((item) => (
                                        <ItemOption
                                            key={item.id}
                                            onClick={() => setSelectedItemId(item.id.toString())}
                                            $selected={selectedItemId === item.id.toString()}
                                        >
                                            <div>
                                                <ItemOptionName>{item.name}</ItemOptionName>
                                                <ItemOptionMeta>
                                                    ID: {item.id}
                                                    {item.inventoryNumber && ` • ${item.inventoryNumber}`}
                                                    {item.location && ` • ${item.location}`}
                                                </ItemOptionMeta>
                                            </div>
                                        </ItemOption>
                                    ))
                                )}
                            </ItemsSelect>
                            {selectedItemId && (
                                <QuantitySection>
                                    <Label htmlFor="quantity">Menge</Label>
                                    <QuantityInput
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        $isError={(() => {
                                            const item = getItemDetails(Number(selectedItemId));
                                            return !!item && parseInt(quantity, 10) > item.availability;
                                        })()}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                    {(() => {
                                        const item = getItemDetails(Number(selectedItemId));
                                        if (item && parseInt(quantity, 10) > item.availability) {
                                            return <QuantityWarning>Max: {item.availability} verfügbar</QuantityWarning>;
                                        }
                                        return null;
                                    })()}
                                </QuantitySection>
                            )}
                        </ModalContent>
                        <ModalButtons>
                            <ModalButton $variant="ghost" onClick={() => setShowAddItemModal(false)}>
                                Abbrechen
                            </ModalButton>
                            <ModalButton
                                $variant="primary"
                                onClick={handleAddItem}
                                disabled={!selectedItemId || !quantity || parseInt(quantity, 10) < 1}
                            >
                                Artikel hinzufügen
                            </ModalButton>
                        </ModalButtons>
                    </ModalBox>
                </ModalOverlay>
            )}
        </StyledContainer>
    );
};

interface SortableItemRowProps {
    planItem: IPackingPlanItem;
    itemDetails: IItem | undefined;
    isPacked: boolean;
    packMode: boolean;
    editingQuantity: string;
    onUpdateQuantity: (id: string, value: string) => void;
    onTogglePacked: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateNote: (id: string, newNote: string) => void;
}

const SortableItemRow = ({
    planItem,
    itemDetails,
    isPacked,
    packMode,
    editingQuantity,
    onUpdateQuantity,
    onTogglePacked,
    onDelete,
    onUpdateNote
}: SortableItemRowProps) => {
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteValue, setNoteValue] = useState(planItem.notes || '');

    useEffect(() => {
        if (!isEditingNote) {
            setNoteValue(planItem.notes || '');
        }
    }, [planItem.notes, isEditingNote]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: planItem.id, disabled: packMode });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    const itemName = itemDetails?.name ?? 'Unknown item';
    const itemId = itemDetails?.id ?? planItem.Iid;
    const inventoryNumber = itemDetails?.inventoryNumber;
    const location = itemDetails?.location;
    const missingNote = itemDetails ? '' : ' • Item missing from inventory';
    const isError = itemDetails && parseInt(editingQuantity || '0', 10) > itemDetails.availability;

    return (
        <ItemCard 
            ref={setNodeRef}
            style={style}
            data-packed={isPacked ? 'true' : 'false'}
            onClick={() => packMode && onTogglePacked(planItem.Iid.toString())}
            $isPackMode={packMode}
            $isDragging={isDragging}
        >
            <ItemRowMain>
                {!packMode && (
                    <DragHandle {...attributes} {...listeners} $isDragging={isDragging}>
                        <IconContainer icon={GripVertical} width="20px" height="20px" />
                    </DragHandle>
                )}
                <ItemInfo>
                    <ItemName>
                        <span>{itemName}</span>
                        {isPacked && (
                            <PackedBadge>
                                <IconContainer icon={CheckCircle2} />
                                gepackt
                            </PackedBadge>
                        )}
                    </ItemName>
                    <ItemMeta>
                        ID: {itemId}
                        {inventoryNumber && ` • Inventarnr.: ${inventoryNumber}`}
                        {location && ` • Ort: ${location}`}
                        {missingNote}
                    </ItemMeta>
                </ItemInfo>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <QuantityInput
                        type="number"
                        min="1"
                        value={editingQuantity}
                        $isError={!!isError}
                        onChange={(e) => onUpdateQuantity(planItem.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {isError && (
                        <QuantityWarning>Max: {itemDetails.availability}</QuantityWarning>
                    )}
                </div>
                {packMode ? (
                    <PackCheckboxWrapper>
                        <Checkbox
                            type="checkbox"
                            checked={isPacked}
                            onChange={() => onTogglePacked(planItem.Iid.toString())}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </PackCheckboxWrapper>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DeleteButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(planItem.id);
                            }}
                            title="Artikel entfernen"
                        >
                            <IconContainer icon={Trash2} />
                        </DeleteButton>
                        <ActionIconButton
                            $isActive={isEditingNote || !!planItem.notes}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isEditingNote) {
                                    onUpdateNote(planItem.id, noteValue);
                                    setIsEditingNote(false);
                                } else {
                                    setIsEditingNote(true);
                                }
                            }}
                            title={isEditingNote ? "Notiz speichern" : "Notiz hinzufügen/bearbeiten"}
                        >
                            <IconContainer icon={isEditingNote ? Check : MessageSquare} />
                        </ActionIconButton>
                    </div>
                )}
            </ItemRowMain>

            {(isEditingNote || planItem.notes) && (
                <NoteSection>
                    {isEditingNote ? (
                        <NoteInput 
                            value={noteValue} 
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteValue(e.target.value)} 
                            placeholder="Anmerkung..."
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            autoFocus
                        />
                    ) : (
                        <NoteDisplay>{planItem.notes}</NoteDisplay>
                    )}
                </NoteSection>
            )}
        </ItemCard>
    );
};

export default PackingPlanDetails;

