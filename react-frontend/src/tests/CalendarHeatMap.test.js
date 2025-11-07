import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';

const CalendarHeatmap = require('../components/CalendarHeatMap').default;

jest.mock('axios');

test('CalendarHeatmap fetches data and navigates months', async () => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';

  // Mock response: counts with one date
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const dateStr = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2,'0')}-01`;

  axios.get.mockResolvedValueOnce({ data: { counts: { [dateStr]: 2 } } });

  render(<CalendarHeatmap isFormOpen={false} />);

  await waitFor(() => expect(axios.get).toHaveBeenCalled());

  // Prev button should be present and enabled/disabled depending on MIN_DATE
  const prev = screen.getByText('◀');
  const next = screen.getByText('▶');
  expect(prev).toBeInTheDocument();
  expect(next).toBeInTheDocument();

  // Click prev and next to exercise handlers
  fireEvent.click(prev);
  fireEvent.click(next);
});
