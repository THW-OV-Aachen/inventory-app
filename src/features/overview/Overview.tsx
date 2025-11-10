import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const contentWidth = '400px';

const PageContainer = styled.div`
    padding: 20px;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f7f7f7;
`;

const TopBar = styled.div`
    width: ${contentWidth};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
`;

const SearchAndSortContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 8px;
    margin-right: 10px;
`;

const SearchInput = styled.input`
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const SortSelect = styled.select`
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: white;
`;

const ButtonColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Button = styled.button`
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    width: 80px;
    &:hover {
        background-color: #0056b3;
    }
`;

const ItemCard = styled.div<{ status: string }>`
    width: ${contentWidth};
    border-radius: 10px;
    padding: 10px 15px;
    margin-bottom: 15px;
    background-color: ${({ status }) => (status === 'Good' ? '#b8f3c1' : status === 'Soon' ? '#ffe8a1' : '#f8a6a6')};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition:
        transform 0.1s ease,
        box-shadow 0.1s ease;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    }
`;

const ItemTitle = styled.div`
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 5px;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #333;
`;

const Label = styled.span`
    font-weight: 600;
`;

const OverviewPage = () => {
    const navigate = useNavigate();

    const [sortOption, setSortOption] = useState('item');
    const [items, setItems] = useState([
        { id: 1, status: 'Good', location: '3B' },
        { id: 2, status: 'Soon', location: '2C' },
        { id: 3, status: 'Danger!', location: '1C' },
        { id: 4, status: 'Good', location: '3C' },
        { id: 5, status: 'Good', location: '3D' },
    ]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSortOption(value);

        let sorted = [...items];
        if (value === 'item') {
            sorted.sort((a, b) => a.id - b.id);
        } else if (value === 'status') {
            sorted.sort((a, b) => a.status.localeCompare(b.status));
        } else if (value === 'location') {
            sorted.sort((a, b) => a.location.localeCompare(b.location));
        }
        setItems(sorted);
    };

    const handleCardClick = (itemId: number) => {
        // Navigate to /items page — you can pass state or params if needed
        navigate(`/items`);
    };

    return (
        <PageContainer>
            <TopBar>
                <SearchAndSortContainer>
                    <SearchInput placeholder="Search" />
                    <SortSelect value={sortOption} onChange={handleSortChange}>
                        <option value="item">Sort by Item #</option>
                        <option value="status">Sort by Status</option>
                        <option value="location">Sort by Location</option>
                    </SortSelect>
                </SearchAndSortContainer>

                <ButtonColumn>
                    <Button>+Item</Button>
                    <Button>+Pack</Button>
                </ButtonColumn>
            </TopBar>

            {items.map((item) => (
                <ItemCard key={item.id} status={item.status} onClick={() => handleCardClick(item.id)}>
                    <ItemTitle>Item #{item.id}</ItemTitle>
                    <InfoRow>
                        <div>
                            <Label>Maintenance Stat:</Label> {item.status}
                        </div>
                        <div>
                            <Label>Location:</Label> {item.location}
                        </div>
                    </InfoRow>
                </ItemCard>
            ))}
        </PageContainer>
    );
};

export default OverviewPage;
