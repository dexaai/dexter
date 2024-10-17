/* eslint-disable no-use-before-define */
export namespace Telemetry {
  export interface Provider {
    startSpan<T>(options: SpanOptions, callback: (span: Span) => T): T;

    setTags(tags: { [key: string]: Primitive }): void;
  }

  export interface SpanOptions {
    /** The name of the span. */
    name: string;
    /** An op for the span. This is a categorization for spans. */
    op?: string;
  }

  /**
   * A generic Span which holds trace data.
   */
  export interface Span {
    /**
     * Set a single attribute on the span.
     * Set it to `undefined` to remove the attribute.
     */
    setAttribute(key: string, value: SpanAttributeValue | undefined): this;

    /**
     * Set multiple attributes on the span.
     * Any attribute set to `undefined` will be removed.
     */
    setAttributes(attributes: SpanAttributes): this;
  }

  export type Primitive =
    | number
    | string
    | boolean
    | bigint
    | symbol
    | null
    | undefined;

  export type SpanAttributeValue =
    | string
    | number
    | boolean
    | (null | undefined | string)[]
    | (null | undefined | number)[]
    | (null | undefined | boolean)[];

  export type SpanAttributes = Record<string, SpanAttributeValue | undefined>;
}
