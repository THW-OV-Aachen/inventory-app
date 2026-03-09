export function addMonths(date: Date, months: number): Date {
    const d = new Date(date.getTime());
    const day = d.getDate();

    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    const daysInTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, daysInTargetMonth));
    return d;
}

export function calculateNextInspectionDate(
    lastInspection: string | undefined,
    inspectionIntervalMonths: number | undefined
): Date | null {
    if (!lastInspection || !inspectionIntervalMonths) {
        return null;
    }
    return addMonths(new Date(lastInspection), inspectionIntervalMonths);
}

/**
 * Checks if a given date is in the past or is today (ignoring the time of day).
 */
export function isDatePastOrToday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateOnly = new Date(date.getTime());
    dateOnly.setHours(0, 0, 0, 0);

    return dateOnly.getTime() <= today.getTime();
}

/**
 * Common formatting function for dates (e.g. DD.MM.YYYY)
 */
export function formatDate(date: Date): string {
    return Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}
