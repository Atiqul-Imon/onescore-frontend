module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier', // Must be last to override other configs
  ],
  ignorePatterns: ['node_modules/', '.next/', 'dist/', 'coverage/', 'playwright-report/'],
  plugins: ['@typescript-eslint', 'testing-library'],
  rules: {
    // TypeScript rules - gradually enforce
    '@typescript-eslint/no-explicit-any': 'warn', // Changed from 'off' to 'warn'
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off', // Too strict for now
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // React rules
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off', // Using TypeScript for prop validation
    
    // Next.js rules
    '@next/next/no-img-element': 'warn', // Changed from 'off' to 'warn'
    '@next/next/no-html-link-for-pages': 'warn', // Changed from 'off' to 'warn'
    
    // Code quality rules
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log, allow console.warn/error
    'prefer-const': 'warn',
    'no-var': 'error',
    'object-shorthand': 'warn',
    'prefer-arrow-callback': 'warn',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      extends: ['plugin:testing-library/react'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests
      },
    },
  ],
};
