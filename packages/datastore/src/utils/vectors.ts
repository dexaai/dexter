/** Utilities for working with vectors/embeddings. */
export class VectorUtils {
  /** Calculate the cosine similarity between two vectors. */
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length.');
    }

    let dotProduct = 0;
    let aMagnitudeSquared = 0;
    let bMagnitudeSquared = 0;

    for (let i = 0; i < a.length; i++) {
      const aValue = a[i];
      const bValue = b[i];

      dotProduct += aValue * bValue;
      aMagnitudeSquared += aValue * aValue;
      bMagnitudeSquared += bValue * bValue;
    }

    // Check for non-zero magnitude after the loop to avoid multiple divisions by zero.
    if (aMagnitudeSquared === 0 || bMagnitudeSquared === 0) {
      return 0;
    }

    const magnitudeProduct = aMagnitudeSquared * bMagnitudeSquared;
    const magnitudeProductRoot = Math.sqrt(magnitudeProduct);

    return dotProduct / magnitudeProductRoot;
  }

  /** Calculate the dot product of two vectors */
  static dotProduct(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length.');
    }

    let dotProduct = 0;

    for (let i = 0; i < a.length; i++) {
      const aValue = a[i];
      const bValue = b[i];

      dotProduct += aValue * bValue;
    }

    return dotProduct;
  }

  /**
   * Find the nearest neighbors of a vector in a set of documents with embeddings.
   * @param vector The vector to find neighbors for.
   * @param docs The set of documents with a vector/embedding to search.
   * @param topK The number of neighbors to find.
   * @param distanceFunction The distance function to use.
   * @returns The k nearest neighbors of the vector with the similarity score added (sorted by similarity).
   */
  static nearestNeighbors<D extends { embedding: number[] }>(args: {
    vector: number[];
    docs: D[];
    topK: number;
    distanceFunction?: 'cosineSimilarity' | 'dotProduct';
  }): (D & { score: number })[] {
    const { vector, docs, topK, distanceFunction } = args;
    const distance =
      distanceFunction === 'cosineSimilarity'
        ? VectorUtils.cosineSimilarity
        : VectorUtils.dotProduct;
    const distances: (D & { score: number })[] = docs.map((doc) => ({
      ...doc,
      score: distance(vector, doc.embedding),
    }));

    // Sort the distances in descending order of similarity (higher similarity means closer)
    distances.sort((a, b) => b.score - a.score);

    return distances.slice(0, topK);
  }
}
