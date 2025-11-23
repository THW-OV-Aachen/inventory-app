import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../features/sidebar/Sidebar';
import BottomNav from './BottomNav';
import logo from '../assets/favicon.svg'

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100dvh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;

  background: transparent;

`;

const ContentArea = styled.div`
  flex: 1;
  padding: 16px;
  padding-bottom: calc(64px + env(safe-area-inset-bottom, 8px) + 24px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  max-width: 100%;

  margin-left: 0;

  @media (min-width: 768px) {
    padding: 24px 32px;
    padding-bottom: 24px;
    margin-left: 220px;
  }
`;





const Logo = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 1000;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  display: none;
  
  &:hover {
    opacity: 1;
  }

  @media (min-width: 768px) {
    display: block;
    left: 236px;
  }

  img {
    width: 48px;
    height: 48px;
    display: block;
  }
`;




const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <LayoutWrapper>
      <Sidebar />
      <ContentArea>
        <Outlet />
      </ContentArea>

      <BottomNav />

      {isHomePage && (
        <Logo>
          <img src={logo} alt="THW Logo" />
        </Logo>
      )}
    </LayoutWrapper>
  );
};

export default MainLayout;
