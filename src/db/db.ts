import Dexie, { type Table } from 'dexie';
import type { IItem } from './items';
import type { ILabel } from './labels';

export class InventoryDb extends Dexie {
    public items!: Table<IItem, string>;
    public labels!: Table<ILabel, string>;

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
                'labels',
            ].join(','),
            labels: ['++id', 'name', 'color'].join(','),
        });
    }
}

export const db = new InventoryDb();
