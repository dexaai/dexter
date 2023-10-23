import 'dotenv/config.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createChain } from './chain/chain.js';
import type { ChatModel } from './index.js';
import { extractZodObject } from './index.js';
import { Msg, OpenAIChatModel } from './index.js';

const model = new OpenAIChatModel({
  // Log responses to console for debugging
  hooks: { onResponse: [async (...args) => console.log(...args)] },
});

function zodToFuncParams(schema: z.ZodObject<any>) {
  const jsonSchema = zodToJsonSchema(schema, 'mySchema');
  return jsonSchema.definitions!.mySchema;
}

// @ts-ignore
const simpleChain = createChain({
  model,
  // The type of args is inferred to be the args of simpleChain()
  prompt: async (args: { name: string }) => [
    Msg.system('You tell 1 paragraph long stories about celebrities.'),
    Msg.user(`Tell me a story about ${args.name}`),
  ],
  // The return type of the validator is inferred to be the return type of simpleChain()
  validator: async (message: ChatModel.Message) => {
    const content = message.content;
    if (!message.content?.includes('born')) {
      return { data: null, error: 'The story must include the word "born"' };
    }
    return { data: content!, error: null };
  },
  // Retry once if validation fails
  retries: 1,
});

class AiFunction<Schema extends z.ZodObject<any>> {
  name: string;
  description?: string;
  schema: Schema;

  constructor(args: { name: string; description?: string; schema: Schema }) {
    this.name = args.name;
    this.description = args.description;
    this.schema = args.schema;
  }

  getSpec() {
    return {
      name: this.name,
      description: this.description,
      parameters: zodToFuncParams(this.schema),
    };
  }

  validate(message: ChatModel.Message) {
    const { name, arguments: args } = message.function_call || {};
    if (name !== this.name) {
      throw new Error(`Expected function ${this.name} to be called`);
    }
    return extractZodObject({
      schema: this.schema,
      json: args || '',
    });
  }
}

const ageFunc = new AiFunction({
  name: 'extract_age',
  schema: z.object({
    age: z.number().describe('The age of the person'),
  }),
});

const zodChain = createChain({
  model: model.addParams({
    functions: [ageFunc.getSpec()],
  }),
  prompt: (args: { text: string }) => [
    Msg.system("You extract a person's age from a sentence."),
    Msg.user(`How old is ${args.text}?`),
  ],
  validator: ageFunc.validate,
  retries: 1,
});

async function main() {
  const res = await zodChain({ text: 'Bill Murray is fifty' });
  console.log(res);
}

main();
