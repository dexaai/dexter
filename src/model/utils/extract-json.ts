import { jsonrepair } from 'jsonrepair';
import parseJson from 'parse-json';
import { type JsonObject } from 'type-fest';

/** Extract a JSON object from a string. */
export function extractJsonObject(str: string): JsonObject {
  // Extract just the JSON object from the string.
  const start = str.indexOf('{');
  const end = str.lastIndexOf('}');
  const objectString = str.slice(start, end ? end + 1 : str.length);
  let repairedObjectString = objectString;

  try {
    repairedObjectString = jsonrepair(objectString);
    const json: JsonObject = JSON.parse(repairedObjectString);
    return json;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Parse again with parse-json for better error messages.
    const json: JsonObject = parseJson(repairedObjectString);
    return json;
  }
}
