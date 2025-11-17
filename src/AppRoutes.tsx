import { Route, Routes, Navigate } from 'react-router';

import App from './App';
import PrivateOutlet from './features/auth/PrivateOutlet';
import Dashboard from './features/dashboard/Dashboard';
import InventoryOverview from './features/inventory/InventoryOverview';
<<<<<<< HEAD
import ImportExport from './features/importExport/ImportExport';
import Overview from './features/overview/Overview';
import ItemPage from './features/items/ItemPage';
=======
import ItemPage from './features/items/ItemPage';
import Overview from './features/overview/Overview';
>>>>>>> origin/4-item-list-overview

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="" element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
<<<<<<< HEAD
                <Route path="importExport" element={<ImportExport />} />
                <Route path="overview" element={<Overview />} />
                <Route path="items/:itemId" element={<ItemPage />} />
=======
                <Route path="items" element={<ItemPage />} />
                <Route path="overview" element={<Overview />} />
>>>>>>> origin/4-item-list-overview
                <Route path="*" element={<PrivateOutlet />}>
                    <Route path="inventory" element={<InventoryOverview />} />
                </Route>
            </Route>
        </Routes>
    );
};
export default AppRoutes;
