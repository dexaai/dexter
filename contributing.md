# Contributing

Suggestions and pull requests are very welcome. 😊

## Development

To develop the project locally, you'll need `node >= 18` and `pnpm >= 8`.

```bash
git clone https://github.com/dexaai/dexter
cd dexter
pnpm i
```

You can now run the `tsc` dev server to automatically recompile the project whenever you make changes:

```bash
pnpm dev
```

## Testing

You can run the test suite via:

```bash
pnpm test
```

Or just the [Vitest](https://vitest.dev) unit tests via:

```bash
pnpm test:unit
```

## Examples

To run the included examples, clone this repo, run `pnpm install`, set up your `.env` file, and then run an example file using `tsx`.

For example:

```bash
npx tsx examples/basic.ts
```
