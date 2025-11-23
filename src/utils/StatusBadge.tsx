import styled from 'styled-components';
import type { DamageLevelType } from '../db/items';
import DamageLevelTranslation from './damageLevels';

export const DamageLevelStyles = {
    none: {
        color: 'var(--color-success)',
        colorBg: 'rgba(var(--color-success-rgb), .05)',
    },
    minor: {
        color: 'var(--color-warning)',
        colorBg: 'rgba(var(--color-warning-rgb), .05)',
    },
    major: {
        color: 'var(--color-danger)',
        colorBg: 'rgba(var(--color-danger-rgb), .05)',
    },
    total: {
        color: 'var(--color-forbidden)',
        colorBg: 'rgba(var(--color-forbidden-rgb), .05)',
    },
};

const StatusBadge = (props: { damageLevelType: DamageLevelType }) => {
    const { damageLevelType } = props;

    const damageStyle = DamageLevelStyles[damageLevelType];

    return (
        <StatusBadgeWrapper $color={damageStyle.color} $bgColor={damageStyle.colorBg}>
            {DamageLevelTranslation[damageLevelType] ?? '-'}
        </StatusBadgeWrapper>
    );
};

const StatusBadgeWrapper = styled.div<{ $color: string; $bgColor: string }>`
    border-radius: 6px;
    border: 1px solid ${(p) => p.$color};
    color: ${(p) => p.$color};
    background-color: ${(p) => p.$bgColor};
    padding: 4px 8px;
`;

export default StatusBadge;
