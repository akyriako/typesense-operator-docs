import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'TyKO',
  tagline: 'your turnkey Typesense Kubernetes Operator',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://typesense-operator-docs.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'akyriako', // Usually your GitHub org/user name.
  projectName: 'typesense-operator-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap'
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/tyko-logo.png',
    navbar: {
      title: 'Typesense Kubernetes Operator',
      logo: {
        alt: 'My Site Logo',
        src: 'img/tyko-logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Releases', position: 'left'},
        // {
        //   type: 'docsVersionDropdown',
        //   position: 'right'
        // },
        { 
          href: 'https://github.com/akyriako/typesense-operator', 
          position: 'right',
          className: 'navbar--github-link',
          "aria-label": 'GitHub',
        },
      ],
    },
    // footer: {
    //   style: 'dark',
    //   links: [
    //     // {
    //     //   title: 'Docs',
    //     //   items: [
    //     //     {
    //     //       label: 'Installation',
    //     //       to: '/docs/installation',
    //     //     },
    //     //   ],
    //     // },
    //     // {
    //     //   title: 'More',
    //     //   items: [
    //     //     {
    //     //       label: 'Blog',
    //     //       to: '/blog',
    //     //     },
    //     //     {
    //     //       label: 'GitHub',
    //     //       href: 'https://github.com/facebook/docusaurus',
    //     //     },
    //     //   ],
    //     // },
    //   ],
    //   // copyright: `${new Date().getFullYear()}, Built with Docusaurus`,
    // },
    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
