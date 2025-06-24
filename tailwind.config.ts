
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
        sans: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Poppins', 'Inter', 'sans-serif'],
        headline: ['Poppins', 'Inter', 'sans-serif'], 
        code: ['monospace', 'monospace'],
        handwriting: ['Kalam', 'cursive'],
        'handwriting-caveat': ['Caveat', 'cursive'],
        'handwriting-dancing': ['Dancing Script', 'cursive'],
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
        success: { // Added success color definition
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
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
          DEFAULT: "hsl(var(--card))", // Will use the HSL with alpha
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
        // Removed old login page specific colors as they are now covered by the theme
      },
      boxShadow: {
        // Updated glow effects based on new palette
        'glow-accent-pink': '0 0 12px 2px hsla(var(--accent), 0.55), 0 0 20px 5px hsla(var(--accent), 0.35)', // #FF2E63 (Accent Pink)
        'glow-ai-blue': '0 0 12px 2px hsla(var(--primary), 0.55), 0 0 20px 5px hsla(var(--primary), 0.35)', // #00E6B0 (Glow Blue AI / Primary)
        'logo-glow': '0 0 20px 5px hsla(var(--primary), 0.3)', // Using new primary for logo glow
        'glow-success-green': '0 0 12px 2px hsla(var(--success), 0.55), 0 0 20px 5px hsla(var(--success), 0.35)', // #00FF94
        'glow-warning-yellow': '0 0 12px 2px hsla(var(--destructive), 0.55), 0 0 20px 5px hsla(var(--destructive), 0.35)', // #FFB300
         // Glows for Parent Dashboard (Partner Theme which uses Glow Blue as Primary)
        'glow-aqua-soft': '0 0 15px 2px hsla(var(--primary), 0.3)', // Glow Blue from Partner Theme
        'glow-yellow-soft': '0 0 15px 2px hsla(var(--destructive), 0.3)', // Warning Yellow
        'glow-purple-soft': '0 0 15px 2px hsla(270, 70%, 60%, 0.3)', // A generic purple
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
        "brain-heatmap-pulse": { // Can be adapted to use --primary or --accent for its glow
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
