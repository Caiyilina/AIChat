import tseslint from '@electron-toolkit/eslint-config-ts'
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'

export default tseslint.config(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  tseslint.configs.recommended,
  eslintPluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      '@electron-toolkit',
      '@electron-toolkit/eslint-config-ts/eslint-recommended',
      '@vue/eslint-config-typescript/recommended',
      '@vue/eslint-config-prettier'
    ],
    rules: {
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-require-imports': 'off',

    }
  },
  eslintConfigPrettier
)
