import styled, { keyframes, css } from 'styled-components';
import { theme } from '../theme';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

// Liquid shimmer animation
const shimmer = keyframes`
    0% {
        transform: translateX(-100%) rotate(45deg);
    }
    100% {
        transform: translateX(200%) rotate(45deg);
    }
`;

// Subtle floating animation
const float = keyframes`
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-2px);
    }
`;

// Gradient shift animation
const gradientShift = keyframes`
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
`;

const getPadding = (size: string) => {
    switch (size) {
        case 'sm':
            return '10px 20px';
        case 'lg':
            return '16px 36px';
        default:
            return '13px 28px';
    }
};

const getBorderRadius = (size: string) => {
    switch (size) {
        case 'sm':
            return '12px';
        case 'lg':
            return '18px';
        default:
            return '15px';
    }
};

const getFontSize = (size: string) => {
    switch (size) {
        case 'sm':
            return '13px';
        case 'lg':
            return '17px';
        default:
            return '15px';
    }
};

const primaryStyles = css`
    /* Liquid glass base with gradient */
    background: linear-gradient(
        135deg,
        rgba(13, 50, 77, 0.95) 0%,
        rgba(26, 74, 111, 0.9) 50%,
        rgba(13, 50, 77, 0.95) 100%
    );
    background-size: 200% 200%;
    animation: ${float} 6s ease-in-out infinite, ${gradientShift} 8s ease infinite;
    
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    
    /* Multi-layered glass effect borders */
    border: 1px solid rgba(255, 255, 255, 0.18);
    
    /* Stunning multi-layer shadow with glow */
    box-shadow: 
        /* Inner highlight */
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1),
        /* Soft depth shadow */
        0 2px 8px rgba(0, 0, 0, 0.15),
        0 4px 16px rgba(13, 50, 77, 0.3),
        /* Ambient glow */
        0 8px 32px rgba(137, 187, 254, 0.25),
        /* Extended glow */
        0 12px 48px rgba(137, 187, 254, 0.15);

    /* Frosted glass overlay */
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.12) 100%
        );
        background-size: 200% 200%;
        animation: ${gradientShift} 6s ease infinite;
        pointer-events: none;
        z-index: 1;
    }

    /* Shimmer effect */
    &::after {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(
            110deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 60%,
            transparent 100%
        );
        transform: translateX(-100%) rotate(45deg);
        pointer-events: none;
        z-index: 2;
        border-radius: inherit;
    }

    /* Content wrapper with proper alignment */
    & > span {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    /* Hover state - Elevated liquid glass */
    &:hover:not(:disabled) {
        transform: translateY(-4px) scale(1.02);
        animation: ${float} 6s ease-in-out infinite;
        
        background: linear-gradient(
            135deg,
            rgba(26, 74, 111, 0.98) 0%,
            rgba(40, 90, 130, 0.95) 50%,
            rgba(26, 74, 111, 0.98) 100%
        );
        background-size: 200% 200%;
        
        box-shadow: 
            /* Enhanced inner highlight */
            inset 0 2px 0 rgba(255, 255, 255, 0.25),
            inset 0 -1px 0 rgba(0, 0, 0, 0.15),
            /* Elevated depth */
            0 4px 12px rgba(0, 0, 0, 0.2),
            0 8px 24px rgba(13, 50, 77, 0.4),
            /* Intensified glow */
            0 12px 48px rgba(137, 187, 254, 0.45),
            0 20px 80px rgba(137, 187, 254, 0.3),
            /* Magical aura */
            0 0 60px rgba(137, 187, 254, 0.4);
        
        border-color: rgba(255, 255, 255, 0.3);
    }

    /* Shimmer on hover */
    &:hover:not(:disabled)::after {
        animation: ${shimmer} 1.5s ease-in-out infinite;
    }

    /* Active state - Pressed liquid glass */
    &:active:not(:disabled) {
        transform: translateY(-1px) scale(0.98);
        transition: all 0.1s cubic-bezier(0.4, 0, 0.6, 1);
        
        box-shadow: 
            inset 0 2px 8px rgba(0, 0, 0, 0.25),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.15),
            0 4px 16px rgba(13, 50, 77, 0.3),
            0 0 40px rgba(137, 187, 254, 0.3);
    }

    /* Focus state for accessibility */
    &:focus-visible {
        outline: none;
        box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
            0 4px 16px rgba(13, 50, 77, 0.4),
            0 0 0 3px rgba(137, 187, 254, 0.5),
            0 0 60px rgba(137, 187, 254, 0.4);
    }
`;

