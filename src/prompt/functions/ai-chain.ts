import pMap from 'p-map';
import { z, type ZodType } from 'zod';
import type { Model } from '../../model/types.js';
import {
  Msg,
  getErrorMsg,
  type Prompt,
  extractZodObject,
  AbortError,
} from '../index.js';
import { type Prettify } from '../../utils/helpers.js';

export function createAIChain<
  Params extends Prompt.ChainParams = void,
  Result extends Prompt.ChainResult = string
>({
  chatModel,
  schema,
  params,
  prompt,
  functions,
  maxCalls = 3,
  maxRetries = 3,
  toolCallConcurrency = 8,
}: {
  chatModel: Model.Chat.Model;
  schema?: ZodType<Result>;
  params?: Omit<
    Prettify<Model.Chat.Run & Model.Chat.Config>,
    'functions' | 'tools' | 'function_call' | 'tool_choice'
  >;
  prompt?: Prompt.Template<Params>;
  functions?: Prompt.AIFunction[];
  maxCalls?: number;
  maxRetries?: number;
  toolCallConcurrency?: number;
}): Prompt.Chain<Params, Result> {
  return async (promptArgs: Params): Promise<Result> => {
    if (!params?.messages && !prompt) {
      throw new Error('Either params.messages or prompt must be provided');
    }

    if (params?.messages && prompt) {
      throw new Error('Only one of params.messages or prompt may be provided');
    }

    const messages =
      params?.messages ?? (await Promise.resolve(prompt!(promptArgs)));
    const tools = functions?.map((func) => ({
      type: 'function' as const,
      function: func.spec,
    }));

    let numCalls = 0;
    let numErrors = 0;

    do {
      ++numCalls;
      const response = await chatModel.run({
        ...params,
        messages,
        tools,
      });

      const { message } = response;
      try {
        if (Msg.isToolCall(message)) {
          messages.push(message);

          if (!functions) {
            throw new AbortError('No functions provided to handle tool call');
          }

          await pMap(
            message.tool_calls,
            async (toolCall) => {
              const func = functions?.find(
                (func) => func.spec.name === toolCall.function.name
              );

              if (!func) {
                throw new Error(
                  `No function found with name ${toolCall.function.name}`
                );
              }

              const result = await func(toolCall.function.arguments);

              const toolResult = Msg.toolResult(
                JSON.stringify(result, null, 2),
                toolCall.id
              );

              messages.push(toolResult);
            },
            {
              concurrency: toolCallConcurrency,
            }
          );
        } else if (Msg.isFuncCall(message)) {
          throw new AbortError(
            'Function calls are not supported; expected tool call'
          );
        } else if (Msg.isAssistant(message)) {
          if (schema) {
            if (schema instanceof z.ZodObject) {
              return extractZodObject({ json: message.content, schema });
            } else {
              // TODO: support arrays, boolean, number, etc.
              // validate string output
              return schema.parse(message.content);
            }
          } else {
            return message.content as Result;
          }
        }
      } catch (error: any) {
        numErrors++;

        if (error instanceof AbortError) {
          throw error;
        }

        const errMessage = getErrorMsg(error);
        messages.push(message);
        messages.push(
          Msg.user(
            `There was an error validating the response. Please check the error message and try again.\nError:\n${errMessage}`
          )
        );

        if (numErrors >= maxRetries) {
          throw new Error(
            `Chain failed after ${numErrors} errors: ${errMessage}`
          );
        }
      }
    } while (numCalls < maxCalls);

    throw new Error(`Chain stopped after reaching max ${maxCalls} calls`);
  };
}
