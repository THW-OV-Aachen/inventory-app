import React from 'react';
import ItemDetailsSmall from './ItemDetailsSmall';
import ItemDetailsLarge from './ItemDetailsLarge';

interface ItemDetailsProps {
    itemReference?: string;
    maintenanceStatus?: string;
    location?: string;
    details?: string;
    onAdditionalDocsClick?: () => void;
}

/**
 * ItemDetails - Orchestrator component for responsive item details display
 * Delegates rendering to specialized components based on screen size:
 * - Small screens (< lg): Card layout via ItemDetailsSmall
 * - Large screens (≥ lg): Layout via ItemDetailsLarge
 */
const ItemDetails: React.FC<ItemDetailsProps> = ({
    itemReference,
    maintenanceStatus,
    location,
    details,
    onAdditionalDocsClick,
}) => {
    return (
        <>
            {/* Small screens: Cards */}
            <div className="block lg:hidden">
                <ItemDetailsSmall
                    itemReference={itemReference}
                    maintenanceStatus={maintenanceStatus}
                    location={location}
                    details={details}
                    onAdditionalDocsClick={onAdditionalDocsClick}
                />
            </div>

            {/* Large screens: Table */}
            <div className="hidden lg:block">
                <ItemDetailsLarge
                    itemReference={itemReference}
                    maintenanceStatus={maintenanceStatus}
                    location={location}
                    details={details}
                    onAdditionalDocsClick={onAdditionalDocsClick}
                />
            </div>
        </>
    );
};

export default ItemDetails;

