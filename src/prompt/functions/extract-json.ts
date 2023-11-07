import { jsonrepair } from 'jsonrepair';
import parseJson from 'parse-json';
import type { JsonObject } from 'type-fest';

/** Extract a JSON object from a string. */
export function extractJsonObject(str: string): JsonObject {
  // Extract just the JSON object from the string.
  const start = str.indexOf('{');
  const end = str.lastIndexOf('}');
  const objectString = str.slice(start, end ? end + 1 : str.length);
  try {
    const json: JsonObject = JSON.parse(jsonrepair(objectString));
    return json;
  } catch (error) {
    // Parse again with parse-json for better error messages.
    const json: JsonObject = parseJson(objectString);
    return json;
  }
}
