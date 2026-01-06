import { Box, FileText, Layers, MapPin, Pen, ChevronLeft } from 'lucide-react';
import styled from 'styled-components';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../db/db';
import type { IItem } from '../../db/items';
import StatusBadge from '../../utils/StatusBadge';
import { inventoryApi } from '../../app/api';
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

function addMonths(date: Date, months: number): Date {
    const d = new Date(date.getTime());
    const day = d.getDate();

    // set to first of month to avoid rollover issues, then advance months,
    // then clamp day to the number of days in that month
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    const daysInTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, daysInTargetMonth));
    return d;
}

const ItemDetails = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [item, setItem] = useState<IItem | null>(null);
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    const saveRemark = useCallback(
        async (newText: string) => {
            if (!itemId) return;
            setIsSaving(true);
            try {
                await inventoryApi.updateItem(itemId, {
                    remark: newText || '',
                });
            } catch (error) {
                console.error('Failed to save remark:', error);
            } finally {
                setIsSaving(false);
            }
        },
        [itemId]
    );

    // Fetch the item from Dexie by ID
    useEffect(() => {
        const fetchItem = async () => {
            if (!itemId) return;
            const dbItem = await db.items.get(itemId);
            if (dbItem) {
                setItem(dbItem);
                setText(dbItem.remark || '');
            }
        };
        fetchItem();
    }, [itemId]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            saveRemark(newText);
        }, 3000);
    };

    // Auto-grow textarea
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleAdditionalDocs = () => {
        alert('Additional Docs clicked!');
    };

    if (!item) return <p className="text-center mt-4">Loading item...</p>;

    const statusString = mapDamageLevelToStatus(item.damageLevel);
    const themeStatus = mapStatusToTheme(statusString);

    return (
        <StyledContainer>
            <StyledHeader>
                <StyledBackButton onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} />
                </StyledBackButton>
                <Title>
                    {item.isSet ? (
                        <Layers size={20} color={theme.colors.text.muted} />
                    ) : (
                        <Box size={20} color={theme.colors.text.muted} />
                    )}
                    {item.name}
                </Title>
            </StyledHeader>

            <StyledContentWrapper>
                <Subtitle>Inventarnummer: {item.inventoryNumber ?? 'nicht vorhanden'}</Subtitle>

                <StyledInfoCard status={themeStatus}>
                    <CardContent>
                        <InfoRow>
                            <div style={{ flex: 1 }}>
                                <InfoLabel>Status</InfoLabel>
                                <InfoValue style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
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
                    <InfoLabel>Informationen</InfoLabel>
                    <InfoValue>Inventarnummer: {item.inventoryNumber || '-'}</InfoValue>
                    <InfoValue>Gerätenummer: {item.deviceNumber || '-'}</InfoValue>
                    <InfoValue>Typ: {item.isSet ? 'Satz' : 'Einzelstück'}</InfoValue>
                    <InfoValue>
                        Labels:{' '}
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
                    <InfoLabel>Wartung</InfoLabel>
                    <InfoValue>
                        Letzte Inspektion:{' '}
                        {item.lastInspection
                            ? Intl.DateTimeFormat('de-DE', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                              }).format(new Date(item.lastInspection))
                            : '-'}
                    </InfoValue>
                    <InfoValue>
                        Inspektionsintervall:{' '}
                        {item.inspectionIntervalMonths ? item.inspectionIntervalMonths + ' Monate' : '-'}
                    </InfoValue>
                    <InfoValue>
                        Berechnete nächste Inspektion:{' '}
                        {item.lastInspection && item.inspectionIntervalMonths
                            ? Intl.DateTimeFormat('de-DE', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                              }).format(addMonths(new Date(item.lastInspection), item.inspectionIntervalMonths))
                            : '-'}
                    </InfoValue>
                </StyledDetailsCard>

                <StyledDetailsCard>
                    <InfoLabel style={{ marginBottom: theme.spacing.md }}>
                        Kommentare{' '}
                        {isSaving && (
                            <span
                                style={{ color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.xs }}
                            >
                                Wird gespeichert...
                            </span>
                        )}
                    </InfoLabel>
                    <StyledTextarea ref={textareaRef} value={text} onChange={handleTextChange} />
                </StyledDetailsCard>

                <ButtonContainer>
                    <StyledButton variant="primary" onClick={handleAdditionalDocs}>
                        <IconContainer icon={FileText} />
                        Weitere Dokumente
                    </StyledButton>
                    <StyledButton variant="primary" onClick={() => navigate(`/items/${item.id}/modify`)}>
                        <IconContainer icon={Pen} /> Bearbeiten
                    </StyledButton>
                </ButtonContainer>
            </StyledContentWrapper>
        </StyledContainer>
    );
};

export default ItemDetails;

// ─── Styled Components ────────────────────────────────────
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
    padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 0;
    margin-bottom: 0;
    margin-left: 0;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
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
    padding: 0;
`;

const Subtitle = styled.div`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    margin-bottom: ${theme.spacing.lg};
    font-weight: ${theme.typography.fontWeight.medium};
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
    display: flex;
    align-items: center;
    gap: 6px;
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
        justify-content: flex-end;

        & > ${StyledButton} {
            width: unset;
        }
    }
`;

const LabelContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.xs};
`;

const LabelBadge = styled.span`
    background-color: ${(props) => props.color || theme.colors.primary.main};
    color: white;
    padding: 2px 8px;
    border-radius: ${theme.borderRadius.full};
    font-size: ${theme.typography.fontSize.xs};
`;
