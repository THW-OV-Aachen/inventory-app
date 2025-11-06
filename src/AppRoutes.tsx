import { Route, Routes } from 'react-router';

import App from './App';
import Dashboard from './features/dashboard/Dashboard';
import InventoryOverview from './features/inventory/InventoryOverview';
import Home from './features/home/Home';
import PackingPlans from './features/packingPlans/PackingPlans';
import ImportExport from './features/importExport/ImportExport';
import Guide from './features/guide/Guide';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Home page - no layout/sidebar */}
            <Route path="/" element={<Home />} />

            {/* Pages with layout and sidebar */}
            <Route path="/app" element={<App />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="inventory" element={<InventoryOverview />} />
                <Route path="packing-plans" element={<PackingPlans />} />
                <Route path="import-export" element={<ImportExport />} />
                <Route path="guide" element={<Guide />} />
            </Route>
        </Routes>
    );
};
export default AppRoutes;
