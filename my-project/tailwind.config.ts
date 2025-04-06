import type { Config } from "tailwindcss";

export default {
    darkMode: ["class", "dark"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		screens: {
  			xs: '475px'
  		},
  		colors: {
  			primary: {
  				'100': '#FFE8F0', // light pink
  				'200': '#004BFE',
  				'300': '#5982DA',
				'400': '#ff95ba', // rich darker pink
				'500': '#ffbcd3', // rich light pink
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'100': '#85A8FB', // purpblue
  				'200': '#8BC6FF', // light blue
  				'300': '#95989A', // med gray
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			third: {
  				'100': '#F7F7F7', // very light gray
  				'200': '#060934', // rich dark blue
  				'300': '#01020a',
  				'400': '#333333'
  			},
  			white: {
  				'100': '#e3e5fc',
  				'200': '#f6f6fe',
  				'300': '#f0f0f0',
				"400": "#E0E0E0",
  			},
			borderColor: {
				'100': '#dbdbdb',
			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			'plex-sans': [
  				'var(--font-roboto)'
  			]
  		},
  		fontWeight: {
  			thin: '100',
  			extralight: '200',
  			regular: '400',
  			medium: '500',
  			semibold: '600',
  			bold: '700'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'100': '2px 2px 0px 0px rgb(0, 0, 0)',
  			'200': '2px 2px 0px 2px rgb(0, 0, 0)',
  			'300': '2px 2px 0px 2px rgb(238, 43, 105)'
  		}
  	}
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")], // might need to add tailwindcss-animate
} satisfies Config;
