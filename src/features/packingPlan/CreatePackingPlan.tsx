import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft, Plus, X, Trash2 } from 'lucide-react';
import { packingPlanApi } from '../../app/packingPlanApi';
import { inventoryApi } from '../../app/api';
import type { IItem } from '../../db/items';
import IconContainer from '../../utils/IconContainer';
import {
    Container,
    Card,
    FormGroup,
    Label,
    Input,
    Select,
    Textarea,
    Button,
    ContentWrapper,
    BackButton,
    Header,
    ButtonGroup,
} from '../../styles/components';
import { theme } from '../../styles/theme';

const StyledContainer = styled(Container)`
    padding-top: 8px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};

    @media (min-width: ${theme.breakpoints.lg}) {
        margin: 0 auto;
    }
`;

const StyledHeader = styled(Header)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.lg};
    margin-bottom: 0;
    gap: ${theme.spacing.md};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md};
    }
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    flex: 1;
    min-width: 0;
`;

const Title = styled.h1`
    font-size: ${theme.typography.fontSize.xxl};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0;
    flex: 1;
    min-width: 0;
`;

const StyledBackButton = styled(BackButton)`
    padding-left: 0;
    margin-left: 0;
`;

const StyledContentWrapper = styled(ContentWrapper)`
    padding: 0 ${theme.spacing.lg};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.md};
    }
`;

const StyledCard = styled(Card)`
    padding: ${theme.spacing.xl};
    box-shadow: ${theme.shadows.sm};
    border-radius: ${theme.borderRadius.lg};
    margin-top: 0;
`;

const StyledFormGroup = styled(FormGroup)`
    margin-bottom: ${theme.spacing.lg};
`;

const StyledButtonGroup = styled(ButtonGroup)`
    margin-top: ${theme.spacing.xl};
    width: 100%;
    flex-direction: row;
    gap: ${theme.spacing.md};
`;

const StyledButton = styled(Button)`
    height: 48px;
    font-size: ${theme.typography.fontSize.base};
    padding: 0 ${theme.spacing.xl};
`;

const ErrorText = styled.small`
    color: ${theme.colors.status.error.dark};
    display: block;
    margin-top: ${theme.spacing.xs};
`;

const ItemsSection = styled(Card)`
    margin-top: ${theme.spacing.xl};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const ItemsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.md};
`;

const AddItemButton = styled(Button)`
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
`;

const EmptyItemsMessage = styled.div`
    text-align: center;
    padding: ${theme.spacing.lg};
    color: ${theme.colors.text.secondary};
`;

const ItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const ItemRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md};
    background-color: ${theme.colors.background.light};
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border.default};
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
`;

const ItemMeta = styled.div`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.muted};
`;

const QuantityInput = styled(Input)<{ $isError?: boolean }>`
    width: 80px;
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

const ModalButton = styled(Button)`
    height: 36px;
    padding: 0 ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.sm};
