import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

// Mock subscribeActivity to immediately invoke callback so fetchData is exercised
jest.mock('../lib/activityBus', () => {
  return { subscribeActivity: (cb) => { cb(); return () => {}; } };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Link: ({ to, children, ...rest }) => React.createElement('a', { 'data-to': to, ...rest }, children),
    useNavigate: () => mockNavigate,
  };
});

const Dashboard = require('../screens/Dashboard').default;

beforeEach(() => jest.clearAllMocks());

test('fetch dashboard and initial tips show and replaceTip updates tip', async () => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';

  // dashboard response
  mockedAxios.get = jest.fn((url) => {
    if (url.includes('/api/dashboard')) {
      return Promise.resolve({ data: {
        weekLeaderboard: [{ name: 'Harry', score: 10, avatarFilename: null }],
        monthLeaderboard: [{ name: 'Sally', score: 8, avatarFilename: null }],
        username: 'Harry',
        totalCarbon: 200,
        projectedCarbon: 250,
        currentCarbon: 180
      }});
    }
    if (url.includes('/api/initial-ai-tips')) {
      return Promise.resolve({ data: { tips: ['Tip one'] } });
    }
    if (url.includes('/api/ai-tip')) {
      return Promise.resolve({ data: { tip: 'Replaced tip' } });
    }
    return Promise.resolve({ data: {} });
  });

  render(React.createElement(Dashboard));

  // Wait for totalProjectedCarbon text to appear
  expect(await screen.findByText(/projected to be responsible for/i)).toBeInTheDocument();

  // Tip should render
  expect(await screen.findByText('Tip one')).toBeInTheDocument();

  // Click delete on TipCard to trigger replaceTip
  const deleteBtn = screen.getByLabelText('Delete Tip');
  fireEvent.click(deleteBtn);

  // After replacement, new tip text appears
  await waitFor(() => expect(screen.getByText('Replaced tip')).toBeInTheDocument());
});

test('fetchData failure navigates to questionnaire', async () => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';

  // Make dashboard fetch fail
  mockedAxios.get = jest.fn((url) => {
    if (url.includes('/api/dashboard')) return Promise.reject(new Error('network'));
    if (url.includes('/api/initial-ai-tips')) return Promise.resolve({ data: { tips: [] } });
    return Promise.resolve({ data: {} });
  });

  render(React.createElement(Dashboard));

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/questionnaire'));
});
