import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { inventoryApi } from '../../app/api';
import { type IDbInventoryItem } from '../../db/items';
import PageHeader from '../../layout/PageHeader';

// ─── Types ────────────────────────────────────────────────
type MaintenanceStatus = 'GREEN' | 'YELLOW' | 'RED';

// ─── Helpers ──────────────────────────────────────────────
const getMaintenanceStatus = (item: IDbInventoryItem): MaintenanceStatus => {
  if (item.isAvailable === false) return 'RED';
  const actual = Number(item.amountActual ?? 0);
  const target = Number(item.amountTarget ?? 0);
  if (!target) return actual > 0 ? 'GREEN' : 'YELLOW';
  const ratio = actual / target;
  if (ratio < 0.5) return 'RED';
  if (ratio < 1.0) return 'YELLOW';
  return 'GREEN';
};

const colorFor = (status: MaintenanceStatus) => {
  switch (status) {
    case 'GREEN': return '#27ae60';
    case 'YELLOW': return '#f39c12';
    case 'RED': return '#e46e61ff';
  }
};

// ─── Component ────────────────────────────────────────────
const MaintenanceOverview = () => {
  const items = inventoryApi.useInventoryItems();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    return (items ?? []).map((it) => {
      const status = getMaintenanceStatus(it);
      return { item: it, status, color: colorFor(status) };
    });
  }, [items]);

  return (
   

    <div>
      <PageHeader title="Maintenance Overview" />

      
      <Legend>
        <LegendItem><Badge bg={colorFor('GREEN')} /> OK (sufficient stock)</LegendItem>
        <LegendItem><Badge bg={colorFor('YELLOW')} /> Low (below target)</LegendItem>
        <LegendItem><Badge bg={colorFor('RED')} /> Critical / Unavailable</LegendItem>
      </Legend>



      <CardList>
        {rows.length === 0 && <Empty>No inventory items found.</Empty>}
        {rows.map(({ item, color }) => (
          <Card
            key={item.id} 
            color={color}
            expanded={expandedId === String(item.id)}
            onClick={() =>
             setExpandedId(expandedId === String(item.id) ? null : String(item.id))
            }

          >

            <CardHeader>
            {item.externalId}
            <span style={{ fontSize: '0.9em', color: '#555', marginLeft: '8px' }}>
            ({item.position})
            </span>
            </CardHeader>


            {expandedId === String(item.id) && (
              <CardDetails>
                <p><strong>ID:</strong> {item.id}</p>
                <p><strong>Position:</strong> {item.position}</p>
                <p><strong>Available:</strong> {item.isAvailable ? 'Yes' : 'No'}</p>
                <p><strong>Actual / Target:</strong> {item.amountActual ?? 0} / {item.amountTarget ?? 0}</p>
                <p><strong>Def. ID:</strong> {item.itemDefinitionId}</p>
                <p><strong>Org. ID:</strong> {item.organisationalUnitId}</p>
              </CardDetails>
            )}
          </Card>
        ))}
      </CardList>
    </div>

  );
};

export default MaintenanceOverview;

//l mise en page hethi

const Page = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;



const Legend = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
`;

const LegendItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
`;

const Badge = styled.span<{ bg: string }>`
  width: 14px;
  height: 14px;
  display: inline-block;
  border-radius: 3px;
  background: ${({ bg }) => bg};
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Card = styled.div<{ color: string; expanded: boolean }>`
  background: ${({ color }) => color};
  color: white;
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ expanded }) =>
    expanded ? '0 6px 12px rgba(0,0,0,0.25)' : '0 2px 4px rgba(0,0,0,0.1)'};
  transform: ${({ expanded }) => (expanded ? 'scale(1.02)' : 'scale(1)')};
`;

const CardHeader = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const CardDetails = styled.div`
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
`;

const Empty = styled.div`
  color: #7f8c8d;
  text-align: center;
  padding: 30px;
`;

