
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
				'heading': ['Google Sans Mono', 'Space Mono', 'monospace'],
				'mono': ['Google Sans Mono', 'Space Mono', 'monospace'],
			},
			colors: {
				primary: {
					DEFAULT: '#19b196', // deep teal green
					foreground: '#fff'
				},
				accent: {
					DEFAULT: '#e6fbf8', // light teal accent
					foreground: '#18534e'
				},
				background: '#F5FDFC',
				foreground: '#184f48',
				card: { DEFAULT: '#fff', foreground: '#184f48' },
				muted: { DEFAULT: '#d0f0ee', foreground: '#389e90' },
				teal: { DEFAULT: '#20CFC7', dark: '#0F766E', light: '#96e5e0' },
				'glass': 'rgba(255,255,255,0.22)'
			},
			borderRadius: {
				'2xl': '1.25rem',
				'glass': '1.4rem',
				'card': '1.15rem'
			},
			boxShadow: {
				'glass': '0 12px 36px 0 rgba(25,177,150,0.19)',
			},
			keyframes: {
				pulseTeal: {
				  '0%, 100%': { opacity: '0.60', transform: 'scale(1)' },
				  '50%': { opacity: '1', transform: 'scale(1.35)' },
				},
			},
			animation: {
				pulseTeal: 'pulseTeal 1.4s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
