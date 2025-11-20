import { Route, Routes, Navigate } from 'react-router';

import App from './App';
import PrivateOutlet from './features/auth/PrivateOutlet';
import Dashboard from './features/dashboard/Dashboard';
import InventoryOverview from './features/inventory/InventoryOverview';
import ImportExport from './features/importExport/ImportExport';
import Overview from './features/items/ItemOverview';
import ItemDetails from './features/items/ItemDetails';

import MaintenanceOverview from './features/maintenance/maintenanceOverview';
import Guide from './features/guide/guide';
import ItemAdding from './features/add/itemAdding';
import ImportExportScreen from './features/importExport/ImportScreen';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="" element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="importExport" element={<ImportExport />} />
                <Route path="items" element={<Overview />} />
                <Route path="items/:itemId" element={<ItemDetails />} />
                <Route path="*" element={<PrivateOutlet />}>
                    <Route path="inventory" element={<InventoryOverview />} />
                </Route>

                <Route path="maintenance" element={<MaintenanceOverview />} />
                <Route path="guide" element={<Guide />} />

                <Route path="itemAdding" element={<ItemAdding />} />

                <Route path="ImportScreen" element={<ImportExportScreen />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
