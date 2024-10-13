/** OpenAI API costs in cents per token. */
type Cost = { input: number; output: number };

const COSTS: Record<string, Cost> = {
  'gpt-4': {
    input: 0.003,
    output: 0.006,
  },
  'gpt-4-turbo': {
    input: 0.001,
    output: 0.003,
  },
  'gpt-4o': {
    input: 0.0005,
    output: 0.0015,
  },
  'gpt-4o-mini': {
    input: 0.000015,
    output: 0.00006,
  },
  'gpt-4-32k': {
    input: 0.006,
    output: 0.012,
  },
  'gpt-3.5-turbo': {
    input: 0.00005,
    output: 0.00015,
  },
  'gpt-3.5-turbo-16k': {
    input: 0.0003,
    output: 0.0004,
  },
  'gpt-3.5-turbo-1106': {
    input: 0.00005,
    output: 0.00015,
  },
  'gpt-3.5-turbo-instruct': {
    input: 0.00015,
    output: 0.0002,
  },
  'babbage-002': {
    input: 0.00004,
    output: 0.00004,
  },
  'davinci-002': {
    input: 0.0002,
    output: 0.0002,
  },
  'text-embedding-ada-002': {
    input: 0.00001,
    output: 0.00001,
  },
  'text-embedding-3-large': {
    input: 0.000013,
    output: 0.000013,
  },
  'text-embedding-3-small': {
    input: 0.000002,
    output: 0.000002,
  },
  'ft:gpt-3.5-turbo': {
    input: 0.0012,
    output: 0.0016,
  },
  'ft:davinci-002': {
    input: 0.0012,
    output: 0.0012,
  },
  'ft:babbage-002': {
    input: 0.00016,
    output: 0.00016,
  },
  'ft-legacy:ada': {
    input: 0.00016,
    output: 0.00016,
  },
  'ft-legacy:babbage': {
    input: 0.00024,
    output: 0.00024,
  },
};

/** Calculate the cost (in cents) for the given model and tokens. */
export function calculateCost(args: {
  model: string;
  tokens?: { prompt_tokens: number; completion_tokens?: number };
}): number | undefined {
  const cost = getCost(args.model);
  if (!cost || !args.tokens) return undefined;
  const { prompt_tokens: prompt, completion_tokens: completion = 0 } =
    args.tokens;
  // Work around floating point errors by multiplying by 1000 and rounding.
  const MULTIPLIER = 1000;
  const multipliedCost =
    cost.input * prompt * MULTIPLIER + cost.output * completion * MULTIPLIER;
  return Math.round(multipliedCost) / MULTIPLIER;
}

/** Find the cost for the given model. */
function getCost(model: string): Cost | null {
  const cost: Cost | undefined = COSTS[model];
  if (cost) return cost;

  // Handle model names with versions that have the same price.
  // Eg: gpt-3.5-turbo-0613

  if (model === 'gpt-4o-mini' || model.startsWith('gpt-4o-mini-')) {
    return COSTS['gpt-4o-mini'];
  }

  if (model === 'gpt-4o' || model.startsWith('gpt-4o-')) {
    return COSTS['gpt-4o'];
  }

  if (model.startsWith('gpt-4')) {
    if (
      model.startsWith('gpt-4-1106') ||
      model.startsWith('gpt-4-0125') ||
      model.includes('turbo')
    ) {
      return COSTS['gpt-4-turbo'];
    } else {
      return COSTS[model.includes('32k') ? 'gpt-4-32k' : 'gpt-4'];
    }
  }

  if (model.startsWith('gpt-3.5-turbo')) {
    return COSTS[model.includes('16k') ? 'gpt-3.5-turbo-16k' : 'gpt-3.5-turbo'];
  }

  if (model.startsWith('babbage-002')) return COSTS['babbage-002'];
  if (model.startsWith('davinci-002')) return COSTS['davinci-002'];

  if (model.startsWith('text-embedding-ada-002')) {
    return COSTS['text-embedding-ada-002'];
  }

  // V2 fine-tuned models
  // Eg: ft:gpt-3.5-turbo:my-org:custom_suffix:id
  if (model.startsWith('ft:davinci')) return COSTS['ft:davinci-002'];
  if (model.includes('ft:babbage')) return COSTS['ft:babbage-002'];
  if (model.includes('ft:gpt-3.5-turbo')) return COSTS['ft:gpt-3.5-turbo'];

  // V1 fine-tuned models
  // Eg: ada:ft-your-org:custom-model-name-2022-02-15-04-21-04
  if (model.startsWith('ada:ft')) return COSTS['ft-legacy:ada'];
  if (model.startsWith('babbage:ft')) return COSTS['ft-legacy:babbage'];

  return null;
}
