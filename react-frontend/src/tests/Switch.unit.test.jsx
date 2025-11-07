import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const Switch = require('../components/Switch').default;

test('clicking the switch toggles output and keyboard Enter toggles', () => {
  const setOutput = jest.fn();
  render(<Switch setOutput={setOutput} option1={[]} option2={[]} />);

  const btn = screen.getByRole('switch');
  // initial click -> true
  fireEvent.click(btn);
  expect(setOutput).toHaveBeenCalledWith(true);

  // simulate Enter key to toggle back
  fireEvent.keyDown(btn, { key: 'Enter' });
  expect(setOutput).toHaveBeenCalledWith(false);
});
