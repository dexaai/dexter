import { type ChatMessage, type ChatParams } from 'openai-fetch';

import { type Telemetry } from '../../telemetry/types.js';

const SpanAttrs = {
  LLM_MODEL: 'llm.model',
  LLM_MODEL_TYPE: 'llm.model.type',
  LLM_PROVIDER: 'llm.provider',
  LLM_MAX_TOKENS: 'llm.max_tokens',
  LLM_TEMPERATURE: 'llm.temperature',
  LLM_FUNCTION: 'llm.func',
  LLM_TOOL: 'llm.tool',
  LLM_PROMPT: 'llm.prompt',

  LLM_COMPLETION: 'llm.completion',
  LLM_LATENCY: 'llm.latency',
  LLM_COST: 'llm.cost',
  LLM_CACHED: 'llm.cached',
  // NOTE: we can't use "tokens" because Sentry will filter it out as sensitive
  // data and the option to disable it is currently broken for new OTel SDKs.
  LLM_TOKENS_COMPLETION: 'llm.tkns.completion',
  LLM_TOKENS_PROMPT: 'llm.tkns.prompt',
  LLM_TOKENS_TOTAL: 'llm.tkns.total',
};

type AttrMap = Telemetry.SpanAttributes;

export function extractAttrsFromContext(context: any): AttrMap {
  try {
    return Object.entries(context).reduce((acc, [key, value]) => {
      acc[`context.${key}`] = JSON.stringify(value);
      return acc;
    }, {} as AttrMap);
  } catch (e) {
    console.error('Error extracting context attributes', e);
    return {};
  }
}

export function extractAttrsFromParams(params: {
  model?: string;
  modelType?: string;
  modelProvider?: string;
  max_tokens?: number;
  temperature?: number;
  functions?: ChatParams['functions'];
  tools?: ChatParams['tools'];
  messages?: ChatMessage[];
  prompt?: string | string[];
  input?: string[];
}): AttrMap {
  try {
    return {
      [SpanAttrs.LLM_MODEL]: params.model,
      [SpanAttrs.LLM_MODEL_TYPE]: params.modelType,
      [SpanAttrs.LLM_PROVIDER]: params.modelProvider,
      [SpanAttrs.LLM_MAX_TOKENS]: params?.max_tokens ?? undefined,
      [SpanAttrs.LLM_TEMPERATURE]: params?.temperature ?? undefined,
      ...extractAttrsFromMessages('prompt', params.messages),
      ...extractAttrsFromStrings('prompt', params.prompt ?? params.input),
      ...extractAttrsFromFunctions(params.functions),
      ...extractAttrsFromTools(params.tools),
    };
  } catch (e) {
    console.error('Error extracting params attributes', e);
    return {};
  }
}

export function extractAttrsFromResponse(resp: {
  cached?: boolean;
  cost?: number;
  choices?: { text?: string; message?: ChatMessage }[];
  usage?: {
    completion_tokens?: number;
    prompt_tokens?: number;
    total_tokens?: number;
  };
}): AttrMap {
  try {
    const completions = (resp.choices
      ?.map((choice) => choice.text)
      .filter(Boolean) ?? []) as string[];
    const messages = (resp.choices
      ?.map((choice) => choice.message)
      .filter(Boolean) ?? []) as ChatMessage[];
    return {
      [SpanAttrs.LLM_CACHED]: resp.cached,
      [SpanAttrs.LLM_COST]: resp.cost,
      [SpanAttrs.LLM_TOKENS_COMPLETION]: resp?.usage?.completion_tokens,
      [SpanAttrs.LLM_TOKENS_PROMPT]: resp?.usage?.prompt_tokens,
      [SpanAttrs.LLM_TOKENS_TOTAL]: resp?.usage?.total_tokens,
      ...extractAttrsFromMessages('completion', messages),
      ...extractAttrsFromStrings('completion', completions),
    };
  } catch (e) {
    console.error('Error extracting response attributes', e);
    return {};
  }
}

function extractAttrsFromFunctions(funcs?: ChatParams['functions']): AttrMap {
  const attrs: AttrMap = {};
  if (!funcs) return attrs;
  funcs.forEach((func, index) => {
    const prefix = `${SpanAttrs.LLM_FUNCTION}.${index}`;
    attrs[`${prefix}.name`] = func.name;
    attrs[`${prefix}.desc`] = func.description;
    attrs[`${prefix}.params`] = JSON.stringify(func.parameters || {});
  });
  return attrs;
}

function extractAttrsFromTools(tools?: ChatParams['tools']): AttrMap {
  const attrs: AttrMap = {};
  if (!tools) return attrs;
  tools.forEach((tool, index) => {
    const prefix = `${SpanAttrs.LLM_TOOL}.${index}`;
    attrs[`${prefix}.func.name`] = tool.function?.name;
    attrs[`${prefix}.func.desc`] = tool.function?.description;
    attrs[`${prefix}.func.params`] = JSON.stringify(
      tool.function?.parameters || {}
    );
  });
  return attrs;
}

function extractAttrsFromStrings(
  type: 'prompt' | 'completion',
  prompt?: string | string[] | null
): AttrMap {
  const attrs: Record<string, string> = {};
  if (!prompt) return attrs;
  const prompts = Array.isArray(prompt) ? prompt : [prompt];
  const prefix =
    type === 'prompt' ? SpanAttrs.LLM_PROMPT : SpanAttrs.LLM_COMPLETION;
  prompts.forEach((prompt, index) => {
    attrs[`${prefix}.${index}`] = prompt;
  });
  return attrs;
}

function extractAttrsFromMessages(
  type: 'prompt' | 'completion',
  messages?: ChatMessage[] | null
): AttrMap {
  const attrs: Record<string, string> = {};
  if (!messages) return attrs;
  messages.forEach((message, index) => {
    const prefix = `${type === 'prompt' ? SpanAttrs.LLM_PROMPT : SpanAttrs.LLM_COMPLETION}.${index}`;
    attrs[`${prefix}.role`] = message.role;
    if (message.content?.length) {
      attrs[`${prefix}.content`] = message.content;
    }
    if (message.function_call) {
      attrs[`${prefix}.function_call.name`] = message.function_call?.name || '';
      attrs[`${prefix}.function_call.arguments`] =
        message.function_call?.arguments || '';
    }
    if (message.tool_calls) {
      const toolCalls = message.tool_calls || [];
      let toolIndex = 0;
      for (const toolCall of toolCalls) {
        const toolPrefix = `${prefix}.tool_call.${toolIndex}`;
        attrs[`${toolPrefix}.function.name`] = toolCall.function.name || '';
        attrs[`${toolPrefix}.function.arguments`] =
          toolCall.function.arguments || '';
        toolIndex++;
      }
    }
  });
  return attrs;
}

/** Get the name for the Model.run() span */
export function getSpanName(args: {
  modelType: string;
  promptName?: string;
  promptVersion?: string;
}): string {
  try {
    const { modelType, promptName, promptVersion } = args;
    const typeName = modelType
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^./, (c) => c.toUpperCase());

    const detailParts = [promptName, promptVersion ? `v${promptVersion}` : ''];
    const details = detailParts.join(' ').trim();

    return `${typeName}Model.run(${details})`;
  } catch (e) {
    console.error('Error getting span name', e);
    return 'Model.run()';
  }
}
