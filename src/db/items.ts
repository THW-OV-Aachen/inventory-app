
import * as yup from 'yup';
import type { ILabel } from './labels';

export const DamageLevelType = {
    NONE: 'none',
    MINOR: 'minor',
    MAJOR: 'major',
    TOTAL: 'total',
} as const;


export type DamageLevelType = (typeof DamageLevelType)[keyof typeof DamageLevelType];

export interface IItem {
    id: number;
    itemId: string;
    inventoryNumber?: string;
    deviceNumber?: string;
    name: string;
    isSet: boolean;
    art: string;
    amountTarget: number;
    amountActual: number;
    availability: number;
    damageLevel: DamageLevelType;
    lastInspection?: string; //change to moment.js Date,
    inspectionIntervalMonths?: number;
    location: string;
    level: number;
    remark?: string;
    labels?: ILabel[];
}

export const ItemValidationSchema = yup.object().shape({
    itemId: yup.string().required('Sachnummer ist erforderlich.'),
    name: yup.string().required('Name ist erforderlich.'),
    inventoryNumber: yup.string().nullable().optional(),
    deviceNumber: yup.string().nullable().optional(),
    location: yup.string().nullable().optional(),
    remark: yup.string().nullable().optional(),
    amountTarget: yup.number().nullable().optional().min(0, 'Zielmenge darf nicht negativ sein.'),
    amountActual: yup.number().nullable().optional().min(0, 'Istmenge darf nicht negativ sein.'),
    availability: yup
        .number()
        .nullable()
        .optional()
        .min(0, 'Verfügbarkeit darf nicht negativ sein.')
        .when('amountActual', {
            is: (val: any) => typeof val === 'number',
            then: (schema) =>
                schema.max(yup.ref('amountActual') as any, 'Verfügbarkeit darf nicht größer als Istmenge sein.'),
        }),
    level: yup.number().nullable().optional(),
    inspectionIntervalMonths: yup.number().nullable().optional().min(0, 'Inspektionsinterval darf nicht negativ sein.'),
    isSet: yup.boolean().nullable(),
    damageLevel: yup.string().nullable(),
    lastInspection: yup.string().nullable(),
});
