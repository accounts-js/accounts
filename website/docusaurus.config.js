/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');
const { themes } = require('prism-react-renderer');
const theme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'accounts-js',
  tagline: 'Fullstack authentication and accounts-management for Javascript',
  url: 'https://www.accountsjs.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'accounts-js',
  projectName: 'accounts-js',
  customFields: {
    repoUrl: 'https://github.com/accounts-js/accounts',
  },
  themeConfig: {
    algolia: {
      apiKey: '016cff68ff1e2085dfbc51fda088bb08',
      appId: 'LKY03361YR',
      indexName: 'accounts',
      contextualSearch: true,
    },
    fathomAnalytics: {
      siteId: 'NZPJJZTJ',
      customDomain: 'https://goose.accountsjs.com',
    },
    prism: {
      theme,
      darkTheme,
    },
    navbar: {
      logo: {
        alt: 'accounts.js logo',
        src: 'img/logo.png',
      },

      items: [
        { to: 'docs/introduction', label: 'Documentation', position: 'right' },
        {
          label: 'Api reference',
          to: 'api',
          position: 'right',
        },
        {
          href: 'https://github.com/accounts-js/accounts',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/introduction',
            },
            {
              label: 'Api reference',
              to: 'api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/accounts-js/accounts/discussions',
            },
            {
              label: 'Slack',
              href: 'https://accounts-js.slack.com',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/accountsjs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} accounts-js`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/accounts-js/accounts/edit/master/website/',
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    require.resolve('docusaurus-plugin-fathom'),
    [
      'docusaurus-plugin-typedoc-api',
      {
        projectRoot: `${__dirname}/..`,
        changelogs: true,
        packages: fs
          .readdirSync(path.resolve(__dirname, '..', 'packages'))
          .map((name) => `packages/${name}`)
          .concat(
            fs
              .readdirSync(path.resolve(__dirname, '..', 'modules'))
              .map((name) => `modules/${name}`)
          ),
        exclude: [
          'packages/database-tests',
          'packages/e2e',
          'packages/error',
          'packages/types',
          'modules/module-magic-link',
          'modules/module-password',
        ],
        typedocOptions: {
          readme: 'none',
          tsconfig: '../tsconfig.json',
          excludeExternals: true,
          excludePrivate: true,
          excludeProtected: true,
          excludeInternal: true,
          externalPattern: '**/node_modules/*',
          cleanOutputDir: true,
        },
      },
    ],
  ],
};
