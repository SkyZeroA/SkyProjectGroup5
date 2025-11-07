import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock ensureCsrfToken
jest.mock('../lib/csrf', () => ({ ensureCsrfToken: jest.fn(() => Promise.resolve()) }));

// Mock activityBus.publishActivity inside the factory and grab the mock after
jest.mock('../lib/activityBus', () => {
  const mockPublish = jest.fn();
  return { publishActivity: mockPublish };
});
const { publishActivity: publishMock } = require('../lib/activityBus');

// Mock PopUp to call onActivitiesSave when isOpen true to simulate a save flow
jest.mock('../components/PopUp', () => ({
  __esModule: true,
  default: ({ isOpen, onActivitiesSave }) => {
    const React = require('react');
    React.useEffect(() => {
      if (isOpen && onActivitiesSave) {
        // simulate user selecting activities and saving
        onActivitiesSave(['Cycling']);
      }
    }, [isOpen, onActivitiesSave]);
    return React.createElement('div', { 'data-testid': 'popup-mock' }, isOpen ? 'open' : 'closed');
  }
}));

const Navbar = require('../components/Navbar').default;

beforeEach(() => {
  jest.clearAllMocks();
});

test('handleActivitySave posts activities and publishes update', async () => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';

  // axios.get calls: fetchAllQuestions, fetchUserActivities
  mockedAxios.get
    .mockResolvedValueOnce({ data: [{ name: 'Cycling', points: 10 }] })
    .mockResolvedValueOnce({ data: [{ name: 'Cycling', points: 10 }] })
    .mockResolvedValueOnce({ data: { username: 'bob' } });

  // axios.post for update-user-activities
  mockedAxios.post = jest.fn().mockResolvedValueOnce({ data: { success: true } });

  render(React.createElement(Navbar));

  // Open popup by clicking the Log your Activities button
  const logBtn = await screen.findByText(/Log your Activities/i);
  fireEvent.click(logBtn);

  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith(
    expect.stringContaining('/api/update-user-activities'),
    { activities: ['Cycling'] },
    { withCredentials: true }
  ));

  // publishActivity should be called via our mock
  expect(publishMock).toHaveBeenCalledWith(expect.objectContaining({ source: 'navbar' }));
});

test('sign out failure logs error and does not navigate', async () => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';

  mockedAxios.get
    .mockResolvedValueOnce({ data: [{ name: 'a', points: 1 }] })
    .mockResolvedValueOnce({ data: [{ name: 'a', points: 1 }] })
    .mockResolvedValueOnce({ data: { username: 'sue' } });

  mockedAxios.post = jest.fn().mockRejectedValueOnce(new Error('signout failed'));

  const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(React.createElement(Navbar));

  // Wait for username then click Sign Out
  await waitFor(() => expect(screen.getByText(/sue/i)).toBeInTheDocument());
  const signOut = screen.getAllByText(/Sign Out/i)[0];
  fireEvent.click(signOut);

  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());
  expect(mockNavigate).not.toHaveBeenCalledWith('/');
  expect(errSpy).toHaveBeenCalled();
  errSpy.mockRestore();
});
