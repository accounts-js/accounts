// @ts-check
const { readdirSync } = require('fs');
const { resolve } = require('path');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// Select entry points for typedoc
const packagesDir = resolve(__dirname, '..', 'packages');
let dirs = readdirSync(packagesDir);
// Do not build the docs for these packages
const excludeDirs = ['database-tests', 'e2e', 'error', 'types'];
// Do not build the docs for these packages
dirs = dirs.filter((dir) => !excludeDirs.includes(dir));
dirs = dirs.map((dir) => resolve(packagesDir, dir));

/** @type {import('@docusaurus/types').Config} */
const config = {
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
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        apiKey: 'c872074b5f5ecd186d94d7c19b27d757',
        indexName: 'accounts',
      },
      fathomAnalytics: {
        siteId: 'NZPJJZTJ',
        customDomain: 'https://goose.accountsjs.com',
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      navbar: {
        logo: {
          alt: 'accounts.js logo',
          src: 'img/logo.png',
        },

        items: [
          { to: 'docs/introduction', label: 'Documentation', position: 'right' },
          {
            to: 'docs/api/',
            activeBasePath: 'docs',
            label: 'Api reference',
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
                to: '/docs/api/server/index',
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
    }),
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/accounts-js/accounts/edit/master/website/',
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    require.resolve('docusaurus-plugin-fathom'),
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: dirs,
        entryPointStrategy: 'Packages',
        excludePrivate: true,
        sidebar: {
          fullNames: true,
        },
      },
    ],
  ],
};

module.exports = config;
