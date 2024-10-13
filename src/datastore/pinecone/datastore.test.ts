import { PineconeClient } from 'pinecone-client';
import { describe, expect, it, vi } from 'vitest';

import { EmbeddingModel, SparseVectorModel } from '../../model/index.js';
import { PineconeDatastore } from './datastore.js';
import { PineconeHybridDatastore } from './hybrid-datastore.js';

vi.mock('../../model/index.js', () => {
  const EmbeddingModel = vi.fn();
  const SparseVectorModel = vi.fn();
  EmbeddingModel.prototype.run = vi
    .fn()
    .mockImplementation((args: { input: string[] }) => {
      if (args.input.length === 1) {
        return { embeddings: [[1, 1]] };
      } else {
        return {
          embeddings: [
            [1, 1],
            [2, 2],
          ],
        };
      }
    });
  SparseVectorModel.prototype.run = vi
    .fn()
    .mockImplementation((_args: { input: string[] }) => ({
      vectors: [
        { indices: [1, 1], values: [1, 1] },
        { indices: [2, 2], values: [2, 2] },
      ],
    }));
  return { EmbeddingModel, SparseVectorModel };
});

vi.mock('pinecone-client', () => {
  const PineconeClient = vi.fn();
  PineconeClient.prototype.query = vi.fn().mockImplementation(() => ({
    matches: [],
  }));
  PineconeClient.prototype.upsert = vi
    .fn()
    .mockImplementation((_args: { vectors: unknown }) => {});
  PineconeClient.prototype.query = vi.fn().mockImplementation(() => ({
    query: {},
    docs: [],
  }));
  return { PineconeClient };
});

type Meta = { content: string };

