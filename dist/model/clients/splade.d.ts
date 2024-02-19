import type { Model } from '../types.js';
export declare const createSpladeClient: () => {
    createSparseVector(params: {
        input: string;
        model: string;
    }, serviceUrl: string): Promise<Model.SparseVector.Vector>;
};
