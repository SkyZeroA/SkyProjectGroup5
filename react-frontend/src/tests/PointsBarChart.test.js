import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

// Stub recharts primitives to avoid rendering complexity
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => require('react').createElement('div', null, children),
  BarChart: ({ children }) => require('react').createElement('div', null, children),
  Bar: () => require('react').createElement('div', null, 'Bar'),
  XAxis: () => require('react').createElement('div', null),
  YAxis: () => require('react').createElement('div', null),
  CartesianGrid: () => require('react').createElement('div', null),
  Tooltip: () => require('react').createElement('div', null),
  Legend: () => require('react').createElement('div', null),
}));

const PointsBarChart = require('../components/PointsBarChart').default;

beforeEach(() => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';
  if (mockedAxios.get && mockedAxios.get.mockReset) mockedAxios.get.mockReset();
});

test('renders PointsBarChart and fetches data', async () => {
  const sample = [
    { userPoints: 10, averagePoints: 8 },
    { userPoints: 12, averagePoints: 9 },
  ];

  mockedAxios.get.mockResolvedValueOnce({ data: sample });

  render(<PointsBarChart isFormOpen={false} />);

  // Heading should be present
  expect(screen.getByText(/Points Bar Chart/i)).toBeInTheDocument();

  // Toggle monthly/weekly exists as text nodes
  expect(screen.getByText(/Weekly/i)).toBeInTheDocument();
  expect(screen.getByText(/Monthly/i)).toBeInTheDocument();

  // Wait for axios to be called and data to be processed
  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());

  // Click the toggle to change period and ensure it triggers another fetch
  const buttons = screen.getAllByRole('button');
  // first button is the small toggle
  const toggle = buttons[0];
  fireEvent.click(toggle);
  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));
});

test('PointsBarChart toggles period and fetches data', async () => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';
  mockedAxios.get.mockResolvedValue({ data: [{ userPoints: 10, averagePoints: 5 }] });

  render(<PointsBarChart isFormOpen={false} />);

  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());

  // first button is the small toggle in the component
  const buttons = screen.getAllByRole('button');
  const toggle = buttons[0];
  fireEvent.click(toggle);
  expect(mockedAxios.get).toHaveBeenCalled();
});