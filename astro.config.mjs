import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypePresetMinify from "rehype-preset-minify";
import vue from "@astrojs/vue";
import embeds from "astro-embed/integration";

// https://astro.build/config
export default defineConfig({
	legacy: {
		astroFlavoredMarkdown: true,
	},
	site: "https://booleanstack.com",
	trailingSlash: "never",
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "viewport",
	},
	integrations: [
		embeds(),
		mdx({
			syntaxHighlight: "shiki",
			shikiConfig: {
				theme: "ayu-dark",
				langs: [
					"cpp",
					"java",
					"python",
					"mdx",
					"javascript",
					"typescript",
					"json",
					"html",
					"css",
					"xml",
					"yaml",
					"markdown",
				],
			},
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex, rehypePresetMinify],
			component: {},
			optimize: {
				minify: true,
				bundle: true,
				preload: true,
				external: true,
				target: "esnext",
			},
		}),
		sitemap(),
		tailwind(),
		react({
			experimentalReactChildren: true,
		}),
		vue(),
	],
	output: "static",
});