`;



interface TempPackingPlanItem {
    Iid: number;
    quantity: string;
}

const CreatePackingPlan = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<{
        name: string;
        scenarioType: string;
        description: string;
    }>({
        name: '',
        scenarioType: 'flood',
        description: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<string>('1');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [tempItems, setTempItems] = useState<TempPackingPlanItem[]>([]);

    const allInventoryItems = inventoryApi.useItems();
    const scenarioTypes = packingPlanApi.useScenarioTypes();

    // Default to the first available scenario if none is set
    useEffect(() => {
        if (scenarioTypes.length > 0 && formData.scenarioType === 'flood') {
            setFormData(prev => ({ ...prev, scenarioType: scenarioTypes[0].id }));
        }
    }, [scenarioTypes]);

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));

        if (errors[key]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name ist erforderlich.';
        }

        if (!formData.scenarioType) {
            newErrors.scenarioType = 'Szenario ist erforderlich.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddTempItem = () => {
        const qtyNum = parseInt(quantity, 10);
        if (selectedItemId === null || isNaN(qtyNum) || qtyNum < 1) {
            alert('Bitte wählen Sie einen Artikel und geben Sie eine gültige Menge ein.');
            return;
        }

        if (tempItems.some((item) => item.Iid === selectedItemId)) {
            alert('Dieser Artikel wurde bereits hinzugefügt.');
            return;
        }

        setTempItems((prev) => [...prev, { Iid: selectedItemId, quantity }]);
        setShowAddItemModal(false);
        setSelectedItemId(null);
        setQuantity('1');
        setSearchTerm('');
    };

    const handleRemoveTempItem = (Iid: number) => {
        setTempItems((prev) => prev.filter((item) => item.Iid !== Iid));
    };

    const handleUpdateTempQuantity = (Iid: number, newQuantity: string) => {
        setTempItems((prev) => prev.map((item) => (item.Iid === Iid ? { ...item, quantity: newQuantity } : item)));
    };

    const getItemDetails = (Iid: number): IItem | undefined => {
        return allInventoryItems.find((item) => item.id === Iid);
    };

    const filteredInventoryItems = allInventoryItems.filter((item) => {
        if (!searchTerm) return true;

        const term = searchTerm.toLowerCase();

        return (
            item.name.toLowerCase().includes(term) ||
            item.itemId.toLowerCase().includes(term) ||
            (item.inventoryNumber ? item.inventoryNumber.toLowerCase().includes(term) : false) ||
            (item.location ? item.location.toLowerCase().includes(term) : false)
        );
    });

    const availableItems = filteredInventoryItems.filter(
        (item) => !tempItems.some((tempItem) => tempItem.Iid === item.id)
    );

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);

        try {
            const planId = await packingPlanApi.addPackingPlan({
                name: formData.name.trim(),
                scenarioType: formData.scenarioType,
                description: formData.description.trim() || undefined,
            });

            for (let i = 0; i < tempItems.length; i++) {
                const qtyNum = parseInt(tempItems[i].quantity, 10);
                if (isNaN(qtyNum) || qtyNum < 1) continue; // Skip invalid quantities

                await packingPlanApi.addPackingPlanItem({
                    packingPlanId: planId,
                    Iid: tempItems[i].Iid,
                    requiredQuantity: qtyNum,
                    order: i,
                });
            }

            navigate(`/packing-plans/${planId}`);
        } catch (error) {
            console.error('Failed to create packing plan:', error);
            alert('Fehler beim Erstellen des Packplans.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderError = (key: string) => (errors[key] ? <ErrorText>{errors[key]}</ErrorText> : null);

    return (
        <StyledContainer>
            <StyledHeader>
                <HeaderLeft>
                    <StyledBackButton onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                    </StyledBackButton>
                    <Title>Packplan erstellen</Title>
                </HeaderLeft>
            </StyledHeader>

            <StyledContentWrapper>
                <StyledCard>
                    <StyledFormGroup>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="z.B. Hochwasser"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        {renderError('name')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="scenarioType">Szenario</Label>
                        <Select
                            id="scenarioType"
                            name="scenarioType"
                            value={formData.scenarioType}
                            onChange={(e) => handleChange('scenarioType', e.target.value)}
                        >
                            {scenarioTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </Select>
                        {renderError('scenarioType')}
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="description">Beschreibung</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Füge eine Beschreibung hinzu..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                        />
                    </StyledFormGroup>

                    <ItemsSection>
                        <ItemsHeader>
                            <Label>Artikel ({tempItems.length})</Label>
                            <AddItemButton $variant="primary" onClick={() => setShowAddItemModal(true)}>
                                <IconContainer icon={Plus} />
                                <span>Artikel hinzufügen</span>
                            </AddItemButton>
                        </ItemsHeader>

                        {tempItems.length === 0 ? (
                            <EmptyItemsMessage>
                                <p>Noch keine Artikel hinzugefügt.</p>
                            </EmptyItemsMessage>
                        ) : (
                            <ItemsList>
                                {tempItems.map((tempItem) => {
                                    const item = getItemDetails(tempItem.Iid);
                                    if (!item) return null;

                                    return (
                                        <ItemRow key={tempItem.Iid}>
                                            <ItemInfo>
                                                <ItemName>{item.name}</ItemName>
                                                <ItemMeta>
                                                    ID: {item.itemId}
                                                    {item.inventoryNumber && ` • Inventarnr.: ${item.inventoryNumber}`}
                                                    {item.location && ` • Ort: ${item.location}`}
                                                </ItemMeta>
                                            </ItemInfo>

                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <QuantityInput
                                                    type="number"
                                                    min="1"
                                                    value={tempItem.quantity}
                                                    $isError={!!item && parseInt(tempItem.quantity, 10) > item.availability}
                                                    onChange={(e) => {
                                                        handleUpdateTempQuantity(tempItem.Iid, e.target.value);
                                                    }}
                                                />
                                                {item && parseInt(tempItem.quantity, 10) > item.availability && (
                                                    <QuantityWarning>Max: {item.availability}</QuantityWarning>
                                                )}
                                            </div>

                                            <DeleteButton
                                                onClick={() => handleRemoveTempItem(tempItem.Iid)}
                                                title="Artikel entfernen"
                                            >
                                                <IconContainer icon={Trash2} />
                                            </DeleteButton>
                                        </ItemRow>
                                    );
                                })}
                            </ItemsList>
                        )}
                    </ItemsSection>

                    <StyledButtonGroup>
                        <StyledButton $variant="ghost" onClick={() => navigate(-1)} disabled={isSaving}>
                            Abbrechen
                        </StyledButton>
                        <StyledButton $variant="primary" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Speichern...' : 'Speichern'}
                        </StyledButton>
                    </StyledButtonGroup>
                </StyledCard>
            </StyledContentWrapper>

            {showAddItemModal && (
                <ModalOverlay onClick={() => setShowAddItemModal(false)}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Artikel zum Packplan hinzufügen</ModalTitle>
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
                                            onClick={() => setSelectedItemId(item.id)}
                                            $selected={selectedItemId === item.id}
                                        >
                                            <div>
                                                <ItemOptionName>{item.name}</ItemOptionName>
                                                <ItemOptionMeta>
                                                    ID: {item.itemId}
                                                    {item.inventoryNumber && ` • ${item.inventoryNumber}`}
                                                    {item.location && ` • ${item.location}`}
                                                </ItemOptionMeta>
                                            </div>
                                        </ItemOption>
                                    ))
                                )}
                            </ItemsSelect>

                            {selectedItemId !== null && (
                                <QuantitySection>
                                    <Label htmlFor="quantity">Menge</Label>
                                    <QuantityInput
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        $isError={(() => {
                                            const item = getItemDetails(selectedItemId);
                                            return !!item && parseInt(quantity, 10) > item.availability;
                                        })()}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                    {(() => {
                                        const item = getItemDetails(selectedItemId);
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
                                onClick={handleAddTempItem}
                                disabled={selectedItemId === null || !quantity || parseInt(quantity, 10) < 1}
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

export default CreatePackingPlan;
