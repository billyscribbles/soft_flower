// Single source of truth for design tokens.
// Swap a brand's look by editing this file — applyTheme.js writes these
// onto :root as CSS custom properties at app boot.

export const theme = {
  colors: {
    bg: '#FFFFFF',
    'bg-alt': '#FAF7F4',
    'bg-card': '#FFFFFF',
    text: '#1A1A1A',
    'text-soft': '#5A5A5A',
    muted: '#8A8A8A',
    accent: '#F9DEE5',
    'accent-dark': '#D67F8C',
    'accent-light': '#FDF1F4',
    'accent-glow': 'rgba(249, 222, 229, 0.40)',
    border: 'rgba(0, 0, 0, 0.08)',
    'border-strong': 'rgba(0, 0, 0, 0.16)',
    dark: '#1A1A1A',
    'badge-bg': '#1A1A1A',
    'badge-text': '#FFFFFF',
  },
  fonts: {
    display: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 16px rgba(0, 0, 0, 0.06)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.08)',
    accent: '0 8px 24px rgba(237, 166, 175, 0.20)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '220ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
}
