import ky, { type Options as KYOptions } from 'ky';

import { type Model } from '../types.js';

export const createSpladeClient = () => ({
  async createSparseVector(
    params: {
      input: string;
      model: string;
      requestOpts?: {
        headers?: KYOptions['headers'];
      };
    },
    serviceUrl: string
  ): Promise<Model.SparseVector.Vector> {
    try {
      const sparseValues = await ky
        .post(serviceUrl, {
          timeout: 1000 * 60,
          json: { text: params.input },
          headers: params.requestOpts?.headers,
        })
        .json<Model.SparseVector.Vector>();
      return sparseValues;
    } catch (e) {
      throw new Error('Failed to create splade vector', { cause: e });
    }
  },
});
