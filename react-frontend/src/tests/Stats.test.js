import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

test('Switch toggles and calls setOutput', () => {
  const setOutput = jest.fn();
  const Switch = require('../components/Switch').default;
  render(<Switch setOutput={setOutput} option1="A" option2="B" />);

  const btn = screen.getByRole('switch');
  fireEvent.click(btn);
  expect(setOutput).toHaveBeenCalledWith(true);
  fireEvent.click(btn);
  expect(setOutput).toHaveBeenCalledWith(false);
});

test('fetchData handles API failure gracefully', async () => {
  mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

  render(<Stats />);

  await waitFor(() => {
    // Check for absence of specific content instead of the entire element
    expect(screen.queryByText('Alice')).not.toBeInTheDocument(); // Example user data
    expect(screen.queryByText('50')).not.toBeInTheDocument(); // Example points data
  });
});

test('subscribeActivity triggers fetchData on activity update', async () => {
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

  // Mock subscribeActivity to ensure it is defined and callable
  const activityBus = require('../lib/activityBus');
  jest.spyOn(activityBus, 'subscribeActivity').mockImplementation((callback) => {
    callback();
    return jest.fn(); // Return a mock unsubscribe function
  });

  render(<Stats />);

  await waitFor(() => {
    expect(screen.getByText('Highest Week Points')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  // Simulate activity update
  activityBus.subscribeActivity.mock.calls[0][0]();

  await waitFor(() => {
    expect(mockedAxios.get).toHaveBeenCalledTimes(3); 
  });

});

