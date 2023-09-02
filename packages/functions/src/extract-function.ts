import type { ChatMessage } from '@dexaai/model';
import { ChatModel } from '@dexaai/model/openai';
import type { z } from 'zod';
import { Api } from './api.js';

/**
 * Specialized class for using OpenAI function calling to extract data from
 * a string. Handles:
 * - Calling the function and parsing the response
 * - Validating the response against a Zod schema
 * - Retrying once if the response is invalid
 */
export class ExtractFunction<Schema extends z.ZodObject<any>> {
  private readonly api: Api<Schema>;
  private readonly model: ChatModel;
  private readonly systemPrompt?: string;
  private readonly validate?: (args: z.infer<Schema>) => void;

  constructor(params: {
    /** The name of the function to register */
    name: string;
    /** The Zod schema to validate the response against */
    schema: Schema;
    /** A description of what the function does */
    description?: string;
    /** A system prompt to use for the API request */
    systemPrompt?: string;
    /** A ChatModel instance to use for making the API request */
    model?: ChatModel;
    /**
     * Validation to perform on the response in addition to the Zod schema.
     * Errors are caught and the message is passed back to the model.
     */
    validate?: (args: z.infer<Schema>) => void;
  }) {
    this.api = new Api(params.name, params.schema, params.description);
    this.model = params.model || new ChatModel({ params: { model: 'gpt-4' } });
    this.systemPrompt = params.systemPrompt;
    this.validate = params.validate;
  }

  async run(input: string): Promise<z.infer<Schema>> {
    // Make a call to the model
    const messages: ChatMessage[] = [{ role: 'user', content: input }];
    if (this.systemPrompt) {
      messages.unshift({ role: 'system', content: this.systemPrompt });
    }
    const { message } = await this.model.run({
      functions: [this.api.openApiSchema],
      function_call: { name: this.api.name },
      messages,
    });

    // Parse the response
    const { error, args } = this.api.parseArgs(
      message.function_call?.arguments
    );

    // Run the validation function, if present
    const validationError = this.runValidate(args);

    // If the response is valid, return the args
    if (args && !validationError) return args;

    const errorMessage = error || validationError || 'Unknown error';

    // Retry once, passing the error message back to the model
    console.log(`Retrying with error message: ${errorMessage}`);
    messages.push(message);
    messages.push({
      role: 'user',
      content: `Something went wrong. Please read this error message and try again: ${errorMessage}`,
    });
    const { message: message2 } = await this.model.run({
      functions: [this.api.openApiSchema],
      function_call: { name: this.api.name },
      messages,
    });

    // Parse the latest response
    const parsed = this.api.parseArgs(message2.function_call?.arguments);
    const validationError2 = this.runValidate(parsed.args);
    if (parsed.args && !validationError2) return parsed.args;
    throw new Error(parsed.error || validationError2 || 'Unknown error');
  }

  /**
   * Run the validation function, if present. If the validation fails, returns
   * the error message.
   */
  private runValidate(args: z.infer<Schema> | null): string | void {
    if (!this.validate || args === null) return;
    try {
      this.validate(args);
    } catch (error) {
      if (error instanceof Error) return error.message;
      return 'Invalid arguments';
    }
  }
}
