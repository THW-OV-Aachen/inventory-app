import { type IItem } from '../db/items';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { read } from 'fs';

export type Scope = 'user' | 'editor' | 'admin';

export const inventoryApi = {
    async addItem(itemData: Omit<IItem, 'id'>): Promise<void> {
        try {
            await db.items.add(itemData as IItem);
        } catch (error) {
            console.error('Failed to add inventory item: ', error);
            if ((error as Error).name === 'ConstraintError') {
                console.error('Error: An item with this "Sachnummer" (id) already exists.');
            }
        }
    },
    useItems() {
        const items: IItem[] | undefined = useLiveQuery(() => db.items.orderBy('id').toArray(), []);
        return items ?? [];
    },
    async getItem(id: string | number): Promise<IItem | undefined> {
        try {
            const item = await db.items.get(id as any);
            return item;
        } catch (error) {
            console.error('Failed to read item: ', error);
            return undefined;
        }
    },
    async updateItem(id: string | number, changes: Partial<IItem>): Promise<boolean> {
        try {
            await db.items.update(id as any, changes);
            return true;
        } catch (err) {
            console.error('Failed to update item', err);
            return false;
        }
    },
    async deleteItem(id: string): Promise<void> {
        try {
            await db.items.delete(id);
        } catch (error) {
            console.error('Failed to delete item: ', error);
        }
    },
    async clearAll(): Promise<void> {
        try {
            await db.items.clear();
        } catch (err) {
            console.error('Failed to clear items', err);
            throw err;
        }
    },
};
