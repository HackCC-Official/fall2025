const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	important: true,
content: [
	"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
	"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
	"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
],
purge: ['./src/**/*.{js,ts,jsx,tsx}'], 
theme: {
		container: {
	center: true,
	},
	extend: {
		fontFamily:{
			bagel: ["var(--font-bagel)"],
			mont: ["var(--font-montserrat-alternates)"]
		},
		keyframes:{
			bob:{
				'0%': {transform: 'translateY(6px)'},
				'50%': {transform: 'translateY(-6px)'},
				'100%': {transform: 'translateY(6px)'},
			},
			sway:{
				'0%': {transform: 'translateX(12px)'},
				'50%': {transform: 'translateX(-12px)'},
				'100%': {transform: 'translateX(12px)'},
			},
			inverseSway:{
				'0%': {transform: 'translateX(-12px)'},
				'50%': {transform: 'translateX(12px)'},
				'100%': {transform: 'translateX(-12px)'},
			},
			movingSpritelg:{
				'0%': {transform: 'translateX(0px)'},
				'100%': {transform: 'translateX(-2000px)'},
			},
			movingSpritesm:{
				'0%': {transform: 'translateX(0px)'},
				'100%': {transform: 'translateX(-1500px)'},
			},
			marquee:{
				'0':{transform: 'translateX(0)'},
				'100%':{transform: 'translateX(calc(-100vw - 1200px))'}
			},
		},
		animation: {
			'bobbing': 'bob 8s linear infinite',
			'swaying': 'sway 8s linear infinite',
			'inverseswaying': 'inverseSway 8s linear infinite',
			'moveSpriteSheetlg': 'movingSpritelg steps(5) 1s infinite',
			'moveSpriteSheetsm': 'movingSpritesm steps(5) 1s infinite',
			'marqueeEffect': 'marquee linear 15s infinite'
		},
		colors: {
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			royalpurple: '#2D18A8',
			lightpurple: '#6950D5',
			warmpink: '#A649E2',
			navyblue: '#021442',
			dullpurple: '#7F3ED0',
			hoverpurple: '#4C27A0',
			richpurple: '#251884',
			vibrantyellow: '#FBFA74',
			activeyellow: '#e3e122',
			deepsky: '#371EAE',
			bgpurple: '#a348e2',
			glass: 'rgba(46, 24, 138, .50)',
			graytext: '#3C4146',
			
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			primary: {
				DEFAULT: 'hsl(var(--primary))',
				foreground: 'hsl(var(--primary-foreground))'
			},
			secondary: {
				DEFAULT: 'hsl(var(--secondary))',
				foreground: 'hsl(var(--secondary-foreground))'
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
			},
			sidebar: {
				DEFAULT: 'hsl(var(--sidebar-background))',
				foreground: 'hsl(var(--sidebar-foreground))',
				primary: 'hsl(var(--sidebar-primary))',
				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				accent: 'hsl(var(--sidebar-accent))',
				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				border: 'hsl(var(--sidebar-border))',
				ring: 'hsl(var(--sidebar-ring))'
			}
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		}
	}
},
plugins: [require("tailwindcss-animate")],
}

