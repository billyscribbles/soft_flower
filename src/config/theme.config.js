// Single source of truth for design tokens.
// Swap a brand's look by editing this file — applyTheme.js writes these
// onto :root as CSS custom properties at app boot.

export const theme = {
  colors: {
    bg: '#FFFDF9',
    'bg-alt': '#FDF4F8',
    'bg-card': '#FFFFFF',
    text: '#1B1130',
    'text-soft': '#4A3B63',
    muted: '#6B5E80',
    accent: '#D63384',
    'accent-dark': '#A8246A',
    'accent-light': '#FFE3F1',
    'accent-glow': 'rgba(214, 51, 132, 0.28)',
    secondary: '#7B3FB5',
    'secondary-dark': '#5A2A8C',
    'secondary-light': '#EFE1FA',
    'secondary-glow': 'rgba(123, 63, 181, 0.26)',
    tertiary: '#F4C842',
    'tertiary-dark': '#8A6B12',
    'tertiary-light': '#FFF6CC',
    'tertiary-glow': 'rgba(244, 200, 66, 0.32)',
    border: 'rgba(123, 70, 160, 0.14)',
    'border-strong': 'rgba(123, 70, 160, 0.28)',
    dark: '#2A1A3D',
  },
  fonts: {
    display: "'Fraunces', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
  },
  radii: {
    sm: '10px',
    md: '18px',
    lg: '28px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(123, 63, 181, 0.08), 0 1px 2px rgba(214, 51, 132, 0.06)',
    md: '0 6px 24px rgba(214, 51, 132, 0.10), 0 2px 8px rgba(123, 63, 181, 0.06)',
    lg: '0 20px 60px rgba(214, 51, 132, 0.14), 0 6px 18px rgba(123, 63, 181, 0.08)',
    accent: '0 12px 40px rgba(214, 51, 132, 0.30)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '220ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
}
