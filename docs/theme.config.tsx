import { useRouter } from 'next/router';
import { type DocsThemeConfig, useConfig } from 'nextra-theme-docs';
import React from 'react';

const siteHost = 'llm-tools.dexa.ai';
const siteUrl = `https://${siteHost}`;
const siteSocialUrl = `${siteUrl}/social.png`; // TODO
const siteDesc = `TODO`;
const siteTitle = 'Dexa LLM Tools';

const config: DocsThemeConfig = {
  logo: (
    <img
      src="/logo.png"
      alt="Dexa AI"
      className="logo"
      width="1796"
      height="512"
      style={{
        height: 48,
        maxHeight: 48,
        width: 'auto',
      }}
    />
  ),
  project: {
    link: 'https://github.com/dexaai/llm-tools',
  },
  docsRepositoryBase: 'https://github.com/dexaai/llm-tools/blob/master/docs',
  editLink: {
    text: 'Edit this page on GitHub',
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath === '/') {
      return {
        titleTemplate: siteTitle,
      };
    } else {
      return {
        titleTemplate: `%s – ${siteTitle}`,
      };
    }
  },
  sidebar: {
    titleComponent,
    toggleButton: true,
  },
  head: function useHead() {
    const config = useConfig();
    const { asPath } = useRouter();
    const isIndex = asPath === '/';
    const title =
      config?.title && !isIndex ? `${config.title} - ${siteTitle}` : siteTitle;

    return (
      <>
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index,follow" />

        <meta name="description" content={siteDesc} />
        <meta property="og:description" content={siteDesc} />
        <meta name="twitter:description" content={siteDesc} />

        <meta property="og:site_name" content={siteTitle} />
        <meta name="apple-mobile-web-app-title" content={siteTitle} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={siteSocialUrl} />
        <meta name="og:image" content={siteSocialUrl} />

        <meta property="twitter:domain" content={siteHost} />
        <meta name="twitter:site:domain" content={siteHost} />

        <meta name="twitter:url" content={siteUrl} />

        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <title>{title}</title>

        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <style>
          {`
ul.nx-mt-6 {
  margin-top: 0;
}
`}
        </style>
      </>
    );
  },
  footer: {
    component: null,
  },
};

const tsTitleMappings = {
  namespaces: 'Namespaces',
  classes: 'Classes',
  interfaces: 'Interfaces',
  functions: 'Functions',
  'type-aliases': 'Type Aliases',
};

// TODO: get memoization working here
function titleComponent({
  title,
  type,
}: {
  title: string;
  type: string;
  route: string;
}) {
  if (title === 'Guide' || title === 'Documentation') {
    return <b>{title}</b>;
  }

  if (type === 'doc') {
    const tsTitleMapping = tsTitleMappings[title];
    if (tsTitleMapping) {
      title = tsTitleMapping;
    }
  }

  return <span>{title}</span>;
}

export default config;
