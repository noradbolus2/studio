
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['PT Sans', 'Poppins', 'sans-serif'], // PT Sans is now primary
        body: ['PT Sans', 'Poppins', 'sans-serif'],
        headline: ['PT Sans', 'Poppins', 'sans-serif'], // PT Sans for headlines as per PRD
        code: ['monospace', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", 
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", 
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))", 
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", 
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Custom colors for Login Page (can be removed or adapted if not used with new theme)
        'deep-purple': '#3B0A4E',
        'darker-purple': '#12002F',
        'login-orange': '#FF6D00',
        'login-aqua-mint': '#00E6B0',
        'login-support-text': '#B0B0D0',
        'login-orange-glow': 'rgba(255,109,0,0.35)',
        'login-mint-glow': 'rgba(0,230,176,0.35)',
        // Colors for Parent Dashboard (can be removed or adapted)
        'deep-space-indigo': '#12002F', // Previous theme color
        'dark-glass-card': 'hsl(var(--card) / 0.8)', // Adjusted for new theme
        'glow-aqua': 'hsl(var(--accent))', // New accent
        'glow-yellow': 'hsl(var(--accent))', // New accent
      },
      boxShadow: {
        'glow-orange': '0 0 15px 3px hsla(var(--primary), 0.35)',
        'glow-mint': '0 0 15px 3px hsla(var(--accent), 0.35)',
        'glow-orange-hover': '0 0 20px 6px hsla(var(--primary), 0.45)',
        'glow-mint-hover': '0 0 20px 6px hsla(var(--accent), 0.45)',
        'logo-glow': '0 0 20px 5px hsla(var(--primary), 0.3)',
        // Glows for Parent Dashboard
        'glow-aqua-soft': '0 0 15px 2px hsla(var(--accent), 0.3)',
        'glow-yellow-soft': '0 0 15px 2px hsla(var(--accent), 0.3)',
        'glow-purple-soft': '0 0 15px 2px hsla(265, 70%, 60%, 0.3)', 
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-subtle": { 
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".7" },
        },
        "brain-heatmap-pulse": { /* This might need adjustment with new colors */
          "0%, 100%": { boxShadow: "0 0 10px 2px hsla(var(--primary),0.3), inset 0 0 10px 0px hsla(var(--primary),0.2)" },
          "50%": { boxShadow: "0 0 20px 5px hsla(var(--primary),0.4), inset 0 0 15px 2px hsla(var(--primary),0.3)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "brain-heatmap-pulse": "brain-heatmap-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
