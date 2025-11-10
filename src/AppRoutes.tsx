import { Route, Routes, Navigate } from 'react-router';

import App from './App';
import PrivateOutlet from './features/auth/PrivateOutlet';
import Dashboard from './features/dashboard/Dashboard';
import InventoryOverview from './features/inventory/InventoryOverview';
import ItemPage from './features/items/ItemPage';
import Overview from './features/overview/Overview';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="" element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="items" element={<ItemPage />} />
                <Route path="overview" element={<Overview />} />
                <Route path="*" element={<PrivateOutlet />}>
                    <Route path="inventory" element={<InventoryOverview />} />
                </Route>
            </Route>
        </Routes>
    );
};
export default AppRoutes;
