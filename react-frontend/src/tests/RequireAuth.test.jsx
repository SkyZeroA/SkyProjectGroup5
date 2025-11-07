import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

// Mock react-router Navigate and useLocation for assertions
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Navigate: ({ to }) => React.createElement('div', { 'data-testid': 'redirect', 'data-navigate-to': to }),
    useLocation: () => ({ pathname: '/attempted' }),
  };
});

const RequireAuth = require('../components/RequireAuth').default;

test('renders children when authenticated', async () => {
  mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: { username: 'bob' } });

  render(
    React.createElement(RequireAuth, null, React.createElement('div', null, 'Protected'))
  );

  // Wait for child to appear after auth resolves
  expect(await screen.findByText('Protected')).toBeInTheDocument();
});

test('redirects to sign-in when not authenticated', async () => {
  mockedAxios.get = jest.fn().mockRejectedValueOnce(new Error('no session'));

  render(
    React.createElement(RequireAuth, null, React.createElement('div', null, 'Protected'))
  );

  // Navigate mock renders a div with data-navigate-to
  const redirect = await screen.findByTestId('redirect');
  expect(redirect.getAttribute('data-navigate-to')).toBe('/');
});
