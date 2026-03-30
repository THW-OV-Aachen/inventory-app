import ExcelJS from 'exceljs';
import { type IItem, DamageLevelType } from '../items';
import { db } from '../db';
import { inventoryApi, labelsApi } from '../../app/api';
import { packingPlanApi } from '../../app/packingPlanApi';
import type { IPackingPlan, IPackingPlanItem, IScenarioType } from '../packingPlans';
import DamageLevelTranslation from '../../utils/damageLevels';
import type { ILabel } from '../labels';
interface ColumnDefinition {
    header: string;
    key: keyof IItem | 'oe';
    defaultValue?: any;
    required: boolean;
    // Function to convert IItem value to Excel Cell value
    exportTransform?: (value: any, item: IItem) => ExcelJS.CellValue;
    // Function to convert Excel Cell value to IItem value
    importTransform?: (value: ExcelJS.CellValue) => any;
}

const getDamageKeyFromTranslation = (val: string): DamageLevelType => {
    const entry = Object.entries(DamageLevelTranslation).find(([, v]) => v === val);
    return (entry ? entry[0] : 'none') as DamageLevelType;
};

interface ScenarioTypeColumnDefinition {
    header: string;
    key: keyof IScenarioType;
    required: boolean;
    exportTransform?: (value: any, type: IScenarioType) => ExcelJS.CellValue;
    importTransform?: (value: ExcelJS.CellValue) => any;
}

const SCENARIO_TYPE_EXCEL_COLUMNS: ScenarioTypeColumnDefinition[] = [
    { header: 'ID', key: 'id', required: true, importTransform: (v) => v?.toString()?.trim() },
    { header: 'Name', key: 'name', required: true, importTransform: (v) => v?.toString()?.trim() },
    { header: 'Symbol', key: 'icon', required: true, importTransform: (v) => v?.toString()?.trim() },
];

