import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CheckCircle2, AlertCircle, XCircle, MapPin, FileText, Layers, Box } from 'lucide-react';
import PageHeader from '../../../layout/PageHeader';

interface ItemDetailsSmallProps {
    itemReference?: string;
    maintenanceStatus?: string;
    location?: string;
    details?: string;
    onAdditionalDocsClick?: () => void;
}

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

const InfoCard = styled.div<{ status?: string }>`
    width: 100%;
    max-width: 100%;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: white;
    box-sizing: border-box;
    border-left: 4px solid ${({ status }) => {
        if (status === 'Good') return '#10b981';
        if (status === 'Minor' || status === 'Soon') return '#f59e0b';
        if (status === 'Damaged') return '#ef4444';
        if (status === 'Out of order') return '#dc2626';
        return '#64748b';
    }};
    border: 1px solid ${({ status }) => {
        if (status === 'Good') return '#d1fae5';
        if (status === 'Minor' || status === 'Soon') return '#fed7aa';
        if (status === 'Damaged') return '#fecaca';
        if (status === 'Out of order') return '#fee2e2';
        return '#e2e8f0';
    }};
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

const StatusBadge = styled.span<{ status?: string }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    background-color: ${({ status }) => {
        if (status === 'Good') return '#d1fae5';
        if (status === 'Soon' || status === 'Minor') return '#fed7aa';
        if (status === 'Damaged') return '#fecaca';
        if (status === 'Out of order') return '#fee2e2';
        return '#e2e8f0';
    }};
    color: ${({ status }) => {
        if (status === 'Good') return '#065f46';
        if (status === 'Soon' || status === 'Minor') return '#92400e';
        if (status === 'Damaged') return '#991b1b';
        if (status === 'Out of order') return '#7f1d1d';
        return '#475569';
    }};
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
    color: #1e293b;
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
    background-color: #4A90E2;
    color: white;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;

    &:hover {
        background-color: #3a7bc8;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const handleAdditionalDocs = (onClick?: () => void) => {
    if (onClick) {
        onClick();
    } else {
        alert('Additional Docs clicked!');
    }
};

const getStatusIcon = (status?: string) => {
    const iconSize = 14;
    if (status === 'Good') return <CheckCircle2 size={iconSize} />;
    if (status === 'Minor' || status === 'Soon') return <AlertCircle size={iconSize} />;
    if (status === 'Damaged' || status === 'Out of order') return <XCircle size={iconSize} />;
    return null;
};

/**
 * ItemDetailsSmall - Renders item details as cards for small screens
 * Modern design with colored left border and clean white background
 */
const ItemDetailsSmall: React.FC<ItemDetailsSmallProps> = ({
    itemReference: _itemReference,
    maintenanceStatus = 'Good',
    location,
    details,
    onAdditionalDocsClick,
}) => {
    const item = {
        name: 'Flashlight',
        inventoryNumber: '2049-756267',
        itemNumber: '100733790',
        deviceNumber: 'WFQIX8F',
        location: location ?? '3B',
        damageLevel: maintenanceStatus ?? 'Good',
        availability: true,
        amountCurrent: 6,
        amountMinimum: 6,
        amountMaximum: 6,
        lastInspection: '2024-05-12',
        inspectionIntervalDays: 365,
        isSet: true,
        remark:
            details ??
            '-Here is some detailed information of the selected item.\n-This is the second line.\n-And this is the third line.',
        // IDbInventoryItem properties
        externalId: '100733790',
        floor: 3,
        amountTarget: 6,
        amountActual: 6,
        isAvailable: true,
        position: location ?? '3B',
        inventoryId: '2049-756267',
        deviceId: 'WFQIX8F',
        compoundType: 'set' as const,
        organisationalUnitId: 1,
        itemDefinitionId: 1,
    };

    const [text, setText] = useState(item.remark);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-grow textarea height dynamically
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    return (
        <Container>
            <PageHeader title="Item Details" />
            <Subtitle>
                {item.isSet ? <Layers size={20} color="#64748b" /> : <Box size={20} color="#64748b" />}
                {item.name} · Inv. Nr.: {item.inventoryNumber}
            </Subtitle>
            
            <InfoCard status={item.damageLevel}>
                <CardContent>
                    <InfoRow>
                        <div style={{ flex: 1 }}>
                            <InfoLabel>Status</InfoLabel>
                            <InfoValue style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                                <StatusBadge status={item.damageLevel}>
                                    {getStatusIcon(item.damageLevel)}
                                    {item.damageLevel}
                                </StatusBadge>
                                <InfoValue style={{ fontSize: 12 }}>
                                    Availability: {item.availability ? 'Available' : 'Unavailable'}
                                </InfoValue>
                                {!item.availability && (
                                    <span style={{ fontSize: 12, color: '#b91c1c', marginTop: 4 }}>
                                        Unavailable
                                    </span>
                                )}
                            </InfoValue>
                        </div>
                        {item.location && (
                            <div style={{ flex: 1 }}>
                                <InfoLabel>Location</InfoLabel>
                                <InfoValue>
                                    <MapPin size={14} />
                                    {item.location}
                                </InfoValue>
                            </div>
                        )}
                    </InfoRow>
                </CardContent>
            </InfoCard>

            <DetailsCard>
                <InfoLabel>Quantity</InfoLabel>
                <InfoValue>
                    Now: {item.amountCurrent} | Min: {item.amountMinimum} | Max: {item.amountMaximum}
                </InfoValue>
            </DetailsCard>

            {/* <DetailsCard>
                <InfoLabel>Maintenance</InfoLabel>
                <InfoValue>Last inspection: {item.lastInspection}</InfoValue>
                <InfoValue>Interval: {item.inspectionIntervalDays} days</InfoValue>
            </DetailsCard> */}

            <DetailsCard>
                <InfoLabel>Identification</InfoLabel>
                <InfoValue>Item number: {item.itemNumber}</InfoValue>
                <InfoValue>Inventory number: {item.inventoryNumber}</InfoValue>
                <InfoValue>Device number: {item.deviceNumber}</InfoValue>
                <InfoValue>Type: {item.isSet ? 'Set' : 'Single item'}</InfoValue>
            </DetailsCard>

            <DetailsCard>
                <InfoLabel style={{ marginBottom: '12px' }}>Comments</InfoLabel>
                <DetailsTextarea
                    ref={textareaRef}
                    value={text}
                    readOnly
                    onChange={(e) => setText(e.target.value)}
                />
            </DetailsCard>

            <Button onClick={() => handleAdditionalDocs(onAdditionalDocsClick)}>
                <FileText size={14} />
                Additional Docs
            </Button>
        </Container>
    );
};

export default ItemDetailsSmall;