const secondaryStyles = css`
    /* Frosted glass secondary */
    background: linear-gradient(
        135deg,
        rgba(248, 249, 250, 0.9) 0%,
        rgba(255, 255, 255, 0.85) 50%,
        rgba(248, 249, 250, 0.9) 100%
    );
    background-size: 200% 200%;
    animation: ${float} 6s ease-in-out infinite, ${gradientShift} 10s ease infinite;
    
    color: ${theme.colors.primary};
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
    
    border: 1.5px solid rgba(13, 50, 77, 0.2);
    
    box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.5),
        inset 0 -1px 0 rgba(13, 50, 77, 0.05),
        0 2px 8px rgba(13, 50, 77, 0.1),
        0 4px 16px rgba(13, 50, 77, 0.08),
        0 8px 32px rgba(137, 187, 254, 0.15);

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(
            135deg,
            rgba(137, 187, 254, 0.1) 0%,
            rgba(137, 187, 254, 0.05) 50%,
            rgba(137, 187, 254, 0.1) 100%
        );
        background-size: 200% 200%;
        animation: ${gradientShift} 8s ease infinite;
        pointer-events: none;
    }

    &::after {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(
            110deg,
            transparent 0%,
            transparent 40%,
            rgba(137, 187, 254, 0.3) 50%,
            transparent 60%,
            transparent 100%
        );
        transform: translateX(-100%) rotate(45deg);
        pointer-events: none;
        border-radius: inherit;
    }

    /* Content wrapper with proper alignment */
    & > span {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    &:hover:not(:disabled) {
        transform: translateY(-4px) scale(1.02);
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 249, 250, 0.9) 50%,
            rgba(255, 255, 255, 0.95) 100%
        );
        
        border-color: rgba(13, 50, 77, 0.35);
        
        box-shadow: 
            inset 0 2px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(13, 50, 77, 0.08),
            0 4px 12px rgba(13, 50, 77, 0.15),
            0 8px 24px rgba(13, 50, 77, 0.12),
            0 12px 48px rgba(137, 187, 254, 0.25),
            0 0 40px rgba(137, 187, 254, 0.2);
    }

    &:hover:not(:disabled)::after {
        animation: ${shimmer} 1.8s ease-in-out infinite;
    }

    &:active:not(:disabled) {
        transform: translateY(-1px) scale(0.98);
        box-shadow: 
            inset 0 2px 6px rgba(13, 50, 77, 0.15),
            0 2px 8px rgba(13, 50, 77, 0.1),
            0 0 30px rgba(137, 187, 254, 0.15);
    }

    &:focus-visible {
        outline: none;
        box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            0 4px 16px rgba(13, 50, 77, 0.12),
            0 0 0 3px rgba(137, 187, 254, 0.4),
            0 0 40px rgba(137, 187, 254, 0.3);
    }
`;

const dangerStyles = css`
    /* Liquid glass danger variant */
    background: linear-gradient(
        135deg,
        rgba(244, 67, 54, 0.95) 0%,
        rgba(255, 87, 74, 0.9) 50%,
        rgba(244, 67, 54, 0.95) 100%
    );
    background-size: 200% 200%;
    animation: ${float} 6s ease-in-out infinite, ${gradientShift} 8s ease infinite;
    
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    
    border: 1px solid rgba(255, 255, 255, 0.18);
    
    box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.15),
        0 4px 16px rgba(244, 67, 54, 0.3),
        0 8px 32px rgba(244, 67, 54, 0.25),
        0 12px 48px rgba(244, 67, 54, 0.15);

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.12) 100%
        );
        background-size: 200% 200%;
        animation: ${gradientShift} 6s ease infinite;
        pointer-events: none;
    }

    &::after {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(
            110deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 60%,
            transparent 100%
        );
        transform: translateX(-100%) rotate(45deg);
        pointer-events: none;
        border-radius: inherit;
    }

    /* Content wrapper with proper alignment */
    & > span {
        position: relative;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    &:hover:not(:disabled) {
        transform: translateY(-4px) scale(1.02);
        
        background: linear-gradient(
            135deg,
            rgba(255, 87, 74, 0.98) 0%,
            rgba(255, 107, 94, 0.95) 50%,
            rgba(255, 87, 74, 0.98) 100%
        );
        
        box-shadow: 
            inset 0 2px 0 rgba(255, 255, 255, 0.25),
            inset 0 -1px 0 rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(0, 0, 0, 0.2),
            0 8px 24px rgba(244, 67, 54, 0.4),
            0 12px 48px rgba(244, 67, 54, 0.45),
            0 20px 80px rgba(244, 67, 54, 0.3),
            0 0 60px rgba(244, 67, 54, 0.4);
        
        border-color: rgba(255, 255, 255, 0.3);
    }

    &:hover:not(:disabled)::after {
        animation: ${shimmer} 1.5s ease-in-out infinite;
    }

    &:active:not(:disabled) {
        transform: translateY(-1px) scale(0.98);
        box-shadow: 
            inset 0 2px 8px rgba(0, 0, 0, 0.25),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.15),
            0 4px 16px rgba(244, 67, 54, 0.3),
            0 0 40px rgba(244, 67, 54, 0.3);
    }

    &:focus-visible {
        outline: none;
        box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 4px 16px rgba(244, 67, 54, 0.4),
            0 0 0 3px rgba(244, 67, 54, 0.5),
            0 0 60px rgba(244, 67, 54, 0.4);
    }
`;

const BaseButton = styled.button<{ variant: string; size: string }>`
    position: relative;
    padding: ${(props) => getPadding(props.size)};
    border: none;
    border-radius: ${(props) => getBorderRadius(props.size)};
    font-size: ${(props) => getFontSize(props.size)};
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
    overflow: hidden;
    isolation: isolate;
    
    /* Smooth transitions */
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Subtle float animation */
    animation: ${float} 6s ease-in-out infinite;

    ${(props) => {
        switch (props.variant) {
            case 'primary':
                return primaryStyles;
            case 'secondary':
                return secondaryStyles;
            case 'danger':
                return dangerStyles;
            default:
                return '';
        }
    }}

    /* Disabled state - Frosted and muted */
    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none !important;
        animation: none !important;
        filter: grayscale(0.5);
        
        &::before,
        &::after {
            display: none;
        }
    }
`;

export const Button = ({
    variant = 'primary',
    size = 'md',
    disabled = false,
    children,
    onClick,
    type = 'button',
}: ButtonProps) => {
    return (
        <BaseButton
            variant={variant}
            size={size}
            disabled={disabled}
            onClick={onClick}
            type={type}
        >
            <span>{children}</span>
        </BaseButton>
    );
};

export default Button;
