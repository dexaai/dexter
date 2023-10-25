import type { SetOptional } from 'type-fest';
import type { ModelArgs } from '../model.js';
import type { OpenAI } from './types.js';
import type { Model } from '../types.js';
import { calculateCost } from './utils/calculate-cost.js';
import { createClient, extractTokens } from './utils/client.js';
import { AbstractModel } from '../model.js';

export type CompletionModelArgs = SetOptional<
  ModelArgs<
    OpenAI.Client,
    OpenAI.Completion.Config,
    Model.Completion.Run,
    Model.Completion.Response
  >,
  'client' | 'params'
>;

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

  constructor(args?: CompletionModelArgs) {
    let { client, params, ...rest } = args ?? {};
    // Add a default client if none is provided
    client = client ?? createClient();
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

  /** Clone the model and merge/orverride the given properties. */
  clone(args?: CompletionModelArgs): this {
    const { cache, client, context, debug, params, hooks } = args ?? {};
    // @ts-ignore
    return new CompletionModel({
      cache: cache || this.cache,
      client: client || this.client,
      context: this.mergeContext(this.context, context),
      debug: debug || this.debug,
      params: this.mergeParams(this.params, params ?? {}),
      hooks: this.mergeHooks(this.hooks, hooks || {}),
    });
  }
}
