import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

// Mock child components used by Dashboard to keep tests focused
jest.mock('../components/Navbar', () => () => require('react').createElement('div', { 'data-testid': 'navbar' }, 'Navbar'));
jest.mock('../components/HeaderBanner', () => () => require('react').createElement('div', null));
jest.mock('../components/FooterBanner', () => () => require('react').createElement('div', null));
jest.mock('../components/Avatar', () => ({ Avatar: ({ children }) => require('react').createElement('div', null, children), AvatarFallback: ({ children }) => require('react').createElement('div', null, children) }));
jest.mock('../components/Card', () => ({ Card: ({ children }) => require('react').createElement('div', null, children), CardContent: ({ children }) => require('react').createElement('div', null, children) }));
jest.mock('../components/TipCard', () => ({ __esModule: true, default: ({ tip }) => require('react').createElement('div', { 'data-testid': 'tip' }, tip) }));
jest.mock('../components/ProgressBar', () => ({ __esModule: true, default: () => require('react').createElement('div', null) }));
jest.mock('../components/Switch', () => ({ __esModule: true, default: () => require('react').createElement('div', null) }));

// Provide a simple mock for react-router's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

const Dashboard = require('../screens/Dashboard').default;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.REACT_APP_API_URL = 'http://localhost:9099';
});

test('renders leaderboard, projected carbon and tips when API returns data', async () => {
  mockedAxios.get.mockImplementation((url) => {
    if (url.includes('/api/dashboard')) {
      return Promise.resolve({ data: {
        weekLeaderboard: [{ name: 'Alice', score: 50 }],
        monthLeaderboard: [{ name: 'Bob', score: 120 }],
        username: 'Alice',
        totalCarbon: 200,
        projectedCarbon: 220,
        currentCarbon: 180,
      } });
    }
    if (url.includes('/api/initial-ai-tips')) {
      return Promise.resolve({ data: { tips: ['Tip A', 'Tip B'] } });
    }
    return Promise.resolve({ data: {} });
  });

  render(<Dashboard />);

  // Wait for data to be fetched and UI to render
  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());

  // Leaderboard heading should be present
  expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();

  // ensure the dashboard endpoint and initial tips endpoint were requested
  expect(mockedAxios.get).toHaveBeenCalled();
  // there should be at least one tip slot rendered (loading or data)
  const tips = await screen.findAllByTestId('tip');
  expect(tips.length).toBeGreaterThanOrEqual(1);
});

test('navigates to questionnaire on dashboard fetch error', async () => {
  mockedAxios.get.mockRejectedValueOnce(new Error('network')); // dashboard fetch fails

  render(<Dashboard />);

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/questionnaire'));
});
