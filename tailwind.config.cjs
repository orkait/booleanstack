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
	content: [
        "./src/**/*.{astro,mdx,ts,tsx}",
        "./src/components/canvas/BaseCanvas.tsx",
    ],
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
					...require("daisyui/src/theming/themes")["light"],
				},

				dark: {
					...require("daisyui/src/theming/themes")["forest"],
					// "color-scheme": "dark",
					// primary: "oklch(65.69% 0.196 275.75)",
					// secondary: "oklch(74.8% 0.26 342.55)",
					// accent: "oklch(74.51% 0.167 183.61)",
					// neutral: "#2a323c",
					// "neutral-content": "#A6ADBB",
					"base-100": "#0b0c0e",
					"base-200": "#0d0f12",
                    "base-content": "#D7DDE4",
					"base-300": "#090A0C",
					// "base-content": "#A6ADBB",
				},
			},
		],
	},
};
