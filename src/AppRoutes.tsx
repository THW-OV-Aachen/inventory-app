import { Route, Routes, Navigate } from 'react-router';

import App from './App';
import PrivateOutlet from './features/auth/PrivateOutlet';
import Dashboard from './features/dashboard/Dashboard';
import InventoryOverview from './features/inventory/InventoryOverview';
import ImportExport from './features/importExport/ImportExport';
import Overview from './features/overview/Overview';
import ItemPage from './features/items/ItemPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="" element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="importExport" element={<ImportExport />} />
                <Route path="overview" element={<Overview />} />
                <Route path="items/:itemId" element={<ItemPage />} />
                <Route path="*" element={<PrivateOutlet />}>
                    <Route path="inventory" element={<InventoryOverview />} />
                </Route>
            </Route>
        </Routes>
    );
};
export default AppRoutes;
