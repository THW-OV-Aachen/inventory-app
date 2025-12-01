import { Box, FileText, Layers, MapPin, Pen } from 'lucide-react';
import styled from 'styled-components';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../db/db';
import type { IItem, DamageLevelType } from '../../db/items';
import StatusBadge, { DamageLevelStyles } from '../../utils/StatusBadge';
import { inventoryApi } from '../../app/api';
import IconContainer from '../../utils/IconContainer';

const Container = styled.div`
    width: 100%;
    max-width: 100%;
    padding: 20px;
    box-sizing: border-box;
`;

const Subtitle = styled.div`
    font-size: 14px;
    color: #64748b;
    margin-bottom: 20px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const InfoCard = styled.div<{ $status?: DamageLevelType }>`
    width: 100%;
    max-width: 100%;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: white;
    box-sizing: border-box;
    border-left: 4px solid ${(p) => `${DamageLevelStyles[p.$status ?? 'none'].colorBg}`};
    border: 1px solid ${(p) => `${DamageLevelStyles[p.$status ?? 'none'].colorBg}`};
    border-left-width: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 14px;
    color: #475569;
    gap: 12px;
`;

const InfoLabel = styled.div`
    font-weight: 600;
    color: #64748b;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
`;

const InfoValue = styled.div`
    font-size: 14px;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const DetailsCard = styled.div`
    width: 100%;
    max-width: 100%;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: white;
    box-sizing: border-box;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #64748b;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const DetailsTextarea = styled.textarea`
    width: 100%;
    min-height: 80px;
    padding: 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background-color: #f8fafc;
    color: var(--color-font-primary);
    resize: none;
    overflow: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
    line-height: 1.5;

    &:focus {
        outline: none;
        border-color: #64748b;
        background-color: white;
    }
`;

const Button = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    border: none;
    background-color: #4a90e2;
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
    return (
        <Container>
            <Subtitle>
                {item.isSet ? <Layers size={20} color="#64748b" /> : <Box size={20} color="#64748b" />}
                {item.name} · Inventarnummer: {item.inventoryNumber ?? 'nicht vorhanden'}
            </Subtitle>

            <InfoCard $status={item.damageLevel}>
                <CardContent>
                    <InfoRow>
                        <div style={{ flex: 1 }}>
                            <InfoLabel>Status</InfoLabel>
                            <InfoValue style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                                <StatusBadge damageLevelType={item.damageLevel} />
                                {!item.availability && (
                                    <span style={{ fontSize: 12, color: '#b91c1c', marginTop: 4 }}>
                                        Nicht vorhanden
                                    </span>
                                )}
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
            </InfoCard>

            <DetailsCard>
                <InfoLabel>Menge</InfoLabel>
                <InfoValue>
                    Verfügbar: {item.availability} | Vorhanden: {item.amountActual} | Ziel: {item.amountTarget}
                </InfoValue>
            </DetailsCard>

            <DetailsCard>
                <InfoLabel>Informationen</InfoLabel>
                <InfoValue>Inventarnummer: {item.inventoryNumber}</InfoValue>
                <InfoValue>Gerätenummer: {item.deviceNumber}</InfoValue>
                <InfoValue>Typ: {item.isSet ? 'Satz' : 'Einzelstück'}</InfoValue>
            </DetailsCard>

            <DetailsCard>
                <InfoLabel>Wartung</InfoLabel>
                <InfoValue>
                    Letzte Inspektion:{' '}
                    {item.lastInspection
                        ? Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
                              new Date(item.lastInspection)
                          )
                        : '-'}
                </InfoValue>
                <InfoValue>
                    Inspektionsintervall:{' '}
                    {item.inspectionIntervalMonths ? item.inspectionIntervalMonths + ' Monate' : '-'}
                </InfoValue>
                <InfoValue>
                    Berechnete nächste Inspektion:{' '}
                    {item.lastInspection && item.inspectionIntervalMonths
                        ? Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
                              addMonths(new Date(item.lastInspection), item.inspectionIntervalMonths)
                          )
                        : '-'}
                </InfoValue>
            </DetailsCard>

            <DetailsCard>
                <InfoLabel style={{ marginBottom: '12px' }}>
                    Kommentare{' '}
                    {isSaving && (
                        <span style={{ color: 'var(--color-font-secondary)', fontSize: '12px' }}>
                            Wird gespeichert...
                        </span>
                    )}
                </InfoLabel>{' '}
                <DetailsTextarea ref={textareaRef} value={text} onChange={handleTextChange} />
            </DetailsCard>
            <ButtonContainer>
                <Button onClick={() => handleAdditionalDocs}>
                    <IconContainer icon={FileText} />
                    Weitere Dokumente
                </Button>
                <Button
                    onClick={() => {
                        navigate(`/items/${item.id}/modify`);
                    }}
                >
                    <IconContainer icon={Pen} /> Bearbeiten
                </Button>
            </ButtonContainer>
        </Container>
    );
};

const ButtonContainer = styled.div`
    display: flex;
    gap: 6px;
    flex-direction: column;

    & > ${Button} {
        width: 100%;
    }

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: flex-end;

        & > ${Button} {
            width: unset;
        }
    }
`;

export default ItemDetails;
