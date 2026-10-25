import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  { settings: { next: { rootDir: 'apps/web/' } } },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      'import/no-cycle': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/content-api/**', '**/ai-api/**'],
              message:
                'Use a published API contract instead of service internals.',
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    '**/.next/**',
    '**/out/**',
    '**/next-env.d.ts',
    '**/coverage/**',
    'playwright-report/**',
    'test-results/**',
  ]),
]);
