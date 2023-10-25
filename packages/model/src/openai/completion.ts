import type { SetOptional } from 'type-fest';
import type { ModelArgs } from '../model.js';
import type { OpenAI } from './openai-types.js';
import type { Model } from '../types.js';
import { createOpenAIClient, extractTokens } from './client.js';
import { AbstractModel } from '../model.js';
import { calculateCost } from './utils/costs.js';

export class CompletionModel
  extends AbstractModel<
    OpenAI.Client,
    OpenAI.Completion.Config,
    Model.Completion.Run,
    Model.Completion.Response,
    OpenAI.Completion.Response
  >
  implements
    Model.Completion.IModel<
      OpenAI.Completion.Config,
      Model.Completion.Run,
      Model.Completion.Response
    >
{
  modelType = 'completion' as const;
  modelProvider = 'openai' as const;

  constructor(
    args?: SetOptional<
      ModelArgs<
        OpenAI.Client,
        OpenAI.Completion.Config,
        Model.Completion.Run,
        Model.Completion.Response
      >,
      'client' | 'params'
    >
  ) {
    let { client, params, ...rest } = args ?? {};
    // Add a default client if none is provided
    client = client ?? createOpenAIClient();
    // Set default model if no params are provided
    params = params ?? { model: 'gpt-3.5-turbo-instruct' };
    super({ client, params, ...rest });
  }

  protected async runModel(
    params: Model.Completion.Run & OpenAI.Completion.Config,
    context: Model.Ctx
  ): Promise<Model.Completion.Response> {
    const start = Date.now();

    // Make the OpenAI API request
    const response = await this.client.createCompletions(params);

    this.hooks?.onApiResponse?.forEach((hook) =>
      hook({
        timestamp: new Date().toISOString(),
        modelType: this.modelType,
        modelProvider: this.modelProvider,
        params,
        response,
        latency: Date.now() - start,
        context,
      })
    );

    const tokens = extractTokens(response.usage);
    const modelResponse: Model.Completion.Response = {
      completions: response.choices.map((choice) => ({
        completion: choice.text || '',
        logprobs: choice.logprobs,
      })),
      cached: false,
      tokens,
      cost: calculateCost({ model: params.model, tokens }),
    };

    return modelResponse;
  }
}
