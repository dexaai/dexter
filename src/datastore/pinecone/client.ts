import { PineconeClient } from 'pinecone-client';
import type { JsonObject } from 'type-fest';

type PineconeConfig = ConstructorParameters<typeof PineconeClient>[0];

/** Create a new Pinecone client instance. */
export function createPineconeClient<Meta extends JsonObject = {}>(
  config: PineconeConfig
): PineconeClient<Meta> {
  return new PineconeClient<Meta>(config);
}

export type { PineconeClient };
