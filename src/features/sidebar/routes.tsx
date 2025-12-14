import { Home, Package, FolderSync, CircleQuestionMark } from 'lucide-react';

export const navItems = [
    { path: '/', label: 'Start', icon: Home },
    { path: '/items', label: 'Inventar', icon: Package },
    // { path: '/maintenance', label: 'Wartung', icon: Wrench },
    { path: '/import', label: 'Import / Export', icon: FolderSync },
    { path: '/guide', label: 'Anleitung', icon: CircleQuestionMark },
];
