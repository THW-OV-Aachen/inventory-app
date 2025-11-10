import Dexie, { type Table } from 'dexie';
import type { ItemDb, ItemGroupDb } from './items';
export class InventoryDb extends Dexie {
    public items!: Table<ItemDb, number>;
    public itemGroups!: Table<ItemGroupDb, number>;

    constructor() {
        super('InventoryDb');

        this.version(1).stores({
            items: [
                '++id',
                'name',
                'isSet',
                'remark',
                'availability',
                'damageLevel',
                'lastInspection',
                'inspectionIntervalDays',
                'location',
                '&itemNumber',
                'inventoryNumber',
                'deviceNumber',
            ].join(','),
        });
    }
}

export const db = new InventoryDb();
