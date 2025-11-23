import { useState, type JSX } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, Wrench, Eye, CircleQuestionMark, ToyBrick } from 'lucide-react';
import logo from '../../assets/favicon.svg';
import IconContainer from '../../utils/IconContainer';

const SidebarSection = styled.div`
    padding-left: 8px;
    padding-right: 8px;
`;

const SidebarWrapper = styled.aside<{ open: boolean }>`
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-accent);
    font-size: 16px;

    @media (min-width: 768px) {
        width: 320px;
    }
`;

const SidebarHeaderWrapper = styled(SidebarSection)<{ $sidebarOpen?: boolean }>`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    font-weight: bold;
    font-size: 20px;

    padding: 20px 12px;
`;

const SectionLine = styled.div`
    height: 1px;
    width: 100%;
    display: block;
    content: '';
    background-color: var(--color-bg-accent-darker);
`;

const LogoWrapper = styled.div`
    overflow: hidden;
    border-radius: 4px;
    width: 32px;
    height: 32px;

    display: flex;

    img {
        width: 100%;
        height: 100%;
    }
`;

const SidebarHeader = () => {
    return (
        <SidebarHeaderWrapper>
            <LogoWrapper>
                <img src={logo} alt="Logo" />
            </LogoWrapper>
            THW Inventar
        </SidebarHeaderWrapper>
    );
};

const LinkList = styled(SidebarSection)`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const NavLinks = styled(LinkList)`
    display: flex;
    flex-direction: column;
    padding-top: 12px;
`;

const BottomLinks = styled(LinkList)`
    margin-top: auto;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
    display: flex;
    flex-direction: row;
    gap: 8px;
    background: ${(p) => (p.$active ? 'rgba(var(--color-primary-rgb), .075)' : 'unset')};
    color: ${(p) => (p.$active ? 'var(--color-primary)' : 'var(--color-font-secondary)')};
    font-weight: ${(p) => (p.$active ? 'bold' : 'normal')};
    padding: 8px;
    border-radius: 4px;
    align-items: center;

    &:hover {
        background-color: ${(p) => (p.$active ? '' : 'var(--color-bg-accent-darker)')};
    }
`;

const ToggleButton = styled.button`
    display: none;
`;

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const links = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/dashboard', label: 'Inventory Overview', icon: Eye },
        { to: '/maintenance', label: 'Maintenance Overview', icon: Wrench },
        { to: '/items', label: 'Items Overview', icon: ToyBrick },
    ];

    const bottomLinks = [
        { to: '/guide', label: 'Guide', icon: CircleQuestionMark },
        { to: '/ImportScreen', label: 'Import/Export', icon: CircleQuestionMark },
    ];

    return (
        <>
            <ToggleButton onClick={() => setOpen(!open)}>{open ? <Menu size={18} /> : <Menu size={18} />}</ToggleButton>

            <SidebarWrapper open={open}>
                <SidebarHeader />
                <SectionLine />
                <NavLinks>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            $active={location.pathname === link.to}
                            onClick={() => setOpen(false)}
                        >
                            <IconContainer icon={link.icon} key={link.label} />
                            {link.label}
                        </NavLink>
                    ))}
                </NavLinks>

                <BottomLinks>
                    {bottomLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            $active={location.pathname === link.to}
                            onClick={() => setOpen(false)}
                        >
                            <IconContainer icon={link.icon} key={link.label} />
                            {link.label}
                        </NavLink>
                    ))}
                </BottomLinks>
            </SidebarWrapper>
        </>
    );
};

export default Sidebar;
