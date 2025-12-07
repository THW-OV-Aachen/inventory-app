// src/features/importExport/ImportExport.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportExcel, importExcel } from '../../db/utils/excel';
import { inventoryApi } from '../../app/api';
import styled from 'styled-components';
import { Upload, Download, ChevronLeft } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Card, Button, Container, BackButton, Header, ControlsWrapper } from '../../styles/components';

const StyledContainer = styled(Container)`
    padding-top: 8px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};
    max-width: 720px;
    margin: 0 auto;
`;

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
    padding: ${theme.spacing.xl};
`;

const FileInputWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    background: ${theme.colors.background.light};
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} 10px;
    position: relative;

    &:focus-within {
        border-color: ${theme.colors.primary};
        background: ${theme.colors.background.white};
    }
`;

const FileInputLabel = styled.div<{ $hasFile?: boolean }>`
    flex: 1;
    font-size: ${theme.typography.fontSize.sm};
    color: ${({ $hasFile }) => ($hasFile ? theme.colors.text.primary : theme.colors.text.placeholder)};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const HiddenFileInput = styled.input`
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    top: 0;
    left: 0;
`;

const FileInputButton = styled.button`
    padding: ${theme.spacing.xs} 10px;
    border: none;
    border-radius: ${theme.borderRadius.sm};
    background-color: ${theme.colors.primary};
    color: white;
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: ${theme.transitions.default};
    flex-shrink: 0;

    &:hover {
        background-color: ${theme.colors.primaryHover};
    }
`;

const StyledButtonGroup = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    align-items: center;
    padding-top: ${theme.spacing.sm};
    border-top: 1px solid ${theme.colors.border.default};
`;

const StyledPrimaryButton = styled(Button)`
    flex: 1;
    height: 36px;
    padding: 0 ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
`;

const StyledSecondaryButton = styled(Button)`
    flex: 1;
    height: 36px;
    padding: 0 ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
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

const ImportExportScreen = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const inventoryItems = inventoryApi.useItems(); // fetch current items

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] ?? null);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportClick = async () => {
        if (!file) {
            alert('Select a file first.');
            return;
        }
        setImporting(true);
        try {
            await importExcel(file);
            alert('Import finished!');
        } catch (err) {
            alert('Import failed: ' + (err as Error).message);
        } finally {
            setImporting(false);
        }
    };

    const handleExportClick = async () => {
        setExporting(true);
        try {
            const blob = await exportExcel(inventoryItems);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'inventory.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Export failed: ' + (err as Error).message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <StyledContainer>
            <StyledHeader>
                <StyledBackButton onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} />
                </StyledBackButton>
            </StyledHeader>
            <ControlsWrapper>
                <StyledCard>
                    <FileInputWrapper>
                        <Upload size={18} color={theme.colors.text.muted} />
                        <FileInputLabel $hasFile={!!file}>
                            {file ? file.name : 'Excel-Datei auswählen (.xlsx)'}
                        </FileInputLabel>
                        <HiddenFileInput
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                        />
                        <FileInputButton type="button" onClick={handleBrowseClick}>
                            Durchsuchen
                        </FileInputButton>
                    </FileInputWrapper>
                    <StyledButtonGroup>
                        <StyledPrimaryButton variant="primary" onClick={handleImportClick} disabled={importing || !file}>
                            <Upload size={14} />
                            <span>{importing ? 'Import läuft…' : 'Importieren'}</span>
                        </StyledPrimaryButton>
                        <StyledSecondaryButton variant="ghost" onClick={handleExportClick} disabled={exporting}>
                            <Download size={14} />
                            <span>{exporting ? 'Export läuft…' : 'Exportieren'}</span>
                        </StyledSecondaryButton>
                    </StyledButtonGroup>
                </StyledCard>
            </ControlsWrapper>
        </StyledContainer>
    );
};

export default ImportExportScreen;
