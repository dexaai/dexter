import ky from 'ky';
import type { Model } from '../types.js';

export const createSpladeClient = () => ({
  async createSparseVector(
    params: {
      input: string;
      model: string;
    },
    serviceUrl: string
  ): Promise<Model.SparseVector.Vector> {
    try {
      const sparseValues = await ky
        .post(serviceUrl, {
          timeout: 1000 * 60,
          json: { text: params.input },
        })
        .json<Model.SparseVector.Vector>();
      return sparseValues;
    } catch (e) {
      // @ts-ignore: TODO: add custom Error class that handles this
      throw new Error('Failed to create splade vector', { cause: e });
    }
  },
});
