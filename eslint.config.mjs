import stylistic from '@stylistic/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

/**
 * TypeScript's recommended rules and the essential Vue set catch the mistakes. Formatting is left
 * alone except for one rule kept across these projects: no trailing commas, anywhere.
 */
export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.netlify/**', '.claude/**']
  },
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/comma-dangle': ['error', 'never']
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      'vue/no-template-shadow': 'error',
      'vue/comma-dangle': ['error', 'never'],
      // Mock components are named after the app they draw (Gemini, Claude, WhatsApp).
      'vue/multi-word-component-names': 'off'
    }
  }
);
