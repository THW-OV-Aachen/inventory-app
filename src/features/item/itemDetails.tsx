import ItemDetailsComponent from './ItemDetails/ItemDetails';

const ItemDetails = () => {
    const itemReference = 'Item Ref: B-12345';
    const maintenanceStatus = 'Good';
    const location = '3B';
    const details = `-Here is some detailed information of the selected Item.
-This is the second line of information.
-And this is the third line.`;

    const handleAdditionalDocs = () => {
        alert('Additional Docs clicked!');
    };

    return (
        <ItemDetailsComponent
            itemReference={itemReference}
            maintenanceStatus={maintenanceStatus}
            location={location}
            details={details}
            onAdditionalDocsClick={handleAdditionalDocs}
        />
    );
};

export default ItemDetails;
