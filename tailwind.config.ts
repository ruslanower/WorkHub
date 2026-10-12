import type { Config } from 'tailwindcss';

/**
 * Design tokens are defined once as CSS variables in src/index.css
 * (light + dark). Tailwind only maps semantic names to those variables.
 */
const withAlpha = (v: string) => `hsl(var(${v}) / <alpha-value>)`;

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      colors: {
        border: withAlpha('--border'),
        input: withAlpha('--input'),
        ring: withAlpha('--ring'),
        background: withAlpha('--background'),
        foreground: withAlpha('--foreground'),
        surface: withAlpha('--surface'),
        primary: { DEFAULT: withAlpha('--primary'), foreground: withAlpha('--primary-foreground'), soft: withAlpha('--primary-soft') },
        secondary: { DEFAULT: withAlpha('--secondary'), foreground: withAlpha('--secondary-foreground') },
        muted: { DEFAULT: withAlpha('--muted'), foreground: withAlpha('--muted-foreground') },
        accent: { DEFAULT: withAlpha('--accent'), foreground: withAlpha('--accent-foreground') },
        verify: { DEFAULT: withAlpha('--verify'), foreground: withAlpha('--verify-foreground'), soft: withAlpha('--verify-soft') },
        warning: { DEFAULT: withAlpha('--warning'), foreground: withAlpha('--warning-foreground'), soft: withAlpha('--warning-soft') },
        danger: { DEFAULT: withAlpha('--danger'), foreground: withAlpha('--danger-foreground'), soft: withAlpha('--danger-soft') },
        success: { DEFAULT: withAlpha('--success'), foreground: withAlpha('--success-foreground'), soft: withAlpha('--success-soft') },
        card: { DEFAULT: withAlpha('--card'), foreground: withAlpha('--card-foreground') },
        popover: { DEFAULT: withAlpha('--popover'), foreground: withAlpha('--popover-foreground') },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
      boxShadow: {
        soft: '0 1px 2px hsl(var(--shadow) / 0.06), 0 4px 16px hsl(var(--shadow) / 0.06)',
        lifted: '0 2px 4px hsl(var(--shadow) / 0.08), 0 12px 32px hsl(var(--shadow) / 0.12)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out',
        'slide-up': 'slide-up 220ms ease-out',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
