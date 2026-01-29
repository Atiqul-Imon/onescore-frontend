# Components Documentation

This directory contains all React components for the application.

## Directory Structure

```
components/
├── admin/          # Admin panel components
├── auth/           # Authentication components
├── cricket/        # Cricket-specific components
├── football/       # Football-specific components
├── layout/         # Layout components (Header, Footer, etc.)
├── news/           # News/article components
├── sections/       # Page section components
├── threads/        # Thread/comment components
└── ui/             # Reusable UI components
```

## Component Guidelines

### 1. Component Structure

All components should follow this structure:

```tsx
/**
 * Component description
 * 
 * @example
 * ```tsx
 * <ComponentName prop1="value" prop2={value} />
 * ```
 */
'use client'; // If using client-side features

import { ... } from '...';

interface ComponentProps {
  /** Prop description */
  prop1: string;
  /** Optional prop description */
  prop2?: number;
}

/**
 * ComponentName - Brief description
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Component implementation
}
```

### 2. Props Documentation

- Always define TypeScript interfaces for props
- Add JSDoc comments for each prop
- Use descriptive prop names
- Mark optional props with `?`

### 3. Component Organization

- **One component per file**
- **Named exports** (not default exports)
- **Co-locate related files** (styles, tests, types)

### 4. Best Practices

- Use TypeScript for all props
- Handle loading and error states
- Use semantic HTML
- Follow accessibility guidelines
- Use Tailwind CSS for styling
- Keep components focused and small
- Extract reusable logic to hooks

## Component Categories

### UI Components (`/ui`)
Reusable, generic UI components:
- `Button`, `Card`, `Input`, `Select`, etc.
- Should be framework-agnostic where possible
- Well-documented with examples

### Layout Components (`/layout`)
Page structure components:
- `Header`, `Footer`, `PageLayout`
- Navigation components
- Conditional layouts

### Feature Components
Domain-specific components:
- `cricket/` - Cricket match components
- `football/` - Football match components
- `news/` - News/article components
- `threads/` - Discussion components

### Section Components (`/sections`)
Large page sections:
- `HeroSection`, `LiveMatchesSection`
- Usually composed of smaller components

## Usage Examples

### Basic Component
```tsx
import { Button } from '@/components/ui/Button';

<Button onClick={handleClick}>Click me</Button>
```

### Component with Props
```tsx
import { Card } from '@/components/ui/Card';

<Card title="Title" description="Description" />
```

## Testing

All components should have:
- Unit tests (Jest + React Testing Library)
- Accessibility tests
- Visual regression tests (optional)

## Contributing

When adding new components:
1. Follow the structure guidelines
2. Add JSDoc documentation
3. Write tests
4. Update this README if needed
5. Use TypeScript strict mode

