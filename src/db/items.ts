export const DamageLevelType = {
    NONE: 'none',
    MINOR: 'minor',
    MAJOR: 'major',
    TOTAL: 'total',
} as const;

export type DamageLevelType = (typeof DamageLevelType)[keyof typeof DamageLevelType];

export interface ItemDb {
    id?: number;

    name?: string;
    isSet: boolean;
    remark?: string;

    availability: boolean;

    damageLevel: DamageLevelType;
    lastInspection?: string; //change to moment.js Date,
    inspectionIntervalDays?: number;

    location?: string;

    itemNumber: string;
    inventoryNumber?: string;
    deviceNumber?: string;
}

export interface ItemGroupDb {
    id?: number;
    amountTarget: number;
    amountActual: number;
    itemNumber: string;
    remark: string;
}
