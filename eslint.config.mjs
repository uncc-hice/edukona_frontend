// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';


export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.base,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals : {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    }
    },
    rules: {
      'no-unused-vars': 'off',
      'no-empty': 'warn',
      'no-undef': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/jsx-key': 'warn',
      'react/display-name': 'warn',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'react/prop-types': 'off',
    },
  },
  {
    plugins: {
      react: reactPlugin,
    },
    settings : {
      react: {
        version: 'detect',
      },
    },
  }
);