import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const Input = require('../components/Input').default;

test('Input shows label and responds to focus/blur', () => {
  render(<Input id="i1" label="Email" value="" onChange={() => {}} />);
  expect(screen.getByText('Email')).toBeInTheDocument();

  const input = screen.getByRole('textbox');
  fireEvent.focus(input);
  fireEvent.blur(input);
});

test('Input toggles password visibility', () => {
  const onPasswordToggle = jest.fn();
  render(
    <Input
      id="password"
      type="password"
      showPasswordToggle={true}
      onPasswordToggle={onPasswordToggle}
    />
  );

  const toggleButton = screen.getByRole('button', { name: /Show password/i });
  expect(toggleButton).toBeInTheDocument();

  // Click to toggle visibility
  fireEvent.click(toggleButton);
  expect(onPasswordToggle).toHaveBeenCalled();
});

test('Input displays error message on blur', () => {
  render(
    <Input
      id="email"
      label="Email"
      value=""
      showError={true}
      errorMessage="This field is required"
    />
  );

  const input = screen.getByRole('textbox');
  fireEvent.focus(input);
  fireEvent.blur(input);

  expect(screen.getByText('This field is required')).toBeInTheDocument();
});

test('Input label moves on focus and value', () => {
  render(<Input id="name" label="Name" value="" />);

  const label = screen.getByText('Name');
  const input = screen.getByRole('textbox');

  // Initially, label should be centered
  expect(label).toHaveClass('top-1/2');

  // Focus input
  fireEvent.focus(input);
  expect(label).toHaveClass('-top-2');

  // Provide value
  fireEvent.change(input, { target: { value: 'John' } });
  expect(label).toHaveClass('-top-2');
});

test('Input calls onFocus and onBlur handlers', () => {
  const onFocus = jest.fn();
  const onBlur = jest.fn();

  render(<Input id="custom" onFocus={onFocus} onBlur={onBlur} />);

  const input = screen.getByRole('textbox');
  fireEvent.focus(input);
  fireEvent.blur(input);

  expect(onFocus).toHaveBeenCalled();
  expect(onBlur).toHaveBeenCalled();
});
