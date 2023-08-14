import type { ChatMessage } from '@dexaai/model';
import { ChatModel } from '@dexaai/model/openai';
import type { z } from 'zod';
import { Api } from './api.js';

export class ExtractFunction<Schema extends z.ZodObject<any>> {
  private readonly api: Api<Schema>;
  private readonly model: ChatModel;

  constructor(params: {
    name: string;
    schema: Schema;
    description?: string;
    model?: ChatModel;
  }) {
    this.model = params.model || new ChatModel({ params: { model: 'gpt-4' } });
    this.api = new Api(params.name, params.schema, params.description);
  }

  async run(input: string): Promise<z.infer<Schema>> {
    // Make a call to the model
    const messages: ChatMessage[] = [{ role: 'user', content: input }];
    const { message } = await this.model.run({
      functions: [this.api.jsonSchema],
      function_call: { name: this.api.name },
      messages,
    });

    // Parse the response
    const { error, args } = this.api.parseArgs(
      message.function_call?.arguments
    );
    if (args) return args;

    // Retry once, passing the error message back to the model
    console.log(`Retrying with error message: ${error}`);
    messages.push(message);
    messages.push({
      role: 'user',
      content: `Something went wrong. Please read this error message and try again: ${error}`,
    });
    const { message: message2 } = await this.model.run({
      functions: [this.api.jsonSchema],
      function_call: { name: this.api.name },
      messages,
    });

    // Parse the latest response
    const parsed = this.api.parseArgs(message2.function_call?.arguments);
    if (parsed.args) return parsed.args;
    throw new Error(parsed.error || 'Unknown error');
  }
}
