import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const Multi = require('../components/MultipleRadioQuestion').default;

test('MultipleRadioQuestion toggles options and calls setCurrent', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ];
  const setCurrent = jest.fn();
  render(<Multi options={options} current={[]} setCurrent={setCurrent} question={'Q'} />);

  expect(screen.getByText('Q')).toBeInTheDocument();
  const checkbox = screen.getByLabelText('Option A');
  fireEvent.click(checkbox);
  expect(setCurrent).toHaveBeenCalled();
});
