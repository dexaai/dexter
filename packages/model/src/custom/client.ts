import ky from 'ky';
import type { SparseVector } from './types.js';

export type SpladeClient = typeof createSpladeVector;

export async function createSpladeVector(
  params: {
    input: string;
    model: string;
  },
  serviceUrl: string
): Promise<SparseVector.Vector> {
  try {
    const sparseValues = await ky
      .post(serviceUrl, {
        timeout: 1000 * 60,
        json: { text: params.input },
      })
      .json<SparseVector.Vector>();
    return sparseValues;
  } catch (e) {
    // @ts-ignore: TODO: add custom Error class that handles this
    throw new Error('Failed to create splade vector', { cause: e });
  }
}
