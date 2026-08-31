/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				paper: '#f4efe6',
				'paper-elevated': '#fbf8f2',
				ink: '#1c1917',
				'ink-muted': '#5c564e',
				'ink-subtle': '#8a8378',
				forest: '#1f4a42',
				'forest-fg': '#f4efe6',
				line: '#e3d9c8',
				'line-strong': '#cfc2ad',
			},
		},
	},
	plugins: [],
}
