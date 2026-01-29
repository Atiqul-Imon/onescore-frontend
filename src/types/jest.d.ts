/**
 * Jest DOM type definitions
 * Extends Jest matchers with testing-library/jest-dom matchers
 */

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveValue(value: string | number | string[]): R;
      toBeChecked(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toBeEmptyDOMElement(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveAccessibleDescription(description: string | RegExp): R;
      toHaveAccessibleName(name: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
      toHaveFocus(): R;
      toHaveFormValues(values: Record<string, unknown>): R;
      toHaveStyle(css: string | Record<string, unknown>): R;
      toBePartiallyChecked(): R;
      toHaveDescription(description: string | RegExp): R;
    }
  }
}

export {};

