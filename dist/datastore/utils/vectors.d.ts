/** Utilities for working with vectors/embeddings. */
export declare class VectorUtils {
    /** Calculate the cosine similarity between two vectors. */
    static cosineSimilarity(a: number[], b: number[]): number;
    /** Calculate the dot product of two vectors */
    static dotProduct(a: number[], b: number[]): number;
    /**
     * Find the nearest neighbors of a vector in a set of documents with embeddings.
     * @param vector The vector to find neighbors for.
     * @param docs The set of documents with a vector/embedding to search.
     * @param topK The number of neighbors to find.
     * @param distanceFunction The distance function to use.
     * @returns The k nearest neighbors of the vector with the similarity score added (sorted by similarity).
     */
    static nearestNeighbors<D extends {
        embedding: number[];
    }>(args: {
        vector: number[];
        docs: D[];
        topK: number;
        distanceFunction?: 'cosineSimilarity' | 'dotProduct';
    }): (D & {
        score: number;
    })[];
}
