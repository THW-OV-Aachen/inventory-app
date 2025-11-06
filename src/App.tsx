import { Outlet } from 'react-router';
import styled from 'styled-components';
import Sidebar from './features/sidebar/Sidebar';

const PageWrapper = styled.div`
    width: 100vw;
    height: 100vh;
`;

const App = () => {
    return (
        <PageWrapper>
            <Sidebar />
            <div className="app-content">
                <Outlet />
            </div>
        </PageWrapper>
    );
};

export default App;
