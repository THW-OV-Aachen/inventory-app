import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft, Plus, Trash2, X } from 'lucide-react';
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
    @media (min-width: ${theme.breakpoints.lg}) {
        max-width: 1000px;
    }
`;

const Header = styled.div`
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

const StyledBackButton = styled(BackButton)`
    padding-left: 0;
    margin-left: 0;
    flex-shrink: 0;
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
    background-color: ${theme.colors.primaryLight};
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

const ModalContentScroll = styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
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

const ModalButtons = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    width: 100%;
    
    & > * {
        flex: 1;
    }
`;

const ModalButton = styled(Button)`
    padding: 0 ${theme.spacing.lg};
    height: 36px;
    font-size: ${theme.typography.fontSize.sm};
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
                    <StyledBackButton onClick={() => navigate('/packing-plans')}>
                        <IconContainer icon={ChevronLeft} width="20px" height="20px" />
                    </StyledBackButton>
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
                    <ModalBox onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>{editingId ? 'Szenario-Typ bearbeiten' : 'Neuer Szenario-Typ'}</ModalTitle>
                            <CloseButton onClick={() => setIsModalOpen(false)}>
                                <IconContainer icon={X} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalContentScroll>
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
                        </ModalContentScroll>

                        <ModalButtons>
                            <ModalButton $variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Abbrechen
                            </ModalButton>
                            <ModalButton $variant="primary" onClick={handleSave} disabled={!name.trim()}>
                                Speichern
                            </ModalButton>
                        </ModalButtons>
                    </ModalBox>
                </ModalOverlay>
            )}

            {deleteConfirmType && (
                <ModalOverlay onClick={() => setDeleteConfirmType(null)}>
                    <ModalBox onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Szenario-Typ löschen?</ModalTitle>
                            <CloseButton onClick={() => setDeleteConfirmType(null)}>
                                <IconContainer icon={X} />
                            </CloseButton>
                        </ModalHeader>
                        
                        <ModalText>
                            Dieser Typ wird in <strong>{deletePlanCount}</strong> Packplänen verwendet.
                            Die betroffenen Pläne werden auf den Standard-Typ "Sonstiges" gesetzt.
                        </ModalText>

                        <ModalButtons>
                            <ModalButton $variant="ghost" onClick={() => setDeleteConfirmType(null)}>
                                Abbrechen
                            </ModalButton>
                            <DangerModalButton onClick={handleFinalDelete}>
                                Löschen
                            </DangerModalButton>
                        </ModalButtons>
                    </ModalBox>
                </ModalOverlay>
            )}
        </StyledContainer>
    );
};

export default ScenarioTypesManagement;