describe('Datastore', () => {
  let datastore: PineconeDatastore<Meta>;
  let embeddingModel: EmbeddingModel;
  let client: PineconeClient<Meta>;

  beforeEach(() => {
    embeddingModel = new EmbeddingModel({
      params: { model: 'text-embedding-ada-002' },
    });
    client = new PineconeClient({ apiKey: '', baseUrl: '' });
    datastore = new PineconeDatastore<Meta>({
      namespace: 'test',
      contentKey: 'content',
      embeddingModel,
      pinecone: client,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('upsert with embeddings', async () => {
    await datastore.upsert([
      {
        id: '1',
        metadata: { content: '1' },
        embedding: [1, 1],
      },
      {
        id: '2',
        metadata: { content: '2' },
        embedding: [2, 2],
      },
    ]);
    // No embeddings should have been generated
    expect(embeddingModel.run).not.toHaveBeenCalled();
    // The documents should be upserted with their embeddings
    expect(client.upsert).toHaveBeenCalledOnce();
    expect(client.upsert).toHaveBeenCalledWith({
      vectors: [
        {
          id: '1',
          metadata: { content: '1' },
          values: [1, 1],
        },
        {
          id: '2',
          metadata: { content: '2' },
          values: [2, 2],
        },
      ],
    });
  });

  it('upsert without embeddings', async () => {
    await datastore.upsert([
      { id: '1', metadata: { content: '1' } },
      { id: '2', metadata: { content: '2' } },
    ]);
    // A batch of embeddings should have been generated
    expect(embeddingModel.run).toHaveBeenCalledOnce();
    expect(client.upsert).toHaveBeenCalledOnce();
    expect(client.upsert).toHaveBeenCalledWith({
      vectors: [
        {
          id: '1',
          metadata: { content: '1' },
          values: [1, 1],
        },
        {
          id: '2',
          metadata: { content: '2' },
          values: [2, 2],
        },
      ],
    });
  });

  it('upsert with some embeddings', async () => {
    await datastore.upsert([
      { id: '1', metadata: { content: '1' } },
      {
        id: '2',
        metadata: { content: '2' },
        embedding: [2, 2],
      },
      {
        id: '3',
        metadata: { content: '3' },
        embedding: [3, 3],
      },
      { id: '4', metadata: { content: '4' } },
    ]);
    expect(embeddingModel.run).toHaveBeenCalledOnce();
    expect(client.upsert).toHaveBeenCalledOnce();
    expect(client.upsert).toHaveBeenCalledWith({
      vectors: [
        {
          id: '1',
          metadata: { content: '1' },
          values: [1, 1],
        },
        {
          id: '2',
          metadata: { content: '2' },
          values: [2, 2],
        },
        {
          id: '3',
          metadata: { content: '3' },
          values: [3, 3],
        },
        {
          id: '4',
          metadata: { content: '4' },
          values: [2, 2],
        },
      ],
    });
  });
});

describe('HybridDatastore', () => {
  let datastore: PineconeHybridDatastore<Meta>;
  let embeddingModel: EmbeddingModel;
  let spladeModel: SparseVectorModel;
  let pineconeClient: PineconeClient<Meta>;

  beforeEach(() => {
    embeddingModel = new EmbeddingModel({
      params: { model: 'text-embedding-ada-002' },
    });
    spladeModel = new SparseVectorModel({
      params: { model: 'naver/splade-cocondenser-ensembledistil' },
    });
    pineconeClient = new PineconeClient({ apiKey: '', baseUrl: '' });
    datastore = new PineconeHybridDatastore<Meta>({
      namespace: 'test',
      contentKey: 'content',
      embeddingModel,
      spladeModel,
      pinecone: pineconeClient,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('upsert with embeddings', async () => {
    await datastore.upsert([
      {
        id: '1',
        metadata: { content: '1' },
        embedding: [1, 1],
        sparseVector: { indices: [1, 1], values: [1, 1] },
      },
      {
        id: '2',
        metadata: { content: '2' },
        embedding: [2, 2],
        sparseVector: { indices: [2, 2], values: [2, 2] },
      },
    ]);
    // No embeddings should have been generated
    expect(embeddingModel.run).not.toHaveBeenCalled();
    expect(spladeModel.run).not.toHaveBeenCalled();
    // The documents should be upserted with their embeddings
    expect(pineconeClient.upsert).toHaveBeenCalledOnce();
    expect(pineconeClient.upsert).toHaveBeenCalledWith({
      vectors: [
        {
          id: '1',
          metadata: { content: '1' },
          values: [1, 1],
          sparseValues: { indices: [1, 1], values: [1, 1] },
        },
        {
          id: '2',
          metadata: { content: '2' },
          values: [2, 2],
          sparseValues: { indices: [2, 2], values: [2, 2] },
        },
      ],
    });
  });

  it('upsert without embeddings', async () => {
    await datastore.upsert([
      { id: '1', metadata: { content: '1' } },
      { id: '2', metadata: { content: '2' } },
    ]);
    // A batch of embeddings should have been generated
    expect(embeddingModel.run).toHaveBeenCalledOnce();
    expect(spladeModel.run).toHaveBeenCalledOnce();
    expect(pineconeClient.upsert).toHaveBeenCalledOnce();
    expect(pineconeClient.upsert).toHaveBeenCalledWith({
      vectors: [
        {
          id: '1',
          metadata: { content: '1' },
          values: [1, 1],
          sparseValues: { indices: [1, 1], values: [1, 1] },
        },
        {
          id: '2',
          metadata: { content: '2' },
          values: [2, 2],
          sparseValues: { indices: [2, 2], values: [2, 2] },
        },
      ],
    });
  });

  it('upsert with some embeddings', async () => {
    await datastore.upsert([
      { id: '1', metadata: { content: '1' } },
      {
        id: '2',
        metadata: { content: '2' },
        embedding: [2, 2],
        sparseVector: { indices: [2, 2], values: [2, 2] },
      },
      {
        id: '3',
        metadata: { content: '3' },
        embedding: [3, 3],
        sparseVector: { indices: [3, 3], values: [3, 3] },
      },
      { id: '4', metadata: { content: '4' } },
    ]);
    expect(embeddingModel.run).toHaveBeenCalledOnce();
    expect(pineconeClient.upsert).toHaveBeenCalledOnce();
    expect(pineconeClient.upsert).toHaveBeenCalledWith({
      vectors: [
        {
          id: '1',
          metadata: { content: '1' },
          values: [1, 1],
          sparseValues: { indices: [1, 1], values: [1, 1] },
        },
        {
          id: '2',
          metadata: { content: '2' },
          values: [2, 2],
          sparseValues: { indices: [2, 2], values: [2, 2] },
        },
        {
          id: '3',
          metadata: { content: '3' },
          values: [3, 3],
          sparseValues: { indices: [3, 3], values: [3, 3] },
        },
        {
          id: '4',
          metadata: { content: '4' },
          values: [2, 2],
          sparseValues: { indices: [2, 2], values: [2, 2] },
        },
      ],
    });
  });

  it('caches queries', async () => {
    const datastore = new PineconeHybridDatastore<Meta>({
      namespace: 'test',
      contentKey: 'content',
      embeddingModel,
      spladeModel,
      pinecone: pineconeClient,
      cache: new Map(),
    });
    await datastore.query({ query: 'test' });
    expect(pineconeClient.query).toHaveBeenCalledOnce();
    await datastore.query({ query: 'test' });
    expect(pineconeClient.query).toHaveBeenCalledOnce();
  });
});
