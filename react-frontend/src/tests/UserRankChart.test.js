import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

// Stub recharts to avoid DOM complexity
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => require('react').createElement('div', null, children),
  LineChart: ({ children }) => require('react').createElement('div', null, children),
  Line: () => require('react').createElement('div', null),
  XAxis: () => require('react').createElement('div', null),
  YAxis: () => require('react').createElement('div', null),
  CartesianGrid: () => require('react').createElement('div', null),
  Tooltip: () => require('react').createElement('div', null),
}));

const UserRankChart = require('../components/UserRankChart').default;

beforeEach(() => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';
  if (mockedAxios.get && mockedAxios.get.mockReset) mockedAxios.get.mockReset();
});

test('renders UserRankChart and fetches ranks', async () => {
  const today = new Date();
  const dstr = today.toISOString().slice(0, 10);
  mockedAxios.get.mockResolvedValueOnce({ data: { ranks: [{ date: dstr, rank: 2 }] } });

  const setIsOn = jest.fn();
  render(<UserRankChart isOn={false} setIsOn={setIsOn} isFormOpen={false} />);

  expect(screen.getByText(/Leaderboard Position/i)).toBeInTheDocument();

  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());

  // Prev and Next buttons exist; try clicking prev
  const prev = screen.getAllByRole('button').find(b => b.textContent && b.textContent.includes('◀'));
  expect(prev).toBeDefined();
  fireEvent.click(prev);
});


test('UserRankChart fetches ranks and navigates', async () => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';

  // Return a ranks array for weekly period
  mockedAxios.get.mockResolvedValue({ data: { ranks: [{ date: '2025-01-01', rank: 1 }] } });

  render(<UserRankChart isOn={true} setIsOn={() => {}} isFormOpen={false} />);

  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());

  const prev = screen.getByText('◀');
  const next = screen.getByText('▶');
  fireEvent.click(prev);
  fireEvent.click(next);
});
