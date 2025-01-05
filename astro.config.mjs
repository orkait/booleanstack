import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-theme-mia.pages.dev",
  trailingSlash: "never",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "dracula",
        langs: ["cpp", "java", "python"],
      },
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
      component: {
        CodeSnippetTabs: "./src/components/codeblock.astro",
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
