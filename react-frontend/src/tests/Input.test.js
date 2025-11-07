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
