import GlobalStyle from './styles/GlobalStyle';

import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap

import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './features/sidebar/Sidebar';

const LayoutWrapper = styled.div`
    position: relative;
    display: flex;
    height: 100vh;
    width: 100vw;

    background: transparent;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        flex-direction: column;
        padding-bottom: 56px;
    }
`;

const ContentArea = styled.div`
    flex: 1;
    padding: 24px 32px;
    overflow-y: auto;

    margin-left: 0;

    height: 100%;
    width: 100%;
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
