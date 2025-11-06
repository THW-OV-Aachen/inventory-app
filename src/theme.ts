// Theme configuration for the entire application
export const theme = {
    colors: {
        primary: '#0D324D',
        primaryLight: '#1a4a6f',
        primaryDark: '#091f31',
        background: '#89BBFE',
        backgroundLight: '#a8cffe',
        backgroundDark: '#6aa8f8',
        text: '#333333',
        textLight: '#666666',
        textMuted: '#999999',
        surface: '#ffffff',
        surfaceAlt: '#f8f9fa',
        border: '#e0e0e0',
        borderLight: '#f0f0f0',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        errorLight: '#ffebee',
        errorDark: '#c62828',
    },
    gradients: {
        primary: 'linear-gradient(135deg, #0D324D 0%, #1a4a6f 100%)',
        background: 'linear-gradient(135deg, #89BBFE 0%, #6aa8f8 100%)',
    },
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
        md: '0 2px 8px rgba(0, 0, 0, 0.1)',
        lg: '0 4px 12px rgba(0, 0, 0, 0.15)',
        xl: '0 6px 16px rgba(0, 0, 0, 0.2)',
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
    },
    transitions: {
        fast: '0.15s ease',
        normal: '0.3s ease',
        slow: '0.5s ease',
    },
};

export type Theme = typeof theme;

