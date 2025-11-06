import { Outlet } from 'react-router';
import styled from 'styled-components';
import Sidebar from './features/sidebar/Sidebar';

const PageWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    background: white;

    @media (min-width: 768px) {
        padding-left: 250px;
    }
`;

const AppContent = styled.div`
    flex: 1;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
`;

const App = () => {
    return (
        <PageWrapper>
            <Sidebar />
            <AppContent>
                <Outlet />
            </AppContent>
        </PageWrapper>
    );
};

export default App;
