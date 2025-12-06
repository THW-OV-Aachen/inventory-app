import { Navigate, Route, Routes } from 'react-router-dom';

import App from './App';
import PrivateOutlet from './features/auth/PrivateOutlet';
import Dashboard from './features/dashboard/Dashboard';
import InventoryOverview from './features/inventory/InventoryOverview';
import MaintenanceOverview from './features/maintenance/maintenanceOverview';
import ItemDetails from './features/item/itemDetails';

import ItemOverview from './features/item/itemOverview';

import Guide from './features/guide/guide';
import More from './features/more/More';

import ImportExportScreen from './features/importExport/ImportScreen';
import AddItem from './features/item/AddItem';
import ModifyItem from './features/item/ModifyItem';
import Home from './features/home/home';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="*" element={<PrivateOutlet />}>
                    <Route path="inventory" element={<InventoryOverview />} />
                </Route>

                <Route path="maintenance" element={<MaintenanceOverview />} />
                <Route path="guide" element={<Guide />} />
                <Route path="more" element={<More />} />

                <Route path="items" element={<ItemOverview />} />
                <Route path="items/add" element={<AddItem />} />
                <Route path="items/:itemId/modify" element={<ModifyItem />} />
                <Route path="items/:itemId" element={<ItemDetails />} />

                <Route path="import" element={<ImportExportScreen />} />
            </Route>
        </Routes>
    );
};
export default AppRoutes;
