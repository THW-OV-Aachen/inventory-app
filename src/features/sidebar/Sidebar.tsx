import styled from 'styled-components';
import { theme } from '../../theme';

const SidebarContainer = styled.aside`
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    height: 100vh;
    background: ${theme.colors.primary};
    padding: 20px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow-y: auto;

    @media (min-width: 768px) {
        display: flex;
        flex-direction: column;
    }
`;

const Sidebar = () => {
    return <SidebarContainer></SidebarContainer>;
};

export default Sidebar;
