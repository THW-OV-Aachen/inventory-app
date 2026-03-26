export interface IScenarioType {
    id: string;
    name: string;
    icon: string;
}

export type EmergencyScenarioType = string; // Legacy alias for backward compatibility during migration

// Packing plan (emergency scenario template)
export interface IPackingPlan {
    id: string;
    name: string; // e.g., "Hochwasser" (Flood)
    scenarioType: EmergencyScenarioType;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

// Items in a packing plan
export interface IPackingPlanItem {
    id: string;
    packingPlanId: string;
    Iid: number; // Reference to IItem
    requiredQuantity: number; // How many are needed for this scenario
    notes?: string; // Optional notes about why this item is needed
    order: number; // Display order
}
