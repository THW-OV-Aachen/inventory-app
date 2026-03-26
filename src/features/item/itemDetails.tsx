import { Box, FileText, Layers, MapPin, Pen, ChevronLeft, Trash2, X } from 'lucide-react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../db/db';
import type { IItem } from '../../db/items';
import StatusBadge from '../../utils/StatusBadge';
import IconContainer from '../../utils/IconContainer';
import { theme } from '../../styles/theme';
import {
    Container,
    Header,
    BackButton,
    InfoCard,
    Card,
    Textarea,
    Button,
    Label,
    DataValue,
    ContentWrapper,
} from '../../styles/components';
import { mapStatusToTheme, mapDamageLevelToStatus } from '../../styles/utils';
import { LabelBadge } from '../../utils/LabelBadge';
import { calculateNextInspectionDate, isDatePastOrToday, formatDate } from '../../utils/date';


const ItemDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<IItem | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            const itemId = id ? parseInt(id, 10) : null;
            if (!itemId) return;
            const dbItem = await db.items.get(itemId);
            if (dbItem) {
                setItem(dbItem);
            }
        };
        fetchItem();
    }, [id]);

    const handleAdditionalDocs = () => {
        alert('Additional Docs clicked!');
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!item?.id) return;
        setIsDeleting(true);
        try {
            await db.items.delete(item.id);
            navigate('/items');
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('Fehler beim Löschen des Artikels.');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (!item) return <p className="text-center mt-4">Loading item...</p>;

    const statusString = mapDamageLevelToStatus(item.damageLevel);
    const themeStatus = mapStatusToTheme(statusString);

    return (
        <StyledContainer>
            <StyledHeader>
                <HeaderContent>
                    <StyledBackButton onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                    </StyledBackButton>

                    <Title>
                        {item.isSet === true ? (
                            <Layers size={20} color={theme.colors.text.muted} />
                        ) : item.isSet === false ?(
                            <Box size={20} color={theme.colors.text.muted} />
                        ) : (
                            ''
                        )}
                        {item.name}
                    </Title>

                    <HeaderActions>
                        <HeaderEditButton $variant="primary" onClick={() => navigate(`/items/${item.id}/modify`)}>
                            <IconContainer icon={Pen} />
                            <span>Bearbeiten</span>
                        </HeaderEditButton>

                        <HeaderDeleteButton onClick={handleDelete}>
                            <IconContainer icon={Trash2} />
                            <span>Löschen</span>
                        </HeaderDeleteButton>
                    </HeaderActions>
                </HeaderContent>
            </StyledHeader>

            <StyledContentWrapper>
                <StyledInfoCard $status={themeStatus}>
                    <CardContent>
                        <InfoRow>
                            <div style={{ flex: 1 }}>
                                <InfoLabel>Status</InfoLabel>
                                <InfoValue style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                                    <StatusBadge damageLevelType={item.damageLevel} />
                                </InfoValue>
                            </div>
                            {item.location && (
                                <div style={{ flex: 1 }}>
                                    <InfoLabel>Ort</InfoLabel>
                                    <InfoValue>
                                        <MapPin size={14} />
                                        {item.location + (item.level ? `, Ebene: ${item.level}` : '')}
                                    </InfoValue>
                                </div>
                            )}
                        </InfoRow>
                    </CardContent>
                </StyledInfoCard>

                <StyledDetailsCard>
                    <InfoLabel>Menge</InfoLabel>
                    <InfoValue>
                        Verfügbar: {item.availability} | Vorhanden: {item.amountActual} | Ziel: {item.amountTarget}
                    </InfoValue>
                </StyledDetailsCard>

                <StyledDetailsCard>
                    <InfoLabel>Weitere Informationen</InfoLabel>
                    <InfoValue>Sachnummer: {item.itemId || '-'}</InfoValue>
                    <InfoValue>Inventarnummer: {item.inventoryNumber || '-'}</InfoValue>
                    <InfoValue>Gerätenummer: {item.deviceNumber || '-'}</InfoValue>
                    <InfoValue>
                        Typ: {item.art || '-'}
                    </InfoValue>
                </StyledDetailsCard>

                <StyledDetailsCard>
                    <InfoLabel>Labels</InfoLabel>
                    <InfoValue>
                        {item.labels && item.labels.length > 0 ? (
                            <LabelContainer>
                                {item.labels.map((label) => (
                                    <LabelBadge key={label.id} color={label.color}>
                                        {label.name}
                                    </LabelBadge>
                                ))}
                            </LabelContainer>
                        ) : (
                            '-'
                        )}
                    </InfoValue>
                </StyledDetailsCard>

                <StyledDetailsCard>
                    <InfoLabel>Wartungsinformationen</InfoLabel>
                    <InfoValue>
                        Letzte Inspektion:{' '}
                        {item.lastInspection
                            ? formatDate(new Date(item.lastInspection))
                            : '-'}
                    </InfoValue>
                    <InfoValue>
                        Inspektionsintervall:{' '}
                        {item.inspectionIntervalMonths ? item.inspectionIntervalMonths + ' Monate' : '-'}
                    </InfoValue>
                    <InfoValue>
                        Berechnete nächste Inspektion:{' '}
                        {(() => {
                            const nextDate = calculateNextInspectionDate(
                                item.lastInspection,
                                item.inspectionIntervalMonths
                            );
                            if (!nextDate) return '-';

                            const isPastOrToday = isDatePastOrToday(nextDate);
                            const formattedDate = formatDate(nextDate);

                            return isPastOrToday ? (
                                <span style={{ color: theme.colors.status.error.main }}>
                                    {formattedDate}
                                </span>
                            ) : (
                                formattedDate
                            );
                        })()}
                    </InfoValue>
                </StyledDetailsCard>

                <StyledDetailsCard>
                    <InfoLabel style={{ marginBottom: theme.spacing.md }}>Kommentare</InfoLabel>
                    <StyledTextarea value={item.remark || ''} disabled readOnly />
                </StyledDetailsCard>

                <ButtonContainer>
                    <StyledButton $variant="primary" onClick={handleAdditionalDocs}>
                        <IconContainer icon={FileText} />
                        Weitere Dokumente
                    </StyledButton>
                </ButtonContainer>
            </StyledContentWrapper>

            {showDeleteConfirm && (
                <ModalOverlay
                    onClick={() => {
                        if (isDeleting) return;
                        setShowDeleteConfirm(false);
                    }}
                >
                    <ModalBox onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <ModalHeader>
                            <ModalTitle>Artikel löschen?</ModalTitle>
                            <CloseButton
                                type="button"
                                onClick={() => {
                                    if (isDeleting) return;
                                    setShowDeleteConfirm(false);
                                }}
                                aria-label="Close"
                            >
                                <IconContainer icon={X} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalText>
                            Möchten Sie "{item.name}" wirklich aus dem Inventar löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                        </ModalText>

                        <ModalButtons>
                            <ModalButton
                                $variant="ghost"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                            >
                                Abbrechen
                            </ModalButton>
                            <DangerModalButton onClick={handleConfirmDelete} disabled={isDeleting}>
                                {isDeleting ? 'Löschen…' : 'Löschen'}
                            </DangerModalButton>
                        </ModalButtons>
                    </ModalBox>
                </ModalOverlay>
            )}
        </StyledContainer>
    );
};

