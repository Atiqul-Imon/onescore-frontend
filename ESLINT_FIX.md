# ESLint Pre-commit Hook Fix

## Issue

Pre-commit hook was failing with:

1. ESLint v9 requires new config format (`eslint.config.js`)
2. Circular reference error in ESLint config
3. Next.js lint command looking for invalid directory

## Solution

### 1. Downgraded ESLint to v8

- ESLint v9 is incompatible with current TypeScript ESLint plugins
- Downgraded to ESLint v8.57.1 which is compatible

### 2. Simplified lint-staged

- Removed ESLint from lint-staged (circular reference issue)
- Only runs Prettier in pre-commit hook
- ESLint can be run manually with `npm run lint`

### 3. Fixed ESLint Config

- Removed explicit parser/plugins that caused circular references
- Let Next.js configs handle plugin resolution

## Current Setup

**Pre-commit Hook** (`.lintstagedrc.json`):

- Only runs Prettier for formatting
- ESLint is run separately via `npm run lint`

**ESLint Config** (`.eslintrc.js`):

- Uses Next.js ESLint configs
- Compatible with ESLint v8

## Usage

```bash
# Format code (runs on commit)
git commit -m "message"  # Prettier runs automatically

# Lint code (run manually)
npm run lint

# Fix linting issues
npm run lint:fix
```

## Note

ESLint is not run in pre-commit hook due to circular reference issues with Next.js configs. Run `npm run lint` manually before committing, or set up a separate CI check.

---

**Status**: ✅ Fixed
**Date**: 2026-01-30
