/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ActionButton } from '@/components/ui/ActionButton';

describe('ActionButton Component', () => {
  it('renders children text correctly', () => {
    render(<ActionButton>Click Me</ActionButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies the disabled attribute when disabled prop is true', () => {
    render(<ActionButton disabled>Disabled Button</ActionButton>);
    expect(screen.getByRole('button', { name: /disabled button/i })).toBeDisabled();
  });

  it('renders a loading spinner and disables the button when loading is true', () => {
    render(<ActionButton loading>Submit</ActionButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders custom icon if provided', () => {
    const testIcon = <span data-testid="custom-icon">🔥</span>;
    render(<ActionButton icon={testIcon}>Action</ActionButton>);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
