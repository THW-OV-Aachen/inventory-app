import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Home, Package, Wrench, MoreHorizontal } from 'lucide-react';

const BottomNavWrapper = styled.nav`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 64px;
    height: calc(64px + env(safe-area-inset-bottom, 0px));
    padding-bottom: env(safe-area-inset-bottom, 0px);
    background: white;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 1000;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;

    @media (min-width: 768px) {
        display: none;
    }
`;

const NavItem = styled.button<{ $active: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    flex: 1;
    min-height: 64px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    transition: all 0.2s ease;
    color: ${({ $active }) => ($active ? '#4A90E2' : '#64748b')};

    &:active {
        background-color: #f8fafc;
    }

    svg {
        width: 22px;
        height: 22px;
    }
`;

const NavLabel = styled.span<{ $active: boolean }>`
    font-size: 11px;
    font-weight: ${({ $active }) => ($active ? '600' : '500')};
    color: ${({ $active }) => ($active ? '#4A90E2' : '#64748b')};
`;

const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/itemOverview', label: 'Items', icon: Package },
        { path: '/maintenance', label: 'Maintenance', icon: Wrench },
        { path: '/more', label: 'More', icon: MoreHorizontal },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        if (path === '/more') {
            return location.pathname === '/more' || 
                   location.pathname === '/dashboard' || 
                   location.pathname === '/guide';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <BottomNavWrapper>
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                    <NavItem
                        key={item.path}
                        $active={active}
                        onClick={() => navigate(item.path)}
                    >
                        <Icon size={22} />
                        <NavLabel $active={active}>{item.label}</NavLabel>
                    </NavItem>
                );
            })}
        </BottomNavWrapper>
    );
};

export default BottomNav;

