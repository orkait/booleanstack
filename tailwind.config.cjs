/** @type {import('tailwindcss').Config} */
var defaultTheme = require("tailwindcss/defaultTheme");

var childrenSupport = ({ addVariant }) => {
	addVariant("child", "& > *");
	addVariant("child-hover", "& > *:hover");
};

const lightThemeName = "light";
const darkThemeName = "dark";

module.exports = {
	darkMode: ["class", `[data-theme="${darkThemeName}"]`],
	content: ["./src/**/*.{astro,mdx,ts,tsx}", "./src/components/canvas/BaseCanvas.tsx"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter"].concat(defaultTheme.fontFamily.sans),
				title: ["Noto Sans", "Familjen Grotesk"].concat(defaultTheme.fontFamily.sans),
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui"), childrenSupport],
	daisyui: {
		themes: [
			{
				light: {
					"color-scheme": "light",
					primary: "#1eb854",
					"primary-content": "#000000",
					secondary: "oklch(69.71% 0.329 342.55)",
					"secondary-content": "oklch(98.71% 0.0106 342.55)",
					accent: "oklch(76.76% 0.184 183.61)",
					neutral: "#2B3440",
					"neutral-content": "#D7DDE4",
					"base-100": "oklch(100% 0 0)",
					"base-200": "#F2F2F2",
					"base-300": "#E5E6E6",
					"base-content": "#1f2937",
					"--rounded-btn": "1.9rem",

				},

				dark: {
					"color-scheme": "dark",
					primary: "#1eb854",
					"primary-content": "#000000",
					secondary: "#1DB88E",
					accent: "#1DB8AB",
					neutral: "#19362D",
					"--rounded-btn": "1.9rem",
					"base-100": "#0b0c0e",
					"base-200": "#0d0f12",
					"base-300": "#090A0C",
				},
			},
		],
	},
};
