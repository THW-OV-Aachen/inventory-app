import styled from 'styled-components';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorageIcon from '@mui/icons-material/Storage';
import { theme } from '../../theme';
import Button from '../../components/Button';
import { inventoryApi } from '../../app/api';

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${theme.colors.surfaceAlt};
    overflow: hidden;
`;

const Header = styled.div`
    background: ${theme.colors.primary};
    color: white;
    padding: 24px;
    box-shadow: ${theme.shadows.md};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const Title = styled.h1`
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: white;
`;

const Content = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 24px;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: ${theme.colors.surfaceAlt};
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;

        &:hover {
            background: #555;
        }
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

const EmptyState = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: ${theme.colors.textMuted};

    h3 {
        margin: 0 0 8px 0;
        color: ${theme.colors.textLight};
        font-size: 20px;
    }

    p {
        margin: 0;
        font-size: 14px;
    }
`;

const IconWrapper = styled.div`
    font-size: 48px;
    color: ${theme.colors.border};
    margin-bottom: 16px;
`;

const InventoryOverview = () => {
    const navigate = useNavigate();
    const data = inventoryApi.useInventoryItems();

    return (
        <PageContainer>
            <Header>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={() => navigate('/')}
                >
                    <ArrowBackIcon fontSize="small" />
                    Back to Menu
                </Button>
                <Title>Inventory Overview</Title>
            </Header>

            <Content>
                {data.length === 0 ? (
                    <TableContainer>
                        <EmptyState>
                            <IconWrapper>
                                <StorageIcon sx={{ fontSize: 48 }} />
                            </IconWrapper>
                            <h3>No Items</h3>
                            <p>Add your first inventory item from the Dashboard</p>
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
                                    <th>Floor</th>
                                    <th>Amount (Actual/Target)</th>
                                    <th>Available</th>
                                    <th>Type</th>
                                    <th>Org Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td>{item.externalId}</td>
                                        <td>{item.position}</td>
                                        <td>{item.floor}</td>
                                        <td>{item.amountActual}/{item.amountTarget}</td>
                                        <td>{item.isAvailable ? '✓' : '✗'}</td>
                                        <td>{item.compoundType}</td>
                                        <td>{item.organisationalUnitId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableContainer>
                )}
            </Content>
        </PageContainer>
    );
};

export default InventoryOverview;
