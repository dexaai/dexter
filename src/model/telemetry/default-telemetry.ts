import { type Telemetry } from './types.js';

export const DefaultTelemetry: Telemetry.Provider = {
  startSpan<T>(
    _options: Telemetry.SpanOptions,
    callback: (span: Telemetry.Span) => T
  ): T {
    return callback({
      setAttribute() {
        // no-op
        return this;
      },
      setAttributes() {
        // no-op
        return this;
      },
    });
  },

  setTags() {
    // no-op
  },
};
