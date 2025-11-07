import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

// Stub layout components so tests focus on Stats logic
jest.mock('../components/HeaderBanner', () => () => require('react').createElement('div', null, 'HeaderBanner'));
jest.mock('../components/FooterBanner', () => () => require('react').createElement('div', null, 'FooterBanner'));
jest.mock('../components/Navbar', () => () => require('react').createElement('div', null, 'Navbar'));
// Stub charts so they don't perform their own network requests
jest.mock('../components/MyPieChart', () => () => require('react').createElement('div', null, 'MyPieChart'));
jest.mock('../components/CalendarHeatMap', () => () => require('react').createElement('div', null, 'CalendarHeatMap'));
jest.mock('../components/UserRankChart', () => () => require('react').createElement('div', null, 'UserRankChart'));
jest.mock('../components/PointsBarChart', () => () => require('react').createElement('div', null, 'PointsBarChart'));

const Stats = require('../screens/Stats').default;

beforeEach(() => {
  if (mockedAxios.get && mockedAxios.get.mockReset) mockedAxios.get.mockReset();
});

test('renders stats summary cards with data from API', async () => {
  const mockData = {
    weekLeaderboard: [{ name: 'Alice', score: 50 }],
    monthLeaderboard: [{ name: 'Bob', score: 120 }],
    transportEmissions: 10,
    dietEmissions: 5,
    heatingEmissions: 2,
    highestWeekUser: 'Alice',
    highestWeekPoints: 50,
    highestMonthUser: 'Bob',
    highestMonthPoints: 120,
    userBestWeek: 40,
    userBestMonth: 110,
  };

  mockedAxios.get.mockResolvedValueOnce({ data: mockData });

  render(<Stats />);

  await waitFor(() => {
    expect(screen.getByText(/Projected Emissions Breakdown/i)).toBeInTheDocument();
    // right column summary values (use exact string queries where headings are similar)
    expect(screen.getByText('Highest Week Points')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Highest Month Points')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Your Highest Week Points')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });
});
