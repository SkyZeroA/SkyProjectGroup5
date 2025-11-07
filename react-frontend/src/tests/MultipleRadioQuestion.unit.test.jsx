import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const MultiSelectQuestion = require('../components/MultipleRadioQuestion').default;

test('adds an option when unchecked', () => {
  const options = [
    { value: '0', label: 'Zero' },
    { value: '1', label: 'One' },
  ];
  const setCurrent = jest.fn();

  render(<MultiSelectQuestion options={options} current={[]} setCurrent={setCurrent} question="Q" />);
  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[0]);
  expect(setCurrent).toHaveBeenCalledWith(['0']);
});

test('removes an option when already checked', () => {
  const options = [
    { value: '0', label: 'Zero' },
    { value: '1', label: 'One' },
  ];
  const setCurrent2 = jest.fn();
  render(<MultiSelectQuestion options={options} current={['0']} setCurrent={setCurrent2} question="Q" />);
  const cb2 = screen.getAllByRole('checkbox')[0];
  fireEvent.click(cb2);
  expect(setCurrent2).toHaveBeenCalledWith([]);
});
