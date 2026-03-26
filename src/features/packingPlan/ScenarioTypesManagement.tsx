import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { packingPlanApi } from '../../app/packingPlanApi';
import { SCENARIO_ICONS, getIconComponent } from '../../utils/scenarioIcons';
import IconContainer from '../../utils/IconContainer';
import { theme } from '../../styles/theme';
import type { IScenarioType } from '../../db/packingPlans';

import {
    Container,
    BackButton,
    ContentWrapper,
    Button,
    Card,
    Label,
    Input
} from '../../styles/components';

const StyledContainer = styled(Container)`
    padding-top: 8px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};
    margin: 0 auto;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${theme.spacing.lg} ${theme.spacing.xl} 0;
    margin-bottom: 0;
    gap: ${theme.spacing.md};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.sm} ${theme.spacing.lg} 0;
    }
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    flex: 1;
    min-width: 0;
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
`;

const Title = styled.h1`
    font-size: ${theme.typography.fontSize.xxl};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0;
    flex: 1;
    min-width: 0;
`;

const CreateButton = styled(Button)`
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
    box-shadow: ${theme.shadows.sm};
    
    &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-1px);
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        width: 36px;
        padding: 0;
        span {
            display: none;
        }
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${theme.spacing.md};
`;

const ScenarioCard = styled(Card)`
    display: flex;
    align-items: center;
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.md};
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.md};
    }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background-color: ${theme.colors.background.gray};
    border-radius: ${theme.borderRadius.md};
    color: ${theme.colors.primary};
`;

const ScenarioName = styled.div`
    flex: 1;
    font-weight: 500;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.md};
`;

const Actions = styled.div`
    display: flex;
    opacity: 0.5;
    transition: opacity 0.2s ease;
    
    ${ScenarioCard}:hover & {
        opacity: 1;
    }
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.status.error.main};
    cursor: pointer;
    padding: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};

    &:hover {
        background-color: ${theme.colors.status.error.light};
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: ${theme.colors.background.light};
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
    width: 90%;
    max-width: 400px;
    box-shadow: ${theme.shadows.lg};

    h2 {
        margin-top: 0;
        margin-bottom: ${theme.spacing.lg};
        color: ${theme.colors.text.primary};
    }
`;

const IconGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.xl};
`;

const IconSelectBtn = styled.button<{ $isSelected?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    background-color: ${props => props.$isSelected ? theme.colors.primary + '1a' : 'transparent'};
    border: 2px solid ${props => props.$isSelected ? theme.colors.primary : theme.colors.border.default};
    border-radius: ${theme.borderRadius.md};
    color: ${props => props.$isSelected ? theme.colors.primary : theme.colors.text.secondary};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${theme.colors.primary};
        color: ${theme.colors.primary};
    }
`;

const ModalButtons = styled.div<{ $fullWidth?: boolean }>`
    display: flex;
    justify-content: ${props => props.$fullWidth ? 'stretch' : 'flex-end'};
    gap: ${theme.spacing.md};
    
    ${props => props.$fullWidth && `
        & > * {
            flex: 1;
        }
    `}
`;

