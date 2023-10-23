import type { ChatModel, Prompt } from '../index.js';
import { Msg } from '../index.js';
import { getErrorMsg } from '../utils/get-error-message.js';
import type { Validator } from '../validator/validator.js';

type Chain<Args extends Record<string, any>, Result extends any> = (
  args: Args
) => Promise<Result>;

export function createChain<
  Args extends Record<string, any>,
  Result extends any
>(args: {
  model: ChatModel;
  prompt: Prompt.Template<Args>;
  validator: Validator<Result>;
  retries?: number;
}): Chain<Args, Result> {
  return async (promptArgs: Args): Promise<Result> => {
    const { model, prompt, validator, retries = 0 } = args;
    let attempts = 0;
    const messages = await prompt(promptArgs);
    while (attempts <= retries) {
      attempts++;
      const response = await model.generate({ messages });
      try {
        return await validator(response.choices[0].message);
      } catch (error) {
        const VAL_MSG = `There was an error validating the response. Please ready the error message and try again.\nError:\n`;
        const errMessage = getErrorMsg(error);
        messages.push(response.choices[0].message);
        messages.push(Msg.user(`${VAL_MSG}${errMessage}`));
      }
    }
    const lastError = messages[messages.length - 1].content!;
    throw new Error(
      `Validation failed after ${attempts} attempts: ${lastError}`
    );
  };
}
