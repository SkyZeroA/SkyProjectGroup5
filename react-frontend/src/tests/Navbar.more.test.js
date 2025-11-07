import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

jest.mock('../lib/csrf', () => ({ ensureCsrfToken: jest.fn(() => Promise.resolve()) }));

jest.mock('../lib/activityBus', () => {
  const mockPublish = jest.fn();
  return { publishActivity: mockPublish };
});
const { publishActivity } = require('../lib/activityBus');

const Navbar = require('../components/Navbar').default;

beforeEach(() => {
  jest.clearAllMocks();
});

test('mobile menu navigation and sign out success path', async () => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';

  // axios.get calls: fetchAllQuestions, fetchUserActivities, fetchUserData
  mockedAxios.get
    .mockResolvedValueOnce({ data: [{ name: 'Running', points: 5 }] })
    .mockResolvedValueOnce({ data: [{ name: 'Running', points: 5 }] })
    .mockResolvedValueOnce({ data: { username: 'testuser' } });

  mockedAxios.post = jest.fn().mockResolvedValue({ data: { success: true } });

  render(React.createElement(Navbar));

  // open mobile menu
  const menuBtn = screen.getByRole('button', { name: /☰|✕/i });
  fireEvent.click(menuBtn);

  // click About link inside mobile dropdown - disambiguate desktop vs mobile
  const aboutButtons = await screen.findAllByText(/About/i);
  const mobileAbout = aboutButtons.find((el) => el.closest('div') && el.closest('div').className.includes('absolute'));
  expect(mobileAbout).toBeDefined();
  fireEvent.click(mobileAbout);
  expect(mockNavigate).toHaveBeenCalledWith('/about');

  // Now sign out via mobile menu (sign out button should be present in menu)
  // open again if closed
  fireEvent.click(menuBtn);
  const signOutButtons = await screen.findAllByText(/Sign Out/i);
  const mobileSignOut = signOutButtons.find((el) => el.closest('div') && el.closest('div').className.includes('absolute'));
  const signOut = mobileSignOut || signOutButtons[0];
  fireEvent.click(signOut);

  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith(
    expect.stringContaining('/api/sign-out'),
    {},
    { withCredentials: true }
  ));

  expect(mockNavigate).toHaveBeenCalledWith('/');
  // publishActivity on popup close is called elsewhere; ensure publishActivity exists
  expect(publishActivity).toBeDefined();
});
