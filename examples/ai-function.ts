import 'dotenv/config';
import { z } from 'zod';
import { ChatModel, createAIFunction, Msg, type Prompt } from '@dexaai/dexter';

/**
 * npx tsx examples/ai-function.ts
 */
async function main() {
  const getWeather = createAIFunction(
    {
      name: 'get_weather',
      description: 'Gets the weather for a given location',
      argsSchema: z.object({
        location: z
          .string()
          .describe('The city and state e.g. San Francisco, CA'),
        unit: z
          .enum(['c', 'f'])
          .optional()
          .default('f')
          .describe('The unit of temperature to use'),
      }),
    },
    // Fake weather API implementation which returns a random temperature
    // after a short delay
    async (args: { location: string; unit?: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        location: args.location,
        unit: args.unit,
        temperature: (30 + Math.random() * 70) | 0,
      };
    }
  );

  const chatModel = new ChatModel({
    debug: true,
    params: {
      model: 'gpt-4-1106-preview',
      temperature: 0.5,
      max_tokens: 500,
      tools: [
        {
          type: 'function',
          function: getWeather.spec,
        },
      ],
    },
  });

  const messages: Prompt.Msg[] = [
    Msg.user('What is the weather in San Francisco?'),
  ];

  {
    // Invoke the chat model and have it create the args for the `get_weather` function
    const { message } = await chatModel.run({
      messages,
      tool_choice: {
        type: 'function',
        function: {
          name: 'get_weather',
        },
      },
    });

    if (!Msg.isToolCall(message)) {
      throw new Error('Expected tool call');
    }
    messages.push(message);

    for (const toolCall of message.tool_calls) {
      if (toolCall.function.name !== 'get_weather') {
        throw new Error(`Invalid function name: ${toolCall.function.name}`);
      }

      const result = await getWeather(toolCall.function.arguments);
      const toolResult = Msg.toolResult(result, toolCall.id);
      messages.push(toolResult);
    }
  }

  {
    // Invoke the chat model with the result
    const { message } = await chatModel.run({
      messages,
      tool_choice: 'none',
    });
    if (!Msg.isAssistant(message)) {
      throw new Error('Expected assistant message');
    }

    console.log(message.content);
  }
}

main();
