// src/pages/og/[...route].ts
import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

export const { getStaticPaths, GET } = await (async () => {
    const posts = await getCollection('blog');
    const pages = Object.fromEntries(
        posts.map(({ id, slug, data }) => [
            id,
            { data, slug },
        ])
    );

    return OGImageRoute({
        param: 'route',
        pages,
        getImageOptions: (path, page) => ({
            title: page.data.title,
            description: page.data.description,
        }),
    });
})();
