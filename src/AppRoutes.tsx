import { Route, Routes, Navigate } from 'react-router-dom';

import App from './App';
import PrivateOutlet from './features/auth/PrivateOutlet';
import Dashboard from './features/dashboard/Dashboard';
import InventoryOverview from './features/inventory/InventoryOverview';
import MaintenanceOverview from './features/maintenance/maintenanceOverview';
import ItemDetails from './features/item/itemDetails';


import ItemOverview from './features/item/itemOverview';


import Home from './features/home/home';
import Guide from './features/guide/guide';

import ItemAdding from './features/item/itemAdding';



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
                <Route path= "guide" element={<Guide />} />

                <Route path="itemOverview" element={<ItemOverview />} />
                <Route path="/itemAdding" element={<ItemAdding />} />
                <Route path="itemDetails" element={<ItemDetails />} />


            </Route>
        </Routes>
    );
};
export default AppRoutes;
