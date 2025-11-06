import React, { useState } from 'react';
import styled from 'styled-components';
import { type IDbInventoryItem, CompoundType } from '../../db/items';
import { lookupApi, inventoryApi } from '../../app/api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { theme } from '../../theme';
import Button from '../../components/Button';

const DashboardContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f8f9fa;
    overflow: hidden;
`;

const Header = styled.div`
    background: ${theme.colors.primary};
    color: white;
    padding: 24px;
    box-shadow: ${theme.shadows.md};
    flex-shrink: 0;

    h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: white;
    }

    p {
        margin: 4px 0 0 0;
        opacity: 0.9;
        font-size: 14px;
        color: white;
    }
`;

const ScrollableContent = styled.div`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;

        &:hover {
            background: #555;
        }
    }
`;

const Section = styled.div`
    margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 600;
    color: ${theme.colors.primary};
    margin: 0 0 16px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid ${theme.colors.primary};
`;

const FormBox = styled.div`
    background: ${theme.colors.surface};
    padding: 20px;
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.sm};
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Label = styled.label`
    font-size: 13px;
    font-weight: 600;
    color: ${theme.colors.primary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const Input = styled.input`
    padding: 10px 12px;
    border: 2px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    font-size: 14px;
    color: ${theme.colors.text};
    transition: all ${theme.transitions.normal};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(13, 50, 77, 0.15);
    }

    &::placeholder {
        color: ${theme.colors.textMuted};
    }
`;

// Button component imported from components/Button.tsx

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
`;

const DetailsBox = styled.details`
    background: ${theme.colors.surface};
    padding: 16px;
    border-radius: ${theme.borderRadius.md};
    margin-top: 12px;
    border: 1px solid ${theme.colors.border};

    summary {
        cursor: pointer;
        font-weight: 600;
        color: ${theme.colors.primary};
        user-select: none;

        &:hover {
            opacity: 0.8;
        }
    }

    pre {
        background: ${theme.colors.surfaceAlt};
        padding: 12px;
        border-radius: ${theme.borderRadius.sm};
        font-size: 11px;
        overflow-x: auto;
        margin: 12px 0 0 0;
    }
`;

const TableContainer = styled.div`
    background: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.sm};
    overflow: hidden;
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    thead {
        background: ${theme.colors.surfaceAlt};
        border-bottom: 2px solid ${theme.colors.border};
    }

    th {
        padding: 14px 12px;
        text-align: left;
        font-weight: 600;
        color: ${theme.colors.primary};
        white-space: nowrap;
    }

    td {
        padding: 12px;
        border-bottom: 1px solid ${theme.colors.borderLight};
        white-space: nowrap;
    }

    tbody tr {
        transition: background ${theme.transitions.fast};

        &:hover {
            background: ${theme.colors.surfaceAlt};
        }
    }

    tbody tr:last-child td {
        border-bottom: none;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;

    button {
        padding: 6px 10px;
        font-size: 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 4px;

        &.delete {
            background: ${theme.colors.errorLight};
            color: ${theme.colors.errorDark};

            &:hover {
                background: #ffcdd2;
            }
        }

        &.edit {
            background: #e3f2fd;
            color: #1565c0;

            &:hover {
                background: #bbdefb;
            }
        }
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 40px 20px;
    color: ${theme.colors.textMuted};

    h3 {
        margin: 0 0 8px 0;
        color: ${theme.colors.primary};
    }

    p {
        margin: 0;
        font-size: 14px;
        color: ${theme.colors.textLight};
    }
`;

const SeedDataForm = () => {
    const [name, setName] = useState('');

    const orgUnits = lookupApi.useOrganisationalUnits();
    const itemTypes = lookupApi.useItemTypes();
    const manufacturers = lookupApi.useManufacturers();
    const itemDefinitions = lookupApi.useItemDefinitions();

    const handleAddDefinition = () => {
        const typeId = itemTypes[0]?.id;
        const manufId = manufacturers[0]?.id;
        if (!typeId || !manufId) {
            alert('Please add at least one Item Type and one Manufacturer first.');
            return;
        }
        lookupApi.addItemDefinition({
            name: `${name} (Type: ${typeId}, Manuf: ${manufId})`,
            itemTypeId: typeId,
            manufacturerId: manufId,
        });
        setName('');
    };

    return (
        <Section>
            <SectionTitle>Setup: Lookup Data</SectionTitle>
            <FormBox>
                <FormGrid>
                    <FormGroup>
                        <Label>Add Item</Label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                        />
                    </FormGroup>
                </FormGrid>

                <ButtonGroup>
                    <Button onClick={() => lookupApi.addLookupItem('organisationalUnits', name)}>
                        <AddIcon fontSize="small" /> Add Org Unit
                    </Button>
                    <Button onClick={() => lookupApi.addLookupItem('manufacturers', name)}>
                        <AddIcon fontSize="small" /> Add Manufacturer
                    </Button>
                    <Button onClick={() => lookupApi.addLookupItem('itemTypes', name)}>
                        <AddIcon fontSize="small" /> Add Item Type
                    </Button>
                    <Button onClick={handleAddDefinition}>
                        <AddIcon fontSize="small" /> Add Item Definition
                    </Button>
                </ButtonGroup>

                <DetailsBox>
                    <summary>View Current Lookup Data</summary>
                    <pre>
                        <strong>Org Units:</strong> {orgUnits.length ? JSON.stringify(orgUnits, null, 2) : 'None'}
                        {'\n\n'}
                        <strong>Manufacturers:</strong> {manufacturers.length ? JSON.stringify(manufacturers, null, 2) : 'None'}
                        {'\n\n'}
                        <strong>Item Types:</strong> {itemTypes.length ? JSON.stringify(itemTypes, null, 2) : 'None'}
                        {'\n\n'}
                        <strong>Item Definitions:</strong> {itemDefinitions.length ? JSON.stringify(itemDefinitions, null, 2) : 'None'}
                    </pre>
                </DetailsBox>
            </FormBox>
        </Section>
    );
};

