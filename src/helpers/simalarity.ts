// TF-IDF and cosine similarity implementation optimized for performance
export class SimilarityIndex {
    private documents: Map<string, number[]>;
    private idfValues: Map<string, number>;
    private vocabulary: Set<string>;
    private allPosts: any[];

    constructor() {
        this.documents = new Map();
        this.idfValues = new Map();
        this.vocabulary = new Set();
        this.allPosts = [];
    }

    // Tokenize and clean text
    private tokenize(text: string): string[] {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
    }

    // Calculate TF-IDF vectors
    private calculateTfIdf(tokens: string[]): number[] {
        const tf = new Map<string, number>();
        tokens.forEach(token => {
            tf.set(token, (tf.get(token) || 0) + 1);
        });

        const vector: number[] = Array(this.vocabulary.size).fill(0);
        [...this.vocabulary].forEach((term, index) => {
            const termFreq = tf.get(term) || 0;
            const idf = this.idfValues.get(term) || 0;
            vector[index] = termFreq * idf;
        });

        return vector;
    }

    // Compute cosine similarity between vectors
    private cosineSimilarity(vec1: number[], vec2: number[]): number {
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }

        if (norm1 === 0 || norm2 === 0) return 0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    // Index all posts
    public indexPosts(posts: any[]): void {
        // Assign allPosts
        this.allPosts = posts;

        // Build vocabulary and document frequency
        const docFreq = new Map<string, number>();

        posts.forEach(post => {
            const tokens = this.tokenize(post.data.title);
            const uniqueTokens = new Set(tokens);

            uniqueTokens.forEach(token => {
                this.vocabulary.add(token);
                docFreq.set(token, (docFreq.get(token) || 0) + 1);
            });
        });

        // Calculate IDF values
        const N = posts.length;
        this.vocabulary.forEach(term => {
            const df = docFreq.get(term) || 0;
            this.idfValues.set(term, Math.log(N / (df + 1)));
        });

        // Calculate TF-IDF vectors for all posts
        posts.forEach(post => {
            const tokens = this.tokenize(post.data.title);
            this.documents.set(post.slug, this.calculateTfIdf(tokens));
        });
    }

    // Find similar posts
    public findSimilar(currentPost: any, limit: number = 3): any[] {
        const currentVec = this.documents.get(currentPost.slug);
        if (!currentVec) return [];

        const similarities: [string, number][] = [];
        const currentTags = new Set(currentPost.data.tags || []);

        this.allPosts.forEach(post => {
            if (post.slug === currentPost.slug) return;

            const vec = this.documents.get(post.slug);
            if (!vec) return;

            // Calculate text similarity (title)
            const textSimilarity = this.cosineSimilarity(currentVec, vec);

            // Calculate tag similarity (Jaccard similarity)
            const postTags = new Set(post.data.tags || []);
            const intersection = new Set([...currentTags].filter(tag => postTags.has(tag)));
            const union = new Set([...currentTags, ...postTags]);
            const tagSimilarity = union.size ? intersection.size / union.size : 0;

            // Combine similarities (weighted average)
            const combinedSimilarity = (0.4 * textSimilarity) + (0.6 * tagSimilarity);
            similarities.push([post.slug, combinedSimilarity]);
        });

        // Sort by similarity and get top results
        return similarities
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([slug]) => this.allPosts.find(post => post.slug === slug));
    }
}

// const allPostMeta = [
//     {
//         title: 'Codable Protocol in Swift',
//         description: 'Codable protocol allows you to encode or decode custom data types to and from formats such as JSON',
//         date: 'May 1, 2024',
//         tags: [Array],
//         cover: 'https://images.unsplash.com/photo-1579762593175-20226054cad0'
//     },
//     {
//         title: 'Swift Cheatsheet',
//         description: 'A quick reference guide for the Swift programming language covering the primary types, including Number, String, and Bool, and advanced data structures like Set, Array and Dictionary',
//         date: 'December 29, 2023',
//         tags: [Array],
//         cover: 'https://images.unsplash.com/photo-1580196969807-cc6de06c05be'
//     },
//     {
//         title: '347. Top K Frequent Elements',
//         description: 'Find the k most frequent elements in an array using heaps and hash maps.',
//         date: 'January 21, 2024',
//         tags: [Array],
//         cover: 'https://i.ytimg.com/vi/Wh3A29psE_Y/maxresdefault.jpg'
//     }
// ];


// const currentPostMeta = {
//     title: '347. Top K Frequent Elements',
//     description: 'Find the k most frequent elements in an array using heaps and hash maps.',
//     date: 'January 21, 2024',
//     tags: ['algorithms', 'heaps', 'hash-maps'],
//     cover: 'https://i.ytimg.com/vi/Wh3A29psE_Y/maxresdefault.jpg'
// }

// const similarityIndex = new SimilarityIndex();
// similarityIndex.indexPosts(allPostMeta);

// const similarPosts = similarityIndex.findSimilar(currentPostMeta, 3);

// console.log(similarPosts);