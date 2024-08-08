import * as Sentry from '@sentry/node';
import type { Telemetry } from './types.js';

test('Sentry Telemetry Provider', () => {
  expectTypeOf(Sentry).toMatchTypeOf<Telemetry.Base>();
});
