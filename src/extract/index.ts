import { zodToJsonSchema } from 'openai-zod-to-json-schema';
import { type z } from 'zod';

import { type Model, type Msg, MsgUtil } from '../index.js';

/**
 * Extract data using OpenAI structured outputs.
 *
 * Always returns an object satisfying the provided Zod schema.
 */
export function createExtractFunction<Schema extends z.ZodObject<any>>(args: {
  /** The ChatModel used to make API calls. */
  chatModel: Model.Chat.Model;
  /** A descriptive name for the object to extract. */
  name: string;
  /** The Zod schema for the data to extract. */
  schema: Schema;
  /** Add a system message to the beginning of the messages array. */
  systemMessage: string;
  /** Apply strict validation to the extracted data (default: true) */
  strict?: boolean;
}): (input: string | Msg) => Promise<z.infer<Schema>> {
  const { chatModel, schema, systemMessage, strict = true } = args;

  async function runExtract(input: string | Msg): Promise<z.infer<Schema>> {
    const inputVal = typeof input === 'string' ? input : (input.content ?? '');
    const messages: Msg[] = [
      MsgUtil.system(systemMessage),
      MsgUtil.user(inputVal),
    ];

    const { message } = await chatModel.run({
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: args.name,
          strict,
          schema: zodToJsonSchema(schema, {
            $refStrategy: 'none',
            openaiStrictMode: true,
          }),
        },
      },
    });

    MsgUtil.assertAssistant(message);

    const json = JSON.parse(message.content);
    return schema.parse(json);
  }

  return runExtract;
}
