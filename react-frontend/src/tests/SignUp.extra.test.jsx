import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

jest.mock('../lib/csrf', () => ({ ensureCsrfToken: jest.fn() }));
const { ensureCsrfToken } = require('../lib/csrf');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

const SignUp = require('../screens/SignUp').default;

// Mock UI subcomponents used by SignUp to keep test focused on form logic
jest.mock('../components/HeaderBanner', () => () => require('react').createElement('div', null));
jest.mock('../components/FooterBanner', () => () => require('react').createElement('div', null));
jest.mock('../components/Card', () => ({ Card: ({ children }) => require('react').createElement('div', null, children), CardContent: ({ children }) => require('react').createElement('div', null, children) }));
jest.mock('../components/Button', () => ({ Button: ({ children, ...rest }) => require('react').createElement('button', rest, children) }));
jest.mock('../components/Input', () => ({ __esModule: true, default: ({ id, label, value, onChange }) => require('react').createElement('input', { 'aria-label': label, id, value, onChange }) }));

beforeEach(() => {
  jest.clearAllMocks();
  process.env.REACT_APP_API_URL = 'http://localhost:9099';
});

test('shows validation error for short first name', async () => {
  render(<SignUp />);

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Al' } });
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'user123' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@sky.uk' } });
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Password1!' } });
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password1!' } });

  fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

  await waitFor(() => expect(screen.getByText(/First name must be at least 3 characters/i)).toBeInTheDocument());
});

test('submits valid form and navigates on success', async () => {
  ensureCsrfToken.mockResolvedValueOnce('token');
  mockedAxios.post.mockResolvedValueOnce({ data: { message: 'Sign up successful' } });

  render(<SignUp />);

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Alice' } });
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'alice123' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'alice@sky.uk' } });
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Password1!' } });
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password1!' } });

  fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

  await waitFor(() => expect(ensureCsrfToken).toHaveBeenCalled());
  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/questionnaire'));
});
