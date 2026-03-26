import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import type { IPackingPlan, IPackingPlanItem, IScenarioType } from '../db/packingPlans';

const STABLE_EMPTY_ARRAY: any[] = [];

export const packingPlanApi = {
    async addPackingPlan(planData: Omit<IPackingPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const now = new Date().toISOString();
            const id = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const plan: IPackingPlan = {
                ...planData,
                id,
                createdAt: now,
                updatedAt: now,
            };
            await db.packingPlans.add(plan);
            return id;
        } catch (error) {
            console.error('Failed to add packing plan: ', error);
            throw error;
        }
    },

    async updatePackingPlan(id: string, updates: Partial<Omit<IPackingPlan, 'id' | 'createdAt'>>): Promise<void> {
        try {
            const existingPlan = await db.packingPlans.get(id);
            if (!existingPlan) {
                throw new Error(`Packing plan with id "${id}" not found`);
            }
            await db.packingPlans.update(id, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Failed to update packing plan: ', error);
            throw error;
        }
    },

    async deletePackingPlan(id: string): Promise<void> {
        try {
            // Delete all items associated with this plan
            await db.packingPlanItems.where('packingPlanId').equals(id).delete();
            // Delete the plan
            await db.packingPlans.delete(id);
        } catch (error) {
            console.error('Failed to delete packing plan: ', error);
            throw error;
        }
    },

    async getPackingPlan(id: string): Promise<IPackingPlan | undefined> {
        try {
            return await db.packingPlans.get(id);
        } catch (error) {
            console.error('Failed to get packing plan: ', error);
            throw error;
        }
    },

    async getAllPackingPlans(): Promise<IPackingPlan[]> {
        try {
            return await db.packingPlans.orderBy('createdAt').reverse().toArray();
        } catch (error) {
            console.error('Failed to get all packing plans: ', error);
            throw error;
        }
    },

    usePackingPlans() {
        const plans: IPackingPlan[] | undefined = useLiveQuery(
            () => db.packingPlans.orderBy('createdAt').reverse().toArray(),
            []
        );
        return plans ?? STABLE_EMPTY_ARRAY;
    },

    usePackingPlan(planId: string) {
        const plan: IPackingPlan | undefined = useLiveQuery(() => db.packingPlans.get(planId), [planId]);
        return plan;
    },

    // Packing Plan Items
    async addPackingPlanItem(itemData: Omit<IPackingPlanItem, 'id'>): Promise<string> {
        try {
            const id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const item: IPackingPlanItem = {
                ...itemData,
                id,
            };
            await db.packingPlanItems.add(item);
            return id;
        } catch (error) {
            console.error('Failed to add packing plan item: ', error);
            throw error;
        }
    },

    async updatePackingPlanItem(id: string, updates: Partial<Omit<IPackingPlanItem, 'id'>>): Promise<void> {
        try {
            await db.packingPlanItems.update(id, updates);
        } catch (error) {
            console.error('Failed to update packing plan item: ', error);
            throw error;
        }
    },

    async updatePackingPlanItemOrders(updates: { id: string; order: number }[]): Promise<void> {
        try {
            await db.transaction('rw', db.packingPlanItems, async () => {
                for (const update of updates) {
                    await db.packingPlanItems.update(update.id, { order: update.order });
                }
            });
        } catch (error) {
            console.error('Failed to bulk update packing plan item orders: ', error);
            throw error;
        }
    },

    async deletePackingPlanItem(id: string): Promise<void> {
        try {
            await db.packingPlanItems.delete(id);
        } catch (error) {
            console.error('Failed to delete packing plan item: ', error);
            throw error;
        }
    },

    async getPackingPlanItems(packingPlanId: string): Promise<IPackingPlanItem[]> {
        try {
            return await db.packingPlanItems.where('packingPlanId').equals(packingPlanId).sortBy('order');
        } catch (error) {
            console.error('Failed to get packing plan items: ', error);
            throw error;
        }
    },

    usePackingPlanItems(packingPlanId: string) {
        const items: IPackingPlanItem[] | undefined = useLiveQuery(
            () => db.packingPlanItems.where('packingPlanId').equals(packingPlanId).sortBy('order'),
            [packingPlanId]
        );
        return items ?? STABLE_EMPTY_ARRAY;
    },

    async clearAll(): Promise<void> {
        try {
            await db.packingPlans.clear();
            await db.packingPlanItems.clear();
        } catch (error) {
            console.error('Failed to clear packing plans: ', error);
            throw error;
        }
    },

    // ─── Scenario Types ──────────────────────────────

    async initDefaultScenarioTypes(): Promise<void> {
        try {
            const currentTypes = await db.scenarioTypes.toArray();
            const hasCustom = currentTypes.some(t => t.id === 'custom');
            
            if (!hasCustom) {
                await db.scenarioTypes.add({ id: 'custom', name: 'Sonstiges', icon: 'Package' });
            }
            
            if (currentTypes.length === 0) {
                const DEFAULT_SCENARIOS: IScenarioType[] = [
                    { id: 'flood', name: 'Hochwasser', icon: 'Droplets' },
                    { id: 'fire', name: 'Feuer', icon: 'Flame' },
                    { id: 'earthquake', name: 'Erdbeben', icon: 'Activity' },
                    { id: 'medical', name: 'Medizinischer Notfall', icon: 'BriefcaseMedical' },
                    { id: 'rescue', name: 'Menschenrettung', icon: 'LifeBuoy' },
                    { id: 'evacuation', name: 'Evakuierung', icon: 'Siren' },
                ];
                await db.scenarioTypes.bulkAdd(DEFAULT_SCENARIOS);
            }
        } catch (error) {
            console.error('Failed to initialize default scenario types: ', error);
        }
    },
    async getScenarioTypes(): Promise<IScenarioType[]> {
        try {
            return await db.scenarioTypes.toArray();
        } catch (error) {
            console.error('Failed to get scenario types: ', error);
            throw error;
        }
    },
    useScenarioTypes() {
        const types: IScenarioType[] | undefined = useLiveQuery(() => db.scenarioTypes.toArray(), []);
        
        useEffect(() => {
            if (types && !types.some(t => t.id === 'custom')) {
                packingPlanApi.initDefaultScenarioTypes();
            }
        }, [types]);

        return types ?? STABLE_EMPTY_ARRAY;
    },

    async addScenarioType(data: Omit<IScenarioType, 'id'>): Promise<string> {
        try {
            const id = `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await db.scenarioTypes.add({ ...data, id });
            return id;
        } catch (error) {
            console.error('Failed to add scenario type: ', error);
            throw error;
        }
    },

    async updateScenarioType(id: string, updates: Partial<Omit<IScenarioType, 'id'>>): Promise<void> {
        try {
            await db.scenarioTypes.update(id, updates);
        } catch (error) {
            console.error('Failed to update scenario type: ', error);
            throw error;
        }
    },

    async deleteScenarioType(id: string): Promise<void> {
        if (id === 'custom') return;
        try {
            await db.transaction('rw', [db.scenarioTypes, db.packingPlans], async () => {
                // Reassign any plans using this scenario type to 'custom' (default)
                await db.packingPlans.where('scenarioType').equals(id).modify({ scenarioType: 'custom' });
                await db.scenarioTypes.delete(id);
            });
        } catch (error) {
            console.error('Failed to delete scenario type: ', error);
            throw error;
        }
    },

    async getPackingPlanCountForScenario(scenarioId: string): Promise<number> {
        try {
            return await db.packingPlans.where('scenarioType').equals(scenarioId).count();
        } catch (error) {
            console.error('Failed to count packing plans for scenario: ', error);
            return 0;
        }
    },
};