const Dashboard = () => {
    const [externalId, setExternalId] = useState('');
    const [position, setPosition] = useState('');

    const inventoryItems = inventoryApi.useInventoryItems();
    const orgUnits = lookupApi.useOrganisationalUnits();
    const itemDefinitions = lookupApi.useItemDefinitions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const orgUnitId = orgUnits[0]?.id;
        const itemDefId = itemDefinitions[0]?.id;

        if (!orgUnitId || !itemDefId) {
            alert("Please add at least one Org Unit and one Item Definition first.");
            return;
        }

        const newItem: Omit<IDbInventoryItem, 'id'> = {
            externalId,
            position,
            floor: 1,
            amountTarget: 10,
            amountActual: 5,
            isAvailable: true,
            compoundType: CompoundType.PART,
            organisationalUnitId: orgUnitId,
            itemDefinitionId: itemDefId,
        };

        await inventoryApi.addInventoryItem(newItem);
        setExternalId('');
        setPosition('');
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            inventoryApi.deleteInventoryItem(id);
        }
    };

    const handleUpdateAmount = (id: number) => {
        const newAmountStr = prompt("Enter new amount:");
        if (newAmountStr === null) return;
        const newAmount = parseInt(newAmountStr, 10);
        if (!isNaN(newAmount)) {
            inventoryApi.updateItemAmount(id, newAmount);
        }
    };

    return (
        <DashboardContainer>
            <Header>
                <h1>Inventory Dashboard</h1>
                <p>Manage your equipment inventory</p>
            </Header>

            <ScrollableContent>
                <SeedDataForm />

                <Section>
                    <SectionTitle>Add New Item</SectionTitle>
                    <FormBox>
                        <form onSubmit={handleSubmit}>
                            <FormGrid>
                                <FormGroup>
                                    <Label>Sachnummer (Item ID)</Label>
                                    <Input
                                        type="text"
                                        value={externalId}
                                        onChange={(e) => setExternalId(e.target.value)}
                                        placeholder="e.g., EQ-001"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Position (Location)</Label>
                                    <Input
                                        type="text"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        placeholder="e.g., Warehouse A-5"
                                        required
                                    />
                                </FormGroup>
                            </FormGrid>
                            <Button type="submit" disabled={!orgUnits.length || !itemDefinitions.length}>
                                <AddIcon fontSize="small" /> Add Item
                            </Button>
                            {!orgUnits.length || !itemDefinitions.length ? (
                                <p style={{ fontSize: '12px', color: theme.colors.error, marginTop: '8px' }}>
                                    ⚠ Setup required: Add Org Unit and Item Definition first
                                </p>
                            ) : null}
                        </form>
                    </FormBox>
                </Section>

                <Section>
                    <SectionTitle>Inventory Items ({inventoryItems.length})</SectionTitle>
                    {inventoryItems.length === 0 ? (
                        <TableContainer>
                            <EmptyState>
                                <h3>No Items</h3>
                                <p>Add your first inventory item above</p>
                            </EmptyState>
                        </TableContainer>
                    ) : (
                        <TableContainer>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Sachnummer</th>
                                        <th>Position</th>
                                        <th>Amount</th>
                                        <th>Floor</th>
                                        <th>Available</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventoryItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>#{item.id}</td>
                                            <td>{item.externalId}</td>
                                            <td>{item.position}</td>
                                            <td>
                                                {item.amountActual}/{item.amountTarget}
                                            </td>
                                            <td>{item.floor}</td>
                                            <td>{item.isAvailable ? '✓' : '✗'}</td>
                                            <td>
                                                <ActionButtons>
                                                    <button
                                                        className="edit"
                                                        onClick={() => handleUpdateAmount(item.id!)}
                                                        title="Update amount"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </button>
                                                    <button
                                                        className="delete"
                                                        onClick={() => handleDelete(item.id!)}
                                                        title="Delete item"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </button>
                                                </ActionButtons>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </TableContainer>
                    )}
                </Section>
            </ScrollableContent>
        </DashboardContainer>
    );
};

export default Dashboard;
