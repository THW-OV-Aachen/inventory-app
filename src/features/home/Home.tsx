import styled from 'styled-components';
import { useNavigate } from 'react-router';
import StorageIcon from '@mui/icons-material/Storage';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HelpIcon from '@mui/icons-material/Help';
import { theme } from '../../theme';
import { Button } from '../../components/Button';

const HomeContainer = styled.div`
    width: 100%;
    height: 100%;
    background: ${theme.gradients.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
`;

const Content = styled.div`
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-sizing: border-box;
`;

const LogoWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    img {
        width: 100px;
        height: 100px;
        object-fit: contain;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }
`;

const Title = styled.h1`
    color: ${theme.colors.primary};
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    margin: 0;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
    color: ${theme.colors.primary};
    font-size: 13px;
    text-align: center;
    margin: 0;
    font-weight: 500;
    opacity: 0.9;
`;

const MenuTitle = styled.h2`
    color: ${theme.colors.primary};
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin: 5px 0 10px 0;
    letter-spacing: 1px;
`;

const MenuContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 10px;
`;

const StyledButton = styled(Button)`
    width: 100%;
    font-size: 15px;
    
    svg {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
    }
`;

const Home = () => {
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Inventory', path: '/app/inventory', icon: <StorageIcon /> },
        { label: 'Packing Plans', path: '/app/packing-plans', icon: <AssignmentIcon /> },
        { label: 'Import/Export', path: '/app/import-export', icon: <FileDownloadIcon /> },
        { label: 'How To Guide?', path: '/app/guide', icon: <HelpIcon /> },
    ];

    return (
        <HomeContainer>
            <Content>
                <LogoWrapper>
                    <img src="/logo_thw.png" alt="THW Aachen Logo" />
                </LogoWrapper>

                <div style={{ textAlign: 'center' }}>
                    <Title>Inventory App</Title>
                    <Subtitle>THW Aachen Inventarplaner</Subtitle>
                </div>

                <div style={{ width: '100%' }}>
                    <MenuTitle>MENU</MenuTitle>
                    <MenuContainer>
                        {menuItems.map((item) => (
                            <StyledButton
                                key={item.path}
                                variant="primary"
                                size="lg"
                                onClick={() => navigate(item.path)}
                            >
                                {item.icon}
                                {item.label}
                            </StyledButton>
                        ))}
                    </MenuContainer>
                </div>
            </Content>
        </HomeContainer>
    );
};

export default Home;

