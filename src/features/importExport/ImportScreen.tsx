// src/features/importExport/ImportExport.tsx
import React, { useState } from 'react';
import { exportExcel, importExcel } from '../../db/utils/excel';
import { inventoryApi } from '../../app/api';
import styled from 'styled-components';

const Container = styled.div`
    max-width: 600px;
    margin: 30px auto;
    padding: 20px;
`;

const Card = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 20px;
`;

const FileInput = styled.input`
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'success' }>`
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    border: none;
    color: white;
    background-color: ${({ variant }) => (variant === 'success' ? '#28a745' : '#007bff')};
    cursor: pointer;
    transition: background-color 0.2s;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: ${({ variant }) => (variant === 'success' ? '#218838' : '#0056b3')};
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
    padding: 20px;
    border-radius: 8px;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
    margin: 0 0 10px 0;
`;

const ModalText = styled.p`
    margin: 0 0 16px 0;
`;

const ModalButtons = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

const ImportExportScreen = () => {
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);

    const inventoryItems = inventoryApi.useItems(); // fetch current items

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] ?? null);
    };

    const handleImportClick = async () => {
        if (!file) {
            alert('Select a file first.');
            return;
        }

        if ((inventoryItems?.length ?? 0) > 0) {
            setPendingFile(file);
            setShowConfirm(true);
            return;
        }
        await performImport(file, /* extend */ true);
    };

    const performImport = async (f: File, extend: boolean) => {
        setImporting(true);
        try {
            if (!extend) {
                await inventoryApi.clearAll();
            }
            await importExcel(f);
            alert('Import finished!');
        } catch (err) {
            alert('Import failed: ' + (err as Error).message);
        } finally {
            setImporting(false);
            setPendingFile(null);
            setShowConfirm(false);
        }
    };

    const handleConfirmChoice = async (choice: 'extend' | 'overwrite' | 'cancel') => {
        if (choice === 'cancel') {
            setShowConfirm(false);
            setPendingFile(null);
            return;
        }
        if (!pendingFile) {
            setShowConfirm(false);
            return;
        }
        await performImport(pendingFile, choice === 'extend');
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
        <Container>
            <Card>
                <Title>Import / Export Inventory</Title>
                <FileInput type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                <ButtonGroup>
                    <Button onClick={handleImportClick} disabled={importing}>
                        {importing ? 'Importing…' : 'Import'}
                    </Button>
                    <Button variant="success" onClick={handleExportClick} disabled={exporting}>
                        {exporting ? 'Exporting…' : 'Export'}
                    </Button>
                </ButtonGroup>
            </Card>
            {showConfirm && (
                <ModalOverlay>
                    <ModalBox role="dialog" aria-modal="true" aria-labelledby="import-confirm-title">
                        <ModalTitle id="import-confirm-title">Die Datenbank enthält bereits Elemente</ModalTitle>
                        <ModalText>
                            Die aktuelle Datenbank enthält bereits Einträge. Möchten Sie die vorhandenen Daten erweitern
                            (aktuelle Einträge beibehalten und neue hinzufügen) oder die Datenbank überschreiben
                            (vorhandene Einträge löschen und nur die neuen importieren )?
                        </ModalText>
                        <ModalButtons>
                            <Button onClick={() => handleConfirmChoice('cancel')}>Abbrechen</Button>
                            <Button onClick={() => handleConfirmChoice('extend')}>Erweitern</Button>
                            <Button variant="success" onClick={() => handleConfirmChoice('overwrite')}>
                                Überschreiben
                            </Button>
                        </ModalButtons>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default ImportExportScreen;
