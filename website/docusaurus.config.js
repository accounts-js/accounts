/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'accounts-js',
  tagline: 'Fullstack authentication and accounts-management for Javascript',
  url: 'https://www.accountsjs.com',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'accounts-js',
  projectName: 'accounts-js',
  customFields: {
    repoUrl: 'https://github.com/accounts-js/accounts',
  },
  themeConfig: {
    algolia: {
      apiKey: 'c872074b5f5ecd186d94d7c19b27d757',
      indexName: 'accounts',
    },
    fathomAnalytics: {
      siteId: 'NZPJJZTJ',
      customDomain: 'https://goose.accountsjs.com',
    },
    navbar: {
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.png',
      },
      links: [
        { to: 'docs/introduction', label: 'Documentation', position: 'right' },
        {
          to: 'docs/api/server/index',
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
          title: 'Community',
          items: [
            {
              label: 'Spectrum',
              href: 'https://spectrum.chat/accounts-js',
            },
            {
              label: 'Slack',
              href: 'https://accounts-js.slack.com',
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
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: ['docusaurus-plugin-fathom'],
};
