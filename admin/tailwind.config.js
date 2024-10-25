const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        "bg-default": "var(--bg-default)",
        "bg-base": "var(--bg-base)",
        "bg-bg-subtle": "var(--bg-bg-subtle)",
        "bg-bg": "var(--bg-bg)",
        "bg-bg-hover": "var(--bg-bg-hover)",
        "bg-bg-active": "var(--bg-bg-active)",
        "fg-line": "var(--fg-line)",
        "fg-border": "var(--fg-border)",
        "fg-border-hover": "var(--fg-border-hover)",
        "fg-solid": "var(--fg-solid)",
        "fg-solid-hover": "var(--fg-solid-hover)",
        "fg-text": "var(--fg-text)",
        "fg-text-contrast": "var(--fg-text-contrast)",
        "fg-default": "var(--fg-default)",
      
      
        "primary-base": "var(--primary-base)",
        "primary-bg-subtle": "var(--primary-bg-subtle)",
        "primary-bg": "var(--primary-bg)",
        "primary-bg-hover": "var(--primary-bg-hover)",
        "primary-bg-active": "var(--primary-bg-active)",
        "primary-line": "var(--primary-line)",
        "primary-border": "var(--primary-border)",
        "primary-border-hover": "var(--primary-border-hover)",
        "primary-solid": "var(--primary-solid)",
        "primary-solid-hover": "var(--primary-solid-hover)",
        "primary-text": "var(--primary-text)",
        "primary-text-contrast": "var(--primary-text-contrast)",
      
      
        "secondary-base": "var(--secondary-base)",
        "secondary-bg-subtle": "var(--secondary-bg-subtle)",
        "secondary-bg": "var(--secondary-bg)",
        "secondary-bg-hover": "var(--secondary-bg-hover)",
        "secondary-bg-active": "var(--secondary-bg-active)",
        "secondary-line": "var(--secondary-line)",
        "secondary-border": "var(--secondary-border)",
        "secondary-border-hover": "var(--secondary-border-hover)",
        "secondary-solid": "var(--secondary-solid)",
        "secondary-solid-hover": "var(--secondary-solid-hover)",
        "secondary-text": "var(--secondary-text)",
        "secondary-text-contrast": "var(--secondary-text-contrast)",
      
      
        "success-base": "var(--success-base)",
        "success-bg-subtle": "var(--success-bg-subtle)",
        "success-bg": "var(--success-bg)",
        "success-bg-hover": "var(--success-bg-hover)",
        "success-bg-active": "var(--success-bg-active)",
        "success-line": "var(--success-line)",
        "success-border": "var(--success-border)",
        "success-border-hover": "var(--success-border-hover)",
        "success-solid": "var(--success-solid)",
        "success-solid-hover": "var(--success-solid-hover)",
        "success-text": "var(--success-text)",
        "success-text-contrast": "var(--success-text-contrast)",
      
      
        "warning-base": "var(--warning-base)",
        "warning-bg-subtle": "var(--warning-bg-subtle)",
        "warning-bg": "var(--warning-bg)",
        "warning-bg-hover": "var(--warning-bg-hover)",
        "warning-bg-active": "var(--warning-bg-active)",
        "warning-line": "var(--warning-line)",
        "warning-border": "var(--warning-border)",
        "warning-border-hover": "var(--warning-border-hover)",
        "warning-solid": "var(--warning-solid)",
        "warning-solid-hover": "var(--warning-solid-hover)",
        "warning-text": "var(--warning-text)",
        "warning-text-contrast": "var(--warning-text-contrast)",
      
      
        "alert-base": "var(--alert-base)",
        "alert-bg-subtle": "var(--alert-bg-subtle)",
        "alert-bg": "var(--alert-bg)",
        "alert-bg-hover": "var(--alert-bg-hover)",
        "alert-bg-active": "var(--alert-bg-active)",
        "alert-line": "var(--alert-line)",
        "alert-border": "var(--alert-border)",
        "alert-border-hover": "var(--alert-border-hover)",
        "alert-solid": "var(--alert-solid)",
        "alert-solid-hover": "var(--alert-solid-hover)",
        "alert-text": "var(--alert-text)",
        "alert-text-contrast": "var(--alert-text-contrast)",
      
      
        "info-base": "var(--info-base)",
        "info-bg-subtle": "var(--info-bg-subtle)",
        "info-bg": "var(--info-bg)",
        "info-bg-hover": "var(--info-bg-hover)",
        "info-bg-active": "var(--info-bg-active)",
        "info-line": "var(--info-line)",
        "info-border": "var(--info-border)",
        "info-border-hover": "var(--info-border-hover)",
        "info-solid": "var(--info-solid)",
        "info-solid-hover": "var(--info-solid-hover)",
        "info-text": "var(--info-text)",
        "info-text-contrast": "var(--info-text-contrast)",
      
      
        "overlay-base": "var(--overlay-base)",
        "overlay-bg-subtle": "var(--overlay-bg-subtle)",
        "overlay-bg": "var(--overlay-bg)",
        "overlay-bg-hover": "var(--overlay-bg-hover)",
        "overlay-bg-active": "var(--overlay-bg-active)",
        "overlay-line": "var(--overlay-line)",
        "overlay-border": "var(--overlay-border)",
        "overlay-border-hover": "var(--overlay-border-hover)",
        "overlay-solid": "var(--overlay-solid)",
        "overlay-solid-hover": "var(--overlay-solid-hover)",
        "overlay-text": "var(--overlay-text)",
        "overlay-text-contrast": "var(--overlay-text-contrast)",
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
