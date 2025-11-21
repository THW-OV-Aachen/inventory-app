import { Link } from 'react-router-dom';
import { Package, Wrench, Import, FileSpreadsheet, HelpCircle, PlusCircle, Layers } from 'lucide-react';

const Home = () => {
    return (
        <div className="container py-4">
            <h1 className="mb-4 fw-bold">Dashboard</h1>

            {/* KPI Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Total Items</h6>
                            <h3 className="fw-bold">-</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Missing Items</h6>
                            <h3 className="fw-bold text-danger">-</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Item Types</h6>
                            <h3 className="fw-bold">-</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Maintenance Items</h6>
                            <h3 className="fw-bold">-</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h4 className="mb-3">Quick Actions</h4>
            <div className="row g-3">
                <div className="col-md-3">
                    <Link to="/overview" className="text-decoration-none">
                        <div className="card p-3 shadow-sm border-0 text-center">
                            <Layers size={32} className="mb-2 text-primary" />
                            <h6 className="fw-bold">Items Overview</h6>
                        </div>
                    </Link>
                </div>

                <div className="col-md-3">
                    <Link to="/maintenance" className="text-decoration-none">
                        <div className="card p-3 shadow-sm border-0 text-center">
                            <Wrench size={32} className="mb-2 text-secondary" />
                            <h6 className="fw-bold">Maintenance</h6>
                        </div>
                    </Link>
                </div>

                <div className="col-md-3">
                    <Link to="/ImportScreen" className="text-decoration-none">
                        <div className="card p-3 shadow-sm border-0 text-center">
                            <FileSpreadsheet size={32} className="mb-2 text-success" />
                            <h6 className="fw-bold">Import / Export</h6>
                        </div>
                    </Link>
                </div>

                <div className="col-md-3">
                    <Link to="/guide" className="text-decoration-none">
                        <div className="card p-3 shadow-sm border-0 text-center">
                            <HelpCircle size={32} className="mb-2 text-info" />
                            <h6 className="fw-bold">Guide</h6>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Add item */}
            <div className="mt-5">
                <Link to="/itemAdding" className="btn btn-primary d-flex align-items-center gap-2">
                    <PlusCircle size={18} />
                    Add New Inventory Item
                </Link>
            </div>
        </div>
    );
};

export default Home;
