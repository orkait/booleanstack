// src/pages/og/[...route].ts
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

// Get all blog posts from your content collection
const blogPosts = await getCollection('blog');

// Convert blog posts array to an object format required by OGImageRoute
const pages = Object.fromEntries(
    blogPosts.map(({ slug, data }) => [
        slug,
        {
            title: data.title,
            description: data.description || '',
        },
    ])
);

export const { getStaticPaths, GET } = OGImageRoute({
    param: 'route',
    pages: pages,

    getImageOptions: (path, page) => ({
        title: page.title,
        description: page.description,
        logo: {
            path: './public/logo.svg',
        },
        // Customize as needed
        bgGradient: [[30, 30, 30], [50, 50, 50]],
    }),
});