export default ItemDetails;

// ─── Styled Components ────────────────────────────────────
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

const ModalButtons = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    width: 100%;
    
    & > * {
        flex: 1;
    }
`;

const ModalButton = styled(Button)`
    padding: 0 ${theme.spacing.lg};
    min-width: 0;
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
const StyledContainer = styled(Container)`
    padding-top: 8px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};
    @media (min-width: ${theme.breakpoints.lg}) {
        max-width: 1000px;
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
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 0 ${theme.spacing.md};
    }
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    margin-left: auto;
`;

const HeaderEditButton = styled(Button)`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    box-shadow: ${theme.shadows.sm};

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

const HeaderDeleteButton = styled(Button)`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    box-shadow: ${theme.shadows.sm};
    background: ${theme.colors.status.error.main};
    color: white;

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

const StyledInfoCard = styled(InfoCard)`
    margin-bottom: ${theme.spacing.lg};
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
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
    display: block;
`;

const StyledDetailsCard = styled(Card)`
    margin-bottom: ${theme.spacing.lg};
    border-left: 4px solid ${theme.colors.status.neutral.main};
`;

const StyledTextarea = styled(Textarea)`
    min-height: 80px;
`;

const StyledButton = styled(Button)`
    height: 36px;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    gap: ${theme.spacing.xs};
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    flex-direction: column;

    & > ${StyledButton} {
        width: 100%;
    }

    @media (min-width: ${theme.breakpoints.md}) {
        flex-direction: row;
        justify-content: flex-start;

        & > ${StyledButton} {
            width: unset;
        }
    }
`;

const LabelContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.xs};
    flex-wrap: wrap;
`;
