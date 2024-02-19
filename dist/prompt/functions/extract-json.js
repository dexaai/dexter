import { jsonrepair } from 'jsonrepair';
import parseJson from 'parse-json';
/** Extract a JSON object from a string. */
export function extractJsonObject(str) {
    // Extract just the JSON object from the string.
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    const objectString = str.slice(start, end ? end + 1 : str.length);
    let repairedObjectString = objectString;
    try {
        repairedObjectString = jsonrepair(objectString);
        const json = JSON.parse(repairedObjectString);
        return json;
    }
    catch (error) {
        // Parse again with parse-json for better error messages.
        const json = parseJson(repairedObjectString);
        return json;
    }
}
//# sourceMappingURL=extract-json.js.map