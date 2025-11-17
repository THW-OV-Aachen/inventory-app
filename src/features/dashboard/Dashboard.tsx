import React, { useState } from 'react';
import styled from 'styled-components';
import { type IDbInventoryItem, CompoundType } from '../../db/items';
import { lookupApi, inventoryApi } from '../../app/api';
import PageHeader from '../../layout/PageHeader';


import SeedDataForm from './SeedDataForm'; 

const DashboardWrapper = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1000px;
  margin: auto;
`;

const Section = styled.div`
  background: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 6px 10px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 6px 12px;
  margin-right: 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: #77c9ffff;
  color: #fff;

  &:hover {
    background: #77c9ffff;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  th {
    background: #f1f1f1;
  }
`;

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
      alert("Please add at least one Org Unit and one Item Definition using the 'Seed Data' form first.");
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
    if (window.confirm('Are you sure?')) inventoryApi.deleteInventoryItem(id);
  };

  const handleUpdateAmount = (id: number) => {
    const newAmountStr = prompt("Enter new 'actual amount':");
    if (newAmountStr === null) return;
    const newAmount = parseInt(newAmountStr, 10);
    if (!isNaN(newAmount)) inventoryApi.updateItemAmount(id, newAmount);
  };

  return (


    <DashboardWrapper>

      <PageHeader title="Inventory Dashboard" />


      <Section>
        <SectionTitle>1. Seed Lookup Data</SectionTitle>
            <SeedDataForm />
        </Section>

      <Section>
        <SectionTitle>2. Add New Inventory Item</SectionTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={externalId}
            onChange={(e) => setExternalId(e.target.value)}
            placeholder="Sachnummer (External ID)"
            required
          />
          <Input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Ort (Position)"
            required
          />
          <Button type="submit" disabled={!orgUnits.length || !itemDefinitions.length}>Add Item</Button>
        </form>
      </Section>

      <Section>
        <SectionTitle>3. Current Inventory</SectionTitle>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Sachnummer</th>
              <th>Position (Ort)</th>
              <th>Amount (Actual/Target)</th>
              <th>Def. ID (FK)</th>
              <th>Org. ID (FK)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.length === 0 && (
              <tr>
                <td colSpan={7}>No inventory items found.</td>
              </tr>
            )}
            {inventoryItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.externalId}</td>
                <td>{item.position}</td>
                <td>{item.amountActual} / {item.amountTarget}</td>
                <td>{item.itemDefinitionId}</td>
                <td>{item.organisationalUnitId}</td>
                <td>
                  <Button onClick={() => handleUpdateAmount(item.id!)}>Update</Button>
                  <Button style={{ background: '#e74c3c' }} onClick={() => handleDelete(item.id!)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </DashboardWrapper>
  );
};

export default Dashboard;
