import { DamageLevelType, type IItem } from '../db/items';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

export type Scope = 'user' | 'editor' | 'admin';
export interface PaginationParams {
    page: number;
    pageSize: number;
}
export interface FilterParams {
    damageLevel?: DamageLevelType | null;
    type?: 'isSet' | 'isPart' | null;
    location?: string | null;
}
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasMore: boolean;
    };
}

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

    async fetchItemsPaginated(params: PaginationParams): Promise<PaginatedResult<IItem>> {
        const { page, pageSize } = params;
        const offset = (page - 1) * pageSize;

        try {
            const totalItems = await db.items.count();

            // Note: Using offset().limit() - offset must come before limit
            const data = await db.items.orderBy('id').offset(offset).limit(pageSize).toArray();

            const totalPages = Math.ceil(totalItems / pageSize);

            return {
                data,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalItems,
                    totalPages,
                    hasMore: page < totalPages,
                },
            };
        } catch (error) {
            console.error('Failed to fetch paginated items: ', error);
            throw error;
        }
    },
    async fetchItemsPaginatedWithFilter(
        params: PaginationParams,
        searchTerm: string,
        filters?: FilterParams
    ): Promise<PaginatedResult<IItem>> {
        const { page, pageSize } = params;
        const offset = (page - 1) * pageSize;

        try {
            const hasFilters = filters && (filters.damageLevel || filters.type || filters.location);

            if (!searchTerm && !hasFilters) {
                return await this.fetchItemsPaginated(params);
            }

            // when filtering, we need to get all items and filter in memory
            const allItems = await db.items.orderBy('id').toArray();

            const term = searchTerm.toLowerCase();
            const filteredItems = allItems.filter((item) => {
                const matchesSearch =
                    !searchTerm ||
                    [item.name, item.location, item.id, item.inventoryNumber || '', item.deviceNumber || ''].some(
                        (field) => field.toLowerCase().includes(term)
                    );

                const matchesDamageLevel = !filters?.damageLevel || item.damageLevel === filters.damageLevel;

                const matchesType =
                    !filters?.type ||
                    (filters.type === 'isSet' ? item.isSet : filters.type === 'isPart' ? !item.isSet : true);

                const matchesLocation =
                    !filters?.location || item.location.toLowerCase().includes(filters.location.toLowerCase());

                return matchesSearch && matchesDamageLevel && matchesType && matchesLocation;
            });

            const totalItems = filteredItems.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const paginatedData = filteredItems.slice(offset, offset + pageSize);

            return {
                data: paginatedData,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalItems,
                    totalPages,
                    hasMore: page < totalPages,
                },
            };
        } catch (error) {
            console.error('Failed to fetch filtered paginated items: ', error);
            throw error;
        }
    },
    useItems() {
        const items: IItem[] | undefined = useLiveQuery(() => db.items.orderBy('id').toArray(), []);
        return items ?? [];
    },
    useItemsPaginated(page: number, pageSize: number) {
        const offset = (page - 1) * pageSize;
        const items: IItem[] | undefined = useLiveQuery(
            () => db.items.orderBy('id').offset(offset).limit(pageSize).toArray(),
            [page, pageSize]
        );
        return items ?? [];
    },

    useTotalItemCount() {
        const count: number | undefined = useLiveQuery(() => db.items.count(), []);
        return count ?? 0;
    },

    async deleteItem(id: string): Promise<void> {
        try {
            await db.items.delete(id);
        } catch (error) {
            console.error('Failed to delete item: ', error);
        }
    },

    async updateItem(id: string, updates: Partial<Omit<IItem, 'id'>>): Promise<void> {
        try {
            const existingItem = await db.items.get(id);
            if (!existingItem) {
                console.error(`Item with id "${id}" not found`);
                throw new Error(`Item with id "${id}" not found`);
            }

            await db.items.update(id, updates);
        } catch (error) {
            console.error('Failed to update inventory item: ', error);
            throw error;
        }
    },
};
