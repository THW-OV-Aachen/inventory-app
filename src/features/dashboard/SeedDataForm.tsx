import { useState } from 'react';
import { lookupApi } from '../../app/api';

// Simple styled button
const Button = (props: any) => (
  <button
    style={{
      margin: '5px 5px 5px 0',
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      background: '#77c9ffff',
      color: 'white',
      cursor: 'pointer',
    }}
    {...props}
  />
);

const SeedDataForm = () => {
  const [name, setName] = useState('');

  // Dropdown state
  const [selectedOrgUnit, setSelectedOrgUnit] = useState<number | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<number | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<number | null>(null);

  // Load current lookup data
  const orgUnits = lookupApi.useOrganisationalUnits();
  const manufacturers = lookupApi.useManufacturers();
  const itemTypes = lookupApi.useItemTypes();
  const itemDefinitions = lookupApi.useItemDefinitions();

  // Add new item definition
  const handleAddDefinition = async () => {
    if (!selectedItemType || !selectedManufacturer) {
      alert('Please select an Item Type and a Manufacturer first.');
      return;
    }
    await lookupApi.addItemDefinition({
      name: `${name} (Type: ${selectedItemType}, Manuf: ${selectedManufacturer})`,
      itemTypeId: selectedItemType,
      manufacturerId: selectedManufacturer,
    });
    setName('');
  };

  // Add new lookup item
  const handleAddLookup = async (table: 'organisationalUnits' | 'manufacturers' | 'itemTypes') => {
    if (!name) return;
    await lookupApi.addLookupItem(table, name);
    setName('');
  };

  return (
    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
      <h2>1. Seed Lookup Data</h2>

      {/* Input for adding names */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name..."
          style={{ padding: '6px', width: '200px', marginRight: '10px' }}
        />
      </div>

      {/* Dropdowns with add buttons */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
        {/* Org Unit */}
        <div>
          <label>Org Unit:</label><br />
          <select
            value={selectedOrgUnit ?? ''}
            onChange={(e) => setSelectedOrgUnit(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select Org Unit</option>
            {orgUnits.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <br />
          <Button onClick={() => handleAddLookup('organisationalUnits')}>Add Org Unit</Button>
        </div>

        {/* Manufacturer */}
        <div>
          <label>Manufacturer:</label><br />
          <select
            value={selectedManufacturer ?? ''}
            onChange={(e) => setSelectedManufacturer(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <br />
          <Button onClick={() => handleAddLookup('manufacturers')}>Add Manufacturer</Button>
        </div>

        {/* Item Type */}
        <div>
          <label>Item Type:</label><br />
          <select
            value={selectedItemType ?? ''}
            onChange={(e) => setSelectedItemType(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select Item Type</option>
            {itemTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <br />
          <Button onClick={() => handleAddLookup('itemTypes')}>Add Item Type</Button>
        </div>
      </div>

      {/* Add Item Definition */}
      <div style={{ marginBottom: '15px' }}>
        <Button onClick={handleAddDefinition}>Add Item Definition</Button>
      </div>

      {/* Show current lookup data */}
      <details>
        <summary style={{ cursor: 'pointer' }}>Show Current Lookup Data</summary>
        <pre style={{ fontSize: '12px', background: '#fff', padding: '5px' }}>
          OrgUnits: {JSON.stringify(orgUnits, null, 2)}
          <br />
          Manufacturers: {JSON.stringify(manufacturers, null, 2)}
          <br />
          ItemTypes: {JSON.stringify(itemTypes, null, 2)}
          <br />
          ItemDefinitions: {JSON.stringify(itemDefinitions, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default SeedDataForm;
