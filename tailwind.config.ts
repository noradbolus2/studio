
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
        sans: ['Poppins', 'Inter', 'sans-serif'], // Poppins is now primary, Inter secondary
        body: ['Poppins', 'Inter', 'sans-serif'],
        headline: ['Poppins', 'Inter', 'sans-serif'], // Poppins for headlines
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
        // Remove old login page custom colors if no longer primary
        'deep-purple': 'hsl(var(--background))', // map to new background
        'darker-purple': 'hsl(270 100% 7%)', // even darker shade of bg
        'login-orange': 'hsl(var(--accent))', // map to new accent (pink) or keep yellow if desired
        'login-aqua-mint': 'hsl(var(--primary))', // map to new primary (glow blue)
        'login-support-text': 'hsl(var(--muted-foreground))', // map to new muted-fg
        'login-orange-glow': '0 0 15px 3px hsla(var(--accent), 0.35)',
        'login-mint-glow': '0 0 15px 3px hsla(var(--primary), 0.35)',
         // Colors for Parent Dashboard (New theme is dark by default)
        'deep-space-indigo': 'hsl(var(--background))', 
        'dark-glass-card': 'hsla(0, 0%, 100%, 0.06)', // Explicitly defining for parent dashboard cards
        'glow-aqua': 'hsl(var(--primary))', 
        'glow-yellow': 'hsl(var(--destructive))', // Warning color
      },
      boxShadow: {
        'glow-accent-pink': '0 0 12px 2px hsla(var(--accent), 0.55), 0 0 20px 5px hsla(var(--accent), 0.35)', // #FF2E63
        'glow-ai-blue': '0 0 12px 2px hsla(var(--primary), 0.55), 0 0 20px 5px hsla(var(--primary), 0.35)', // #00E6B0
        'glow-orange': '0 0 15px 3px hsla(var(--accent), 0.35)', // Legacy, map to new accent glow
        'glow-mint': '0 0 15px 3px hsla(var(--primary), 0.35)', // Legacy, map to new primary glow
        'logo-glow': '0 0 20px 5px hsla(var(--primary), 0.3)',
        // Glows for Parent Dashboard
        'glow-aqua-soft': '0 0 15px 2px hsla(var(--primary), 0.3)',
        'glow-yellow-soft': '0 0 15px 2px hsla(var(--destructive), 0.3)',
        'glow-purple-soft': '0 0 15px 2px hsla(270, 70%, 60%, 0.3)', 
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
        "brain-heatmap-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px 2px hsla(var(--primary),0.4), inset 0 0 10px 0px hsla(var(--primary),0.3)" },
          "50%": { boxShadow: "0 0 20px 5px hsla(var(--primary),0.5), inset 0 0 15px 2px hsla(var(--primary),0.4)" },
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

