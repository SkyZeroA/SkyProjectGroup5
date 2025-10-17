import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock axios so importing SignIn doesn't try to load ESM axios in node_modules
jest.mock('axios');
const mockedAxios = require('axios');

// Provide a mock useNavigate so SignIn can call navigate without a router
const mockNavigate = jest.fn();
// Avoid calling jest.requireActual('react-router-dom') because Jest may
// fail to resolve the installed ESM package in this environment. Provide
// a minimal mock that supplies useNavigate.
jest.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));

// Require SignIn after mocks are set up so module imports pick up the mocks
const SignIn = require('../screens/SignIn').default;

describe('SignIn Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

  test('renders the SignIn form with input fields and button', () => {
    render(<SignIn />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
    expect(screen.getByText(/Create a new account/i)).toBeInTheDocument();
  });

  test('updates email and password on user input', () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits form and navigates on successful sign-in', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { message: 'Sign in successful' },
    });

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:9099/api/sign-in',
        { email: 'test@example.com', password: 'password123' },
        { withCredentials: true }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/sign-up');
    });
  });

  test('increments attempts and clears password on failed sign-in', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: 'Incorrect username or password' } },
    });

    render(<SignIn />);

    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(passwordInput.value).toBe(''); // cleared
    });

    // Error message should change after a failed attempt
    expect(
      screen.getByText(/Incorrect password. Please try again./i)
    ).toBeInTheDocument();
  });

  test('clicking "Create a new account" navigates to /sign-up', () => {
    render(<SignIn />);
    fireEvent.click(screen.getByText(/Create a new account/i));
    expect(mockNavigate).toHaveBeenCalledWith('/sign-up');
  });
});