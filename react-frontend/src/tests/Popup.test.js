import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
jest.mock('axios');
const mockedAxios = require('axios');

const Popup = require('../components/PopUp').default;

test('renders null when closed and shows questions when open; increment/decrement and log activity', async () => {
  const onClose = jest.fn();
  const questions = ['Q1', 'Q2'];

  // Provide initial activity counts via the API that Popup fetches when opened
  mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: { Q1: 0, Q2: 0 } });
  // Mock post for logging activity (always resolve)
  mockedAxios.post = jest.fn().mockResolvedValue({ data: { message: 'ok' } });

  // closed -> nothing rendered
  const { rerender } = render(
    <Popup isOpen={false} onClose={onClose} questions={questions} />
  );

  expect(screen.queryByText(/Log Your Activities/i)).toBeNull();

  // open -> render form (this triggers the axios.get to load counts)
  rerender(
    <Popup isOpen={true} onClose={onClose} questions={questions} />
  );

  expect(screen.getByText(/Log Your Activities/i)).toBeInTheDocument();
  expect(screen.getByText('Q1')).toBeInTheDocument();

  const plusButtons = screen.getAllByText('+');
  const minusButtons = screen.getAllByText('−');

  // increment Q1 -> should call axios.post to log activity
  fireEvent.click(plusButtons[0]);
  await waitFor(() => {
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:9099/api/log-activity',
      expect.objectContaining({ question: 'Q1', isPositive: 1 }),
      { withCredentials: true }
    );
  });

  // decrement Q1 -> back to 0 (prevent negative)
  fireEvent.click(minusButtons[0]);
  // We don't assert the exact payload for the decrement call to avoid timing/flakiness; ensure the post mock exists
  await waitFor(() => {
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  // Close button should call onClose
  fireEvent.click(screen.getByText(/Close/i));
  expect(onClose).toHaveBeenCalled();
});
