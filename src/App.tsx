import GlobalStyle from './styles/GlobalStyle';

import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap

import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './features/sidebar/Sidebar';

const LayoutWrapper = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;

    background: transparent;
`;

const ContentArea = styled.div`
    flex: 1;
    padding: 24px 32px;
    overflow-y: auto;

    margin-left: 0;
`;

const MainLayout = () => {
    return (
        <LayoutWrapper>
            <Sidebar />
            <ContentArea>
                <Outlet />
            </ContentArea>
        </LayoutWrapper>
    );
};

const App = () => {
    return (
        <>
            <GlobalStyle />
            <MainLayout />
        </>
    );
};

export default App;
