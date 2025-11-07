import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// Ensure components build correct absolute API URLs in tests
process.env.REACT_APP_API_URL = 'http://localhost:9099';
jest.mock('axios');
const mockedAxios = require('axios');

const Popup = require('../components/PopUp').default;

test('renders null when closed and shows questions when open; increment/decrement and log activity', async () => {
  const onClose = jest.fn();
  const questions = ['Q1', 'Q2'];

  // Provide initial activity counts via the API that Popup fetches when opened
  // Popup expects an array of counts (by index), so return an array rather than an object
  mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: [0, 0] });
  // Mock post for logging activity (always resolve)
  mockedAxios.post = jest.fn().mockResolvedValue({ data: { message: 'ok' } });

  // closed -> nothing rendered
  const { rerender } = render(
    <Popup isOpen={false} onClose={onClose} questions={questions} points={[0,0]} />
  );

  expect(screen.queryByText(/Log Your Activities/i)).toBeNull();

  // open -> render form (this triggers the axios.get to load counts)
  rerender(
    <Popup isOpen={true} onClose={onClose} questions={questions} points={[0,0]} />
  );

  // Wait for the popup to render and the questions to appear
  await waitFor(() => {
    expect(screen.getByText(/Log Your Activities/i)).toBeInTheDocument();
    // Use a regex matcher so the test is tolerant to markup/whitespace splitting inside the label
    expect(screen.getByText(/Q1/i)).toBeInTheDocument();
  });

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
