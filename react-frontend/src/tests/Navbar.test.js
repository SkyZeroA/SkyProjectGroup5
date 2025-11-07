import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock Popup to avoid rendering the real form
jest.mock('../components/PopUp', () => () => require('react').createElement('div', { 'data-testid': 'popup' }, 'PopupMock'));

// Mock Button to render a normal button for simpler interaction
jest.mock('../components/Button', () => ({
  Button: ({ children, onClick, ...rest }) => require('react').createElement('button', { onClick, ...rest }, children),
}));

// Mock activityBus publish to avoid side effects
jest.mock('../lib/activityBus', () => ({ publishActivity: jest.fn() }));

const Navbar = require('../components/Navbar').default;

beforeEach(() => {
  jest.clearAllMocks();
});

test('sign out calls API and navigates on success', async () => {
  // axios.get calls: fetchAllQuestions, fetchUserActivities, fetchUserData
  mockedAxios.get
    .mockResolvedValueOnce({ data: [{ name: 'a', points: 1 }, { name: 'b', points: 2 }] })
    .mockResolvedValueOnce({ data: [{ name: 'a', points: 1 }] })
    .mockResolvedValueOnce({ data: { username: 'bob' } });

  mockedAxios.post = jest.fn().mockResolvedValueOnce({}); // sign-out

  render(<Navbar />);

  // Wait for username to appear in the DOM (userLinks shows username)
  await waitFor(() => expect(screen.getByText(/bob/i)).toBeInTheDocument());

  const signOutBtn = screen.getByText(/Sign Out/i);
  fireEvent.click(signOutBtn);

  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());
  expect(mockNavigate).toHaveBeenCalledWith('/');
});

test('sign out error logs and does not navigate', async () => {
  mockedAxios.get
    .mockResolvedValueOnce({ data: [{ name: 'a', points: 1 }] })
    .mockResolvedValueOnce({ data: [{ name: 'a', points: 1 }] })
    .mockResolvedValueOnce({ data: { username: 'sue' } });

  mockedAxios.post = jest.fn().mockRejectedValueOnce(new Error('signout failed'));

  const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(<Navbar />);

  await waitFor(() => expect(screen.getByText(/sue/i)).toBeInTheDocument());

  fireEvent.click(screen.getByText(/Sign Out/i));

  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());
  expect(mockNavigate).not.toHaveBeenCalled();
  expect(errSpy).toHaveBeenCalled();
  errSpy.mockRestore();
});
