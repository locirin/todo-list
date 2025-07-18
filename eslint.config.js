import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react'; //added import statement
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    settings: { react: { version: 'detect' } }, //added settings
    // plugins object was missing, so adding it here
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules, // added
      ...react.configs.recommended.rules, // added
      ...react.configs['jsx-runtime'].rules, // added

      'no-unused-vars': 'warn', //this changes the error to a warning
      'react/prop-types': 'off', //this suppresses warnings about not using prop types
    },
  },
]);
