import fs from 'node:fs/promises';
import path from 'node:path';
import { globby } from 'globby';
import pMap from 'p-map';

/**
 * Cleans up TypeDoc's a automated output to make it more suitable for Nextra.
 *
 * Nextra insists on title-casing identifiers, so we need to manually set their
 * display names.
 */
async function main() {
  const docsDir = path.join('docs', 'pages', 'docs');

  const docs = (
    await globby('**/*.md', {
      cwd: docsDir,
    })
  )
    .map((relativePath) => {
      const absolutePath = path.join(docsDir, relativePath);

      return {
        relativePath,
        absolutePath,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const metaMap: Record<string, string[]> = {};

  await pMap(
    docs,
    async (doc) => {
      console.log(`processing ${doc.relativePath}`);
      const parts = doc.relativePath.split('/');
      if (parts.length <= 1) {
        return;
      }

      const bucket = parts.slice(0, -1).join('/');
      if (!metaMap[bucket]) {
        metaMap[bucket] = [];
      }

      metaMap[bucket].push(doc.relativePath);
    },
    {
      concurrency: 32,
    }
  );

  {
    // top-level nextra _meta.json file
    const docsMeta = {
      exports: 'API Reference',
      namespaces: 'Namespaces',
      classes: 'Classes',
      interfaces: 'Interfaces',
      functions: 'Functions',
      'type-aliases': {
        title: 'Type Aliases',
        display: 'hidden',
      },
      README: {
        display: 'hidden',
      },
    };

    await fs.writeFile(
      path.join(docsDir, '_meta.json'),
      JSON.stringify(docsMeta, null, 2),
      'utf-8'
    );
  }

  // sub nextra _meta.json files
  await pMap(
    Object.keys(metaMap),
    async (key) => {
      const values = metaMap[key]
        .map((value) => value.split('/').slice(-1)[0].split('.')[0].trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      if (values.length <= 1) {
        return;
      }

      const meta = values.reduce(
        (acc, value) => ({
          ...acc,
          [value]: value,
        }),
        {}
      );

      const destDir = path.join(docsDir, key);

      await fs.writeFile(
        path.join(path.join(destDir, '_meta.json')),
        JSON.stringify(meta, null, 2),
        'utf-8'
      );
    },
    {
      concurrency: 4,
    }
  );
}

main();
