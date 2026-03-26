import {
    Droplets, Flame, Activity, LifeBuoy,
    Zap, AlertTriangle, Siren, Package,
    type LucideIcon,
    BriefcaseMedical,
    Wrench
} from 'lucide-react';

// edit for different scenario icons
export const SCENARIO_ICONS: Record<string, LucideIcon> = {
    Droplets,
    Flame,
    Zap,
    Activity,
    //ShieldHalf,
    //Waves,
    Wrench,
    BriefcaseMedical,
    LifeBuoy,
    AlertTriangle,
    Siren,
    Package
};

export const getIconComponent = (iconName: string): LucideIcon => {
    return SCENARIO_ICONS[iconName] || Package;
};
