import * as path from 'path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: 'docs',
  title: 'Negation',
  description: 'A lightweight validation library using negative space programming',
  logo: '/logo.png',
  icon: '/favicon.ico',
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/jefe-spain/negation' }
    ],
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          link: '/guide/',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Core Concepts', link: '/guide/core-concepts' },
            { text: 'Installation', link: '/guide/installation' },
          ]
        },
        {
          text: 'Usage',
          link: '/guide/usage',
          items: [
            { text: 'Basic Validation', link: '/guide/basic-validation' },
            { text: 'Object Validation', link: '/guide/object-validation' },
            { text: 'Error Handling', link: '/guide/error-handling' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          link: '/api/',
          items: [
            { text: 'Core Functions', link: '/api/core-functions' },
            { text: 'Constraints', link: '/api/constraints' },
            { text: 'Types', link: '/api/types' },
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          link: '/examples/',
          items: [
            { text: 'Form Validation', link: '/examples/form-validation' },
            { text: 'API Data Validation', link: '/examples/api-data-validation' },
          ]
        }
      ]
    }
  }
});
