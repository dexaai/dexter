import { zodToJsonSchema as zodToJsonSchemaImpl } from 'zod-to-json-schema';
import { omit } from '../../utils/helpers.js';
/** Generate a JSON Schema from a Zod schema. */
export function zodToJsonSchema(schema) {
    return omit(zodToJsonSchemaImpl(schema, { $refStrategy: 'none' }), '$schema', 'default', 'definitions', 'description', 'markdownDescription');
}
//# sourceMappingURL=zod-to-json.js.map