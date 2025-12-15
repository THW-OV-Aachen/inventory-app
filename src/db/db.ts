import Dexie, { type Table } from 'dexie';
import type { IItem } from './items';
export class InventoryDb extends Dexie {
    public items!: Table<IItem, string>;

    constructor() {
        super('InventoryDb');

        this.version(1).stores({
            items: [
                '&id',
                '&inventoryNumber',
                '&deviceNumber',
                'name',
                'isSet',
                'amountTarget',
                'amountActual',
                'availability',
                'damageLevel',
                'lastInspection',
                'inspectionIntervalMonths',
                'location',
                'level',
                'remark',
            ].join(','),
        });
    }
}

export const db = new InventoryDb();
