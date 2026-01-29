/**
 * Example test file to verify Jest setup
 * This can be removed once real tests are added
 */

import { render, screen } from '@testing-library/react';

describe('Example Test', () => {
  it('should render a simple component', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should pass basic math test', () => {
    expect(1 + 1).toBe(2);
  });
});