const EXCEL_COLUMNS: ColumnDefinition[] = [
    {
        header: 'Datenbank-ID',
        key: 'id',
        required: false,
        importTransform: (v) => (v ? parseInt(v.toString(), 10) : undefined),
    },
    {
        header: 'Ebene',
        key: 'level',
        required: false,
        importTransform: (v) => (v ? parseInt(v.toString()) : undefined),
    },
    {
        header: 'OE',
        key: 'oe',
        required: false,
        exportTransform: () => 'AC1N',
        importTransform: () => undefined,
        defaultValue: 'AC1N',
    },
    {
        header: 'Art',
        key: 'art',
        required: false,
        exportTransform: (v, item) => {
            if (v && v.trim()) return v.trim();
            if (item.isSet === true) return 'Satz';
            if (item.isSet === false) return 'Teil';
            return '';
        },
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
    {
        header: 'Menge',
        key: 'amountTarget',
        required: false,
        exportTransform: (v) => v ?? 0,
        importTransform: (v) => {
            if (v == null) {
                return 0;
            }
            const parsed = parseInt(v.toString(), 10);
            return isNaN(parsed) ? 0 : parsed;
        },
        defaultValue: 0,
    },
    {
        header: 'Menge Ist',
        key: 'amountActual',
        required: false,
        exportTransform: (v) => v ?? 0,
        importTransform: (v) => {
            if (v == null) {
                return 0;
            }
            const parsed = parseInt(v.toString(), 10);
            return isNaN(parsed) ? 0 : parsed;
        },
        defaultValue: 0,
    },
    {
        header: 'Ort',
        key: 'location',
        required: false,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Verfügbar',
        key: 'availability',
        required: false,
        exportTransform: (v) => v ?? 0,
        importTransform: (v) => {
            if (v == null) {
                return 0;
            }
            const parsed = parseInt(v.toString(), 10);
            return isNaN(parsed) ? 0 : parsed;
        },
        defaultValue: 0,
    },
    {
        header: 'Ausstattung | Hersteller | Typ',
        key: 'name',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Sachnummer',
        key: 'itemId',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Inventar Nr',
        key: 'inventoryNumber',
        required: false,
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
    {
        header: 'Gerätenr.',
        key: 'deviceNumber',
        required: false,
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
    {
        header: 'Schadenszustand',
        key: 'damageLevel',
        required: false,
        exportTransform: (v) => DamageLevelTranslation[v as DamageLevelType] ?? v ?? '',
        importTransform: (v) => (v ? getDamageKeyFromTranslation(v.toString().trim()) : 'none'),
        defaultValue: 'none',
    },
    {
        header: 'Letzte Inspektion',
        key: 'lastInspection',
        required: false,
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
    {
        header: 'Inspektionsintervall (Monate)',
        key: 'inspectionIntervalMonths',
        required: false,
        importTransform: (v) => (v ? parseInt(v.toString().trim()) : undefined),
    },
    {
        header: 'Bemerkung',
        key: 'remark',
        required: false,
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
    {
        header: 'Labels',
        key: 'labels',
        required: false,
        exportTransform: (v: ILabel[]) => (v && v.length > 0 ? v.map((l) => l.name).join(', ') : ''),
        importTransform: (v) => (v ? v.toString().trim() : undefined),
    },
];

interface LabelColumnDefinition {
    header: string;
    key: keyof ILabel;
    required: boolean;
    exportTransform?: (value: any, label: ILabel) => ExcelJS.CellValue;
    importTransform?: (value: ExcelJS.CellValue) => any;
}

const LABEL_EXCEL_COLUMNS: LabelColumnDefinition[] = [
    {
        header: 'ID',
        key: 'id',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Name',
        key: 'name',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
    {
        header: 'Farbe',
        key: 'color',
        required: true,
        importTransform: (v) => v?.toString()?.trim(),
    },
];

interface PackingPlanColumnDefinition {
    header: string;
    key: keyof IPackingPlan | 'status';
    required: boolean;
    exportTransform?: (value: any, plan: IPackingPlan) => ExcelJS.CellValue;
    importTransform?: (value: ExcelJS.CellValue) => any;
}

const PACKING_PLAN_EXCEL_COLUMNS: PackingPlanColumnDefinition[] = [
    { header: 'ID', key: 'id', required: true, importTransform: (v) => v?.toString()?.trim() },
    { header: 'Name', key: 'name', required: true, importTransform: (v) => v?.toString()?.trim() },
    {
        header: 'Szenario Typ',
        key: 'scenarioType',
        required: true,
        exportTransform: (v: string) => v, 
        importTransform: (v) => (v ? v.toString().trim() : v),
    },
    { header: 'Beschreibung', key: 'description', required: false, importTransform: (v) => v?.toString()?.trim() },
    { header: 'Erstellt am', key: 'createdAt', required: true, importTransform: (v) => v?.toString()?.trim() },
    { header: 'Aktualisiert am', key: 'updatedAt', required: true, importTransform: (v) => v?.toString()?.trim() },
];

interface PackingPlanItemColumnDefinition {
    header: string;
    key: Exclude<keyof IPackingPlanItem, 'Iid'> | 'Datenbank-ID' | 'isPacked';
    required: boolean;
    importTransform?: (value: ExcelJS.CellValue) => any;
}

const PACKING_PLAN_ITEM_EXCEL_COLUMNS: PackingPlanItemColumnDefinition[] = [
    { header: 'ID', key: 'id', required: true, importTransform: (v) => v?.toString()?.trim() },
    { header: 'Packplan ID', key: 'packingPlanId', required: true, importTransform: (v) => v?.toString()?.trim() },
    { header: 'Datenbank-ID', key: 'Datenbank-ID', required: true, importTransform: (v) => v ? parseInt(v.toString(), 10) : 0 },
    { header: 'Menge', key: 'requiredQuantity', required: true, importTransform: (v) => v ? parseInt(v.toString(), 10) : 0 },
    { header: 'Notizen', key: 'notes', required: false, importTransform: (v) => v?.toString()?.trim() },
    { header: 'Reihenfolge', key: 'order', required: true, importTransform: (v) => v ? parseInt(v.toString(), 10) : 0 },
    { header: 'Gepackt', key: 'isPacked', required: false, importTransform: (v) => v === 'Ja' },
];

export async function exportExcel(items: IItem[], labels: ILabel[] = []): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Inventory');

    const headerRow = EXCEL_COLUMNS.map((col) => col.header);
    sheet.addRow(headerRow);

    items.forEach((item) => {
        const rowValues = EXCEL_COLUMNS.map((col) => {
            if (col.key == 'oe') {
                return col.exportTransform ? col.exportTransform('', item) : '';
            }
            const rawValue = item[col.key as keyof IItem];
            return col.exportTransform ? col.exportTransform(rawValue, item) : rawValue;
        });
        sheet.addRow(rowValues);
    });

    const labelsSheet = workbook.addWorksheet('Labels');
    const labelHeaderRow = LABEL_EXCEL_COLUMNS.map((col) => col.header);
    labelsSheet.addRow(labelHeaderRow);

    labels.forEach((label) => {
        const rowValues = LABEL_EXCEL_COLUMNS.map((col) => {
            const rawValue = label[col.key];
            return col.exportTransform ? col.exportTransform(rawValue, label) : rawValue;
        });
        labelsSheet.addRow(rowValues);
    });

    const scenarioTypesSheet = workbook.addWorksheet('ScenarioTypes');
    const scenarioHeaderRow = SCENARIO_TYPE_EXCEL_COLUMNS.map((col) => col.header);
    scenarioTypesSheet.addRow(scenarioHeaderRow);
    const scenarioTypes = await packingPlanApi.getScenarioTypes();

    scenarioTypes.forEach((type) => {
        const rowValues = SCENARIO_TYPE_EXCEL_COLUMNS.map((col) => {
            const rawValue = type[col.key as keyof IScenarioType];
            return col.exportTransform ? col.exportTransform(rawValue, type) : rawValue;
        });
        scenarioTypesSheet.addRow(rowValues);
    });

    const packingPlansSheet = workbook.addWorksheet('PackingPlans');
    packingPlansSheet.addRow([...PACKING_PLAN_EXCEL_COLUMNS.map((col) => col.header), 'Status']);
    const allPackingPlans = await packingPlanApi.getAllPackingPlans();

    const packingPlanItemsSheet = workbook.addWorksheet('PackingPlanItems');
    packingPlanItemsSheet.addRow(PACKING_PLAN_ITEM_EXCEL_COLUMNS.map((col) => col.header));

    const allScenarioTypes = await packingPlanApi.getScenarioTypes();
    const scenarioTypeMap = new Map(allScenarioTypes.map((t) => [t.id, t.name]));

    for (const plan of allPackingPlans) {
        const planItems = await packingPlanApi.getPackingPlanItems(plan.id);

        const packedStorageKey = `packingPlan:${plan.id}:packedItemIds`;
        const packedItemsSet = new Set<string>();
        try {
            const raw = localStorage.getItem(packedStorageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    parsed.forEach((id: any) => {
                        if (typeof id === 'string' || typeof id === 'number') {
                            packedItemsSet.add(id.toString());
                        }
                    });
                }
            }
        } catch {}

        const totalCount = planItems.length;
        const packedCount = planItems.filter((item) => packedItemsSet.has(item.Iid.toString())).length;
        const isFullyPacked = totalCount > 0 && packedCount === totalCount;
        const isPartiallyPacked = packedCount > 0 && !isFullyPacked;

        let planStatus = 'Nicht angefangen';
        if (isFullyPacked) planStatus = 'Gepackt';
        else if (isPartiallyPacked) planStatus = 'Angefangen';

        const planRowValues = PACKING_PLAN_EXCEL_COLUMNS.map((col) => {
            if (col.key === 'status') return null;
            const rawValue = plan[col.key as keyof IPackingPlan];

            if (col.key === 'scenarioType') {
                return scenarioTypeMap.get(rawValue as string) || rawValue;
            }

            return col.exportTransform ? col.exportTransform(rawValue, plan) : rawValue;
        });

        planRowValues.push(planStatus);
        packingPlansSheet.addRow(planRowValues);

        planItems.forEach((pItem) => {
            const isPacked = packedItemsSet.has(pItem.Iid.toString());
            const rowValues = PACKING_PLAN_ITEM_EXCEL_COLUMNS.map((col) => {
                if (col.key === 'Datenbank-ID') return pItem.Iid;
                if (col.key === 'isPacked') return isPacked ? 'Ja' : 'Nein';
                return pItem[col.key as keyof IPackingPlanItem];
            });
            packingPlanItemsSheet.addRow(rowValues);
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export async function importExcel(file: File, onProgress?: (percentage: number) => void): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    // 1. Process Labels sheet if it exists
    const labelsSheet = workbook.getWorksheet('Labels');
    const existingLabelsMap = new Map<string, ILabel>();
    const labelsByNameMap = new Map<string, ILabel>();

    if (labelsSheet) {
        const labelHeaderRow = labelsSheet.getRow(1);
        const labelHeaderMap = new Map<string, number>();

        labelHeaderRow.eachCell((cell, colNumber) => {
            const headerText = (cell.value ?? '').toString().trim();
            if (headerText) {
                labelHeaderMap.set(headerText, colNumber);
            }
        });

        const idCol = labelHeaderMap.get('ID');
        const nameCol = labelHeaderMap.get('Name');
        const colorCol = labelHeaderMap.get('Farbe');

        if (idCol && nameCol && colorCol) {
            const labelsToAdd: ILabel[] = [];
            const totalLabelRows = labelsSheet.rowCount;

            for (let rowIdx = 2; rowIdx <= totalLabelRows; rowIdx++) {
                const row = labelsSheet.getRow(rowIdx);
                if (!row.hasValues) continue;

                const id = row.getCell(idCol).value?.toString().trim();
                const name = row.getCell(nameCol).value?.toString().trim();
                const color = row.getCell(colorCol).value?.toString().trim();

                if (id && name && color) {
                    const newLabel: ILabel = { id, name, color };
                    labelsToAdd.push(newLabel);
                    existingLabelsMap.set(id, newLabel);
                    labelsByNameMap.set(name, newLabel);
                }
            }

            // Upsert all labels found in the Excel to the DB
            for (const label of labelsToAdd) {
                try {
                    // Try to get first, if it doesn't exist add it. If it exists, we could update it. 
                    // But for simplicity, we just rely on addLabel which might overwrite or we just catch duplicate ID errors.
                    await labelsApi.addLabel(label);
                } catch (e) {
                   // Ignore duplicate errors if they exist
                   console.log("Label may already exist", label.id);
                }
            }
        }
    } else {
        // If there's no Labels sheet, let's load what we have from the DB to map any old items
        const dbLabels = await labelsApi.getAllLabels();
        dbLabels.forEach(l => {
            existingLabelsMap.set(l.id, l);
            labelsByNameMap.set(l.name, l);
        });
    }

    // 1.5 Process ScenarioTypes sheet
    const scenarioTypesSheet = workbook.getWorksheet('ScenarioTypes');
    const existingScenarioMap = new Map<string, IScenarioType>();
    const scenariosByNameMap = new Map<string, IScenarioType>();

    if (scenarioTypesSheet) {
        const scenarioHeaderRow = scenarioTypesSheet.getRow(1);
        const scenarioHeaderMap = new Map<string, number>();

        scenarioHeaderRow.eachCell((cell, colNumber) => {
            const text = (cell.value ?? '').toString().trim();
            if (text) scenarioHeaderMap.set(text, colNumber);
        });

        const idCol = scenarioHeaderMap.get('ID');
        const nameCol = scenarioHeaderMap.get('Name');
        const iconCol = scenarioHeaderMap.get('Symbol');

        if (idCol && nameCol && iconCol) {
            for (let rowIdx = 2; rowIdx <= scenarioTypesSheet.rowCount; rowIdx++) {
                const row = scenarioTypesSheet.getRow(rowIdx);
                if (!row.hasValues) continue;

                const id = row.getCell(idCol).value?.toString().trim();
                const name = row.getCell(nameCol).value?.toString().trim();
                const icon = row.getCell(iconCol).value?.toString().trim();

                if (id && name && icon) {
                    const newType: IScenarioType = { id, name, icon };
                    await db.scenarioTypes.put(newType);
                    existingScenarioMap.set(id, newType);
                    scenariosByNameMap.set(name, newType);
                }
            }
        }
    } else {
        const dbScenarios = await packingPlanApi.getScenarioTypes();
        dbScenarios.forEach((s: IScenarioType) => {
            existingScenarioMap.set(s.id, s);
            scenariosByNameMap.set(s.name, s);
        });
    }


    const sheet = workbook.worksheets[0];
    const headerRow = sheet.getRow(1);
    const headerMap = new Map<string, number>();

    headerRow.eachCell((cell, colNumber) => {
        const headerText = (cell.value ?? '').toString().trim();
        if (headerText) {
            headerMap.set(headerText, colNumber);
        }
    });

    const missingRequiredHeaders = EXCEL_COLUMNS.filter((col) => col.required && !headerMap.has(col.header)).map(
        (col) => col.header
    );

    if (missingRequiredHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingRequiredHeaders.join(', ')}`);
    }

    const totalRows = sheet.rowCount;

    const itemsToAdd: IItem[] = [];

    for (let rowIdx = 2; rowIdx <= totalRows; rowIdx++) {
        const row = sheet.getRow(rowIdx);

        if (onProgress) {
            onProgress(Math.floor((rowIdx / totalRows) * 100));
        }

        if (!row.hasValues) continue;

        const rowData: Partial<IItem> = {};

        for (const colDef of EXCEL_COLUMNS) {
            const colIndex = headerMap.get(colDef.header);

            if (colIndex !== undefined) {
                const cell = row.getCell(colIndex);
                const cellValue = cell.value;

                try {
                    let parsedValue = cellValue;

                    if (colDef.key === 'oe') {
                        continue;
                    }

                    if (colDef.importTransform) {
                        parsedValue = colDef.importTransform(cellValue);
                    } else if (cellValue !== null && cellValue !== undefined) {
                        parsedValue = cellValue.toString().trim();
                    }

                    if (parsedValue?.toString().match(/^( |-|–|—)+$/)) {
                        parsedValue = null;
                    }

                    if (colDef.key === 'art') {
                        if (parsedValue === 'Satz') {
                            rowData['isSet'] = true;
                        } else if (parsedValue === 'Teil') {
                            rowData['isSet'] = false;
                        } else {
                            rowData['isSet'] = undefined;
                        }
                    } else if (colDef.key === 'labels') {
                        const rawLabels = parsedValue?.toString() || '';
                        const labelIdentifiers = rawLabels.split(',').map(s => s.trim()).filter(Boolean);
                        const assignedLabels: ILabel[] = [];

                        for (const lIdOrName of labelIdentifiers) {
                            const foundLabel = existingLabelsMap.get(lIdOrName) || labelsByNameMap.get(lIdOrName);
                            if (foundLabel) {
                                assignedLabels.push(foundLabel);
                            }
                        }
                        rowData['labels'] = assignedLabels;
                        continue;
                    }

                    rowData[colDef.key as keyof IItem] = parsedValue as any;
                } catch (error) {
                    console.warn(`Error parsing column '${colDef.header}' at row ${rowIdx}`, error);
                }
            }
        }

        for (const colDef of EXCEL_COLUMNS) {
            if (colDef.key === 'oe') {
                continue;
            }

            if (rowData[colDef.key] === undefined && colDef.defaultValue !== undefined) {
                rowData[colDef.key] = colDef.defaultValue;
            }
        }

        // If availability is 0 and no specific damage status was provided or it matches 'none', we default to 'missing' (fehlt)
        if (rowData.availability === 0 && (rowData.damageLevel === 'none' || !headerMap.has('Schadenszustand'))) {
            rowData.damageLevel = 'missing';
        }  

        // If explicitly set to 'total' (zerstört) or if availability was already 0 and forced previously, we maintain the availability as 0.
        if (rowData.damageLevel === 'total') {
            rowData.availability = 0;
        }

        if (!rowData.itemId || !rowData.name) {
            console.warn(`Skipping row ${rowIdx}: Missing ID or Name`);
            continue;
        }

        itemsToAdd.push(rowData as IItem);
    }

    await inventoryApi.addItemsBulk(itemsToAdd);

    // 2. Process PackingPlans sheet
    const packingPlansSheet = workbook.getWorksheet('PackingPlans');
    if (packingPlansSheet) {
        const ppHeaderRow = packingPlansSheet.getRow(1);
        const ppHeaderMap = new Map<string, number>();
        ppHeaderRow.eachCell((cell, colNumber) => {
            const text = (cell.value ?? '').toString().trim();
            if (text) ppHeaderMap.set(text, colNumber);
        });

        const plansToAdd: IPackingPlan[] = [];
        for (let rowIdx = 2; rowIdx <= packingPlansSheet.rowCount; rowIdx++) {
            const row = packingPlansSheet.getRow(rowIdx);
            if (!row.hasValues) continue;

            const plan: any = {};
            for (const col of PACKING_PLAN_EXCEL_COLUMNS) {
                const colIdx = ppHeaderMap.get(col.header);
                if (colIdx !== undefined) {
                    const cValue = row.getCell(colIdx).value;
                    if (col.key !== 'status') {
                        plan[col.key] = col.importTransform ? col.importTransform(cValue) : cValue;
                    }
                }
            }
            if (plan.id && plan.name) {
                // If the scenarioType is a label (name), map it to the ID
                const rawScenario = plan.scenarioType?.toString() || '';
                const foundScenario = scenariosByNameMap.get(rawScenario) || existingScenarioMap.get(rawScenario);
                if (foundScenario) {
                    plan.scenarioType = foundScenario.id;
                } else {
                    // Fallback to custom if not found
                    plan.scenarioType = 'custom';
                }
                plansToAdd.push(plan);
            }
        }
        if (plansToAdd.length > 0) {
            await db.packingPlans.bulkPut(plansToAdd);
        }
    }

    // 3. Process PackingPlanItems sheet
    const packingPlanItemsSheet = workbook.getWorksheet('PackingPlanItems');
    if (packingPlanItemsSheet) {
        const ppiHeaderRow = packingPlanItemsSheet.getRow(1);
        const ppiHeaderMap = new Map<string, number>();
        ppiHeaderRow.eachCell((cell, colNumber) => {
            const text = (cell.value ?? '').toString().trim();
            if (text) ppiHeaderMap.set(text, colNumber);
        });

        const planItemsToAdd: IPackingPlanItem[] = [];
        const packedItemsByPlan = new Map<string, Set<string>>();

        for (let rowIdx = 2; rowIdx <= packingPlanItemsSheet.rowCount; rowIdx++) {
            const row = packingPlanItemsSheet.getRow(rowIdx);
            if (!row.hasValues) continue;

            const planItem: any = {};
            let isItemPacked = false;
            for (const col of PACKING_PLAN_ITEM_EXCEL_COLUMNS) {
                const colIdx = ppiHeaderMap.get(col.header);
                if (colIdx !== undefined) {
                    const cValue = row.getCell(colIdx).value;
                    const parsed = col.importTransform ? col.importTransform(cValue) : cValue;
                    if (col.key === 'isPacked') {
                        isItemPacked = parsed;
                    } else if (col.key === 'Datenbank-ID') {
                        planItem.Iid = parsed;
                    } else {
                        planItem[col.key] = parsed;
                    }
                }
            }

            if (planItem.id && planItem.packingPlanId && planItem.Iid) {
                planItemsToAdd.push(planItem as IPackingPlanItem);
                
                if (isItemPacked) {
                    if (!packedItemsByPlan.has(planItem.packingPlanId)) {
                        packedItemsByPlan.set(planItem.packingPlanId, new Set());
                    }
                    packedItemsByPlan.get(planItem.packingPlanId)!.add(planItem.Iid.toString());
                }
            }
        }
        if (planItemsToAdd.length > 0) {
            await db.packingPlanItems.bulkPut(planItemsToAdd);
        }

        for (const [planId, packedSet] of packedItemsByPlan.entries()) {
            const packedStorageKey = `packingPlan:${planId}:packedItemIds`;
            try {
                localStorage.setItem(packedStorageKey, JSON.stringify(Array.from(packedSet)));
            } catch (error) {
                console.error('Failed to save packed status to localStorage', error);
            }
        }
    }
}
