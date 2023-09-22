import type {
  CompletionConfig,
  CompletionResponse,
  CompletionRun,
  Ctx,
  ICompletionModel,
  Prettify,
} from '../types.js';
import type { ModelArgs } from '../model.js';
import { AbstractModel } from '../model.js';
import type {
  OpenAIClient,
  OpenAICompletionParams,
  OpenAICompletionResponse,
} from './client.js';
import { createOpenAIClient, extractTokens } from './client.js';
import { calculateCost } from './costs.js';

export interface OCompletionConfig
  extends CompletionConfig,
    Omit<OpenAICompletionParams, 'prompt' | 'user'> {}

export interface OCompletionsResponse extends CompletionResponse {
  completions: {
    completion: string;
    logprobs?: OpenAICompletionResponse['choices'][0]['logprobs'];
  }[];
}

export type IOCompletionModel = ICompletionModel<
  OCompletionConfig,
  CompletionRun,
  OCompletionsResponse
>;

export class OCompletionModel
  extends AbstractModel<
    OCompletionConfig,
    CompletionRun,
    OCompletionsResponse,
    OpenAICompletionResponse
  >
  implements IOCompletionModel
{
  modelType = 'completion' as const;
  modelProvider = 'openai' as const;
  openaiClient: OpenAIClient;

  constructor(
    args: Prettify<
      ModelArgs<OCompletionConfig, CompletionRun, OCompletionsResponse> & {
        openaiClient?: OpenAIClient;
      }
    >
  ) {
    const { openaiClient, ...rest } = args;
    super(rest);
    this.openaiClient = openaiClient || createOpenAIClient();
  }

  async runModel(
    params: CompletionRun & OCompletionConfig,
    context: Ctx
  ): Promise<OCompletionsResponse> {
    const start = Date.now();
    const { response: apiResponse } = await this.openaiClient.createCompletions(
      {
        user: typeof context.user === 'string' ? context.user : '',
        ...params,
      }
    );
    const latency = Date.now() - start;
    const tokens = extractTokens(apiResponse.usage);
    await this.hooks.afterApiResponse?.({
      cost: calculateCost({ model: params.model, tokens }),
      timestamp: new Date().toISOString(),
      modelType: this.modelType,
      modelProvider: this.modelProvider,
      params,
      response: apiResponse,
      tokens,
      context,
      latency,
    });

    const response: OCompletionsResponse = {
      tokens,
      completions: apiResponse.choices.map((choice) => ({
        completion: choice.text || '',
        logprobs: choice.logprobs,
      })),
    };
    return response;
  }
}
