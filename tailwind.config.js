/**
 * Colors come from the CSS tokens in src/styles/theme.css, so every utility
 * (bg-surface, text-fg-muted, border-overlay/10, from-accent …) follows the
 * active light/dark theme automatically — no `dark:` variants needed.
 *
 * `colors` REPLACES Tailwind's default palette on purpose: only the theme
 * tokens exist, which keeps every color in the app centralised.
 */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ["./src/**/*.{html,ts}"],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			inherit: 'inherit',
			white: '#ffffff',
			black: '#000000',
			surface: {
				DEFAULT: token('surface'),
				alt: token('surface-alt'),
				deep: token('surface-deep'),
			},
			card: token('card'),
			elevated: token('elevated'),
			overlay: token('overlay'),
			line: token('line'),
			fg: {
				DEFAULT: token('fg'),
				soft: token('fg-soft'),
				muted: token('fg-muted'),
				subtle: token('fg-subtle'),
				faint: token('fg-faint'),
			},
			ink: token('ink'),
			accent: {
				DEFAULT: token('accent'),
				soft: token('accent-soft'),
				strong: token('accent-strong'),
			},
			'on-accent': token('on-accent'),
			primary: {
				DEFAULT: token('primary'),
				strong: token('primary-strong'),
			},
			'on-primary': token('on-primary'),
			secondary: token('secondary'),
			danger: token('danger'),
			warning: token('warning'),
		},
		extend: {
			backgroundColor: {
				// Code surfaces (Markdown code blocks, LaTeX editor)
				code: 'var(--code-surface)',
			},
			animation: {
				'spin-slow': 'spin 3s linear infinite',
				'spin-slower': 'spin 6s linear infinite',
				'spin-reverse': 'spin-reverse 4s linear infinite',
				'float': 'float 3s ease-in-out infinite',
			},
			keyframes: {
				'spin-reverse': {
					from: {
						transform: 'rotate(360deg)'
					},
					to: {
						transform: 'rotate(0deg)'
					}
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(-50%)'
					},
					'50%': {
						transform: 'translateY(-10px) translateX(-50%)'
					}
				}
			}
		}
	},
	plugins: [],
}
