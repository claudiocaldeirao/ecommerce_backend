import tseslint from 'typescript-eslint';
import eslintPrettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['.eslintrc.js'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {},
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    plugins: {
      prettier: eslintPrettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