const ScenarioTypesManagement = () => {
    const navigate = useNavigate();
    const scenarioTypes = packingPlanApi.useScenarioTypes();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState<string>('Package');
    const [deleteConfirmType, setDeleteConfirmType] = useState<IScenarioType | null>(null);
    const [deletePlanCount, setDeletePlanCount] = useState(0);

    const handleOpenAdd = () => {
        setEditingId(null);
        setName('');
        setSelectedIcon('Package');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (type: IScenarioType) => {
        setEditingId(type.id);
        setName(type.name);
        setSelectedIcon(type.icon);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        
        try {
            if (editingId) {
                await packingPlanApi.updateScenarioType(editingId, { name: name.trim(), icon: selectedIcon });
            } else {
                await packingPlanApi.addScenarioType({ name: name.trim(), icon: selectedIcon });
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Fehler beim Speichern');
        }
    };

    const handleOpenDelete = async (type: IScenarioType, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const count = await packingPlanApi.getPackingPlanCountForScenario(type.id);
            setDeletePlanCount(count);
            setDeleteConfirmType(type);
        } catch (err) {
            console.error(err);
            alert('Fehler beim Abrufen der Plan-Anzahl');
        }
    };

    const handleFinalDelete = async () => {
        if (!deleteConfirmType) return;
        try {
            await packingPlanApi.deleteScenarioType(deleteConfirmType.id);
            setDeleteConfirmType(null);
        } catch (err) {
            console.error(err);
            alert('Fehler beim Löschen');
        }
    };

    return (
        <StyledContainer>
            <Header>
                <HeaderLeft>
                    <BackButton onClick={() => navigate('/packing-plans')}>
                        <IconContainer icon={ChevronLeft} />
                    </BackButton>
                    <Title>Szenario-Typen</Title>
                </HeaderLeft>
                <HeaderRight>
                    <CreateButton $variant="primary" onClick={handleOpenAdd}>
                        <IconContainer icon={Plus} />
                        <span>Neu</span>
                    </CreateButton>
                </HeaderRight>
            </Header>

            <ContentWrapper>
                <Grid>
                    {scenarioTypes.map((type) => {
                        const Icon = getIconComponent(type.icon);
                        return (
                            <ScenarioCard key={type.id} onClick={() => handleOpenEdit(type)}>
                                <IconWrapper>
                                    <IconContainer icon={Icon} width="24px" height="24px" />
                                </IconWrapper>
                                <ScenarioName>{type.name}</ScenarioName>
                                <Actions>
                                    {type.id !== 'custom' && (
                                        <ActionButton onClick={(e) => handleOpenDelete(type, e)}>
                                            <IconContainer icon={Trash2} />
                                        </ActionButton>
                                    )}
                                </Actions>
                            </ScenarioCard>
                        );
                    })}
                </Grid>
            </ContentWrapper>

            {isModalOpen && (
                <ModalOverlay onClick={() => setIsModalOpen(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h2>{editingId ? 'Szenario-Typ bearbeiten' : 'Neuer Szenario-Typ'}</h2>
                        
                        <Label>Name</Label>
                        <Input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="z.B. Hochwasser"
                            style={{ marginBottom: theme.spacing.lg }}
                        />

                        <Label>Symbol wählen</Label>
                        <IconGrid>
                            {Object.entries(SCENARIO_ICONS).map(([iconName, IconComponent]) => (
                                <IconSelectBtn 
                                    key={iconName}
                                    $isSelected={selectedIcon === iconName}
                                    onClick={() => setSelectedIcon(iconName)}
                                >
                                    <IconContainer icon={IconComponent} width="24px" height="24px" />
                                </IconSelectBtn>
                            ))}
                        </IconGrid>

                        <ModalButtons>
                            <Button $variant="secondary" onClick={() => setIsModalOpen(false)}>
                                Abbrechen
                            </Button>
                            <Button onClick={handleSave} disabled={!name.trim()}>
                                Speichern
                            </Button>
                        </ModalButtons>
                    </ModalContent>
                </ModalOverlay>
            )}

            {deleteConfirmType && (
                <ModalOverlay onClick={() => setDeleteConfirmType(null)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h2>Szenario-Typ löschen?</h2>
                        <div style={{ marginBottom: theme.spacing.lg }}>
                            <p style={{ margin: '0 0 8px 0', color: theme.colors.text.primary }}>
                                Dieser Typ wird in <strong>{deletePlanCount}</strong> Packplänen verwendet.
                            </p>
                            <p style={{ margin: '0', fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                                Die betroffenen Pläne werden auf den Standard-Typ <strong>"Sonstiges"</strong> gesetzt.
                            </p>
                        </div>
                        <ModalButtons $fullWidth>
                            <Button $variant="secondary" onClick={() => setDeleteConfirmType(null)}>
                                Abbrechen
                            </Button>
                            <Button $variant="danger" onClick={handleFinalDelete}>
                                Löschen
                            </Button>
                        </ModalButtons>
                    </ModalContent>
                </ModalOverlay>
            )}
        </StyledContainer>
    );
};

export default ScenarioTypesManagement;
