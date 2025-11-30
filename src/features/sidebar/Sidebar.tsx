import { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wrench, CircleQuestionMark, ToyBrick, Columns2, FolderSync } from 'lucide-react';
import logo from '../../assets/favicon.svg';
import IconContainer from '../../utils/IconContainer';

const SidebarSection = styled.div`
    padding-left: 8px;
    padding-right: 8px;
`;

const SidebarWrapper = styled.aside<{ $open: boolean }>`
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-accent);
    font-size: 16px;
    min-width: ${(p) => (p.$open ? '320px' : '0px')};
    height: 100vh;

    z-index: 1000;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        height: unset;
        width: 100vw;

        position: absolute;
        bottom: 0;

        box-shadow: 0 -4px 12px rgba(var(--color-font-primary-rgb), 0.1);
    }
`;

const SidebarHeaderWrapper = styled(SidebarSection)<{ $sidebarOpen?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    padding: 12px;
    height: 56px;
    box-sizing: border-box;
    color: var(--color-font-primary);
    position: relative;
    overflow: hidden;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        display: none;
    }
`;

const SectionLine = styled.div`
    height: 1px;
    width: 100%;
    display: block;
    content: '';
    background-color: var(--color-bg-accent-darker);

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        display: none;
    }
`;

const LogoWrapper = styled.div`
    overflow: hidden;
    border-radius: 8px;
    width: 1.75em;
    height: 1.75em;

    display: flex;

    img {
        width: 100%;
        height: 100%;
    }
`;

const ToggleSidebar = styled.span<{ $sidebarOpen?: boolean }>`
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: ${(p) => (p.$sidebarOpen ? '12px' : '50%')};
    transform: translateX(${(p) => (p.$sidebarOpen ? '0' : '50%')}) translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 6px;

    &:hover {
        background-color: var(--color-bg-accent-darker);
    }
`;

const SidebarHeaderLogo = styled.div<{ $sidebarOpen: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    overflow: hidden;

    max-width: ${(p) => (p.$sidebarOpen ? 'auto' : '0')};
    width: 100%;

    & > * {
        overflow: hidden;
        white-space: nowrap;
    }
`;

const SidebarHeader = (props: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { open, setOpen } = props;

    return (
        <SidebarHeaderWrapper>
            <SidebarHeaderLogo $sidebarOpen={open}>
                <LogoWrapper>
                    <img src={logo} alt="Logo" />
                </LogoWrapper>
                THW Inventar
            </SidebarHeaderLogo>
            <ToggleSidebar onClick={() => setOpen(!open)} $sidebarOpen={open}>
                <IconContainer icon={Columns2} />
            </ToggleSidebar>
        </SidebarHeaderWrapper>
    );
};

const LinkList = styled(SidebarSection)`
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;

    padding-top: 12px;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        flex-direction: row;
        padding: 0;
        gap: 16px;

        justify-content: safe center;
        overflow-x: auto;

        scroll-behavior: smooth;

        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

const LinkSpacer = styled.div`
    flex: 1;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        display: none;
    }
`;

const NavLink = styled(Link)<{ $active?: boolean; $sidebarOpen: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${(p) => (p.$sidebarOpen ? '8px' : '0')};
    justify-content: ${(p) => (p.$sidebarOpen ? 'flex-start' : 'center')};
    background: ${(p) => (p.$active ? 'rgba(var(--color-primary-rgb), .1)' : 'unset')};
    color: ${(p) => (p.$active ? 'var(--color-font-primary)' : 'var(--color-font-secondary)')};
    font-weight: ${(p) => (p.$active ? 'bold' : 'normal')};
    padding: 12px;
    border-radius: 6px;
    overflow: hidden;
    text-decoration: none;

    & > *:first-child {
        flex-shrink: 0;
        min-width: 1em;
        min-height: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    & > span {
        white-space: nowrap;
        overflow: hidden;
        max-width: ${(p) => (p.$sidebarOpen ? '300px' : '0')};
        opacity: ${(p) => (p.$sidebarOpen ? '1' : '0')};
        pointer-events: none;
    }

    &:hover {
        background-color: ${(p) => (p.$active ? '' : 'var(--color-bg-accent-darker)')};
    }

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 16px;
        flex-shrink: 0;
        border-radius: 0;
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
    }
`;

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const links = [
        { to: '/dashboard', label: 'Home', icon: Home },
        { to: '/maintenance', label: 'Wartungsübersicht', icon: Wrench },
        { to: '/items', label: 'Inventar', icon: ToyBrick },
    ];

    const bottomLinks = [
        { to: '/guide', label: 'Guide', icon: CircleQuestionMark },
        { to: '/import', label: 'Import/ Export', icon: FolderSync },
    ];

    return (
        <>
            <SidebarWrapper $open={open}>
                <SidebarHeader open={open} setOpen={setOpen} />
                <SectionLine />
                <LinkList>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            $sidebarOpen={open}
                            $active={location.pathname === link.to}
                            onClick={() => setOpen(false)}
                        >
                            <IconContainer icon={link.icon} />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                    <LinkSpacer />
                    {bottomLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            $sidebarOpen={open}
                            $active={location.pathname === link.to}
                            onClick={() => setOpen(false)}
                        >
                            <IconContainer icon={link.icon} />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </LinkList>
            </SidebarWrapper>
        </>
    );
};

export default Sidebar;
