import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const Popup = require('../components/PopUp').default;

test('renders null when closed and shows questions when open; increment/decrement and submit', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();
  const questions = ['Q1', 'Q2'];

  // closed -> nothing rendered
  const { rerender } = render(
    <Popup isOpen={false} onClose={onClose} questions={questions} onSubmit={onSubmit} />
  );

  expect(screen.queryByText(/Log Your Activities/i)).toBeNull();

  // open -> render form
  rerender(
    <Popup isOpen={true} onClose={onClose} questions={questions} onSubmit={onSubmit} />
  );

  expect(screen.getByText(/Log Your Activities/i)).toBeInTheDocument();
  expect(screen.getByText('Q1')).toBeInTheDocument();

  const plusButtons = screen.getAllByText('+');
  const minusButtons = screen.getAllByText('−');

  // increment Q1
  fireEvent.click(plusButtons[0]);
  expect(screen.getAllByText('1')[0]).toBeInTheDocument();

  // decrement Q1 -> back to 0 (prevent negative)
  fireEvent.click(minusButtons[0]);
  expect(screen.getAllByText('0')[0]).toBeInTheDocument();

  // submit
  fireEvent.click(screen.getByText(/Submit/i));
  expect(onSubmit).toHaveBeenCalled();
  expect(onClose).toHaveBeenCalled();
});
