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
                'inventoryNumber',
                'deviceNumber',
                'name',
                'isSet',
                'amountTarget',
                'amountActual',
                'availability',
                'damageLevel',
                'lastInspection',
                'inspectionIntervalDays',
                'location',
                'level',
                'remark',
            ].join(','),
        });
    }
}

export const db = new InventoryDb();
