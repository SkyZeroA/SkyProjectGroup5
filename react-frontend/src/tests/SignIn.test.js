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
// Mock internal UI components to avoid rendering unrelated layout code
jest.mock('../components/HeaderBanner', () => () => <div>HeaderBanner</div>);
jest.mock('../components/FooterBanner', () => () => <div>FooterBanner</div>);
jest.mock('../components/Button', () => ({ Button: ({ children, ...props }) => <button {...props}>{children}</button> }));
jest.mock('../components/Card', () => ({ Card: ({ children }) => <div>{children}</div>, CardContent: ({ children }) => <div>{children}</div> }));
jest.mock('../components/Input', () => (props) => (
  <div>
    <input aria-label={props.label} value={props.value || ''} onChange={props.onChange} />
    {props.showError && props.errorMessage ? <div>{props.errorMessage}</div> : null}
  </div>
));

const SignIn = require('../screens/SignIn').default;

test('renders the SignIn form with input fields and button', () => {
    render(<SignIn />);

    expect(screen.getByRole('textbox', { name: /Email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
    expect(screen.getByText(/Create a new account/i)).toBeInTheDocument();
  });
 
test('updates email and password on user input', () => {
    render(<SignIn />);

  const emailInput = screen.getByRole('textbox', { name: /Email/i });
  const passwordInput = screen.getByLabelText(/^Password$/i);

  fireEvent.change(emailInput, { target: { value: 'test@sky.uk' } });
    fireEvent.change(passwordInput, { target: { value: 'Password1!' } });

  expect(emailInput.value).toBe('test@sky.uk');
    expect(passwordInput.value).toBe('Password1!');
  });

test('submits form and navigates on successful sign-in', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { message: 'Sign in successful' },
    });

    render(<SignIn />);

    fireEvent.change(screen.getByRole('textbox', { name: /Email/i }), {
      target: { value: 'test@sky.uk' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Password1!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/sign-in'),
          { email: 'test@sky.uk', password: 'Password1!' },
          { withCredentials: true }
        );
      // expect(mockNavigate).toHaveBeenCalledWith('/sign-up');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
});

test('handles incorrect username or password error', async () => {
  mockedAxios.post.mockRejectedValueOnce({
    response: {
      data: {
        error: 'Incorrect username or password',
      },
    },
  });

  render(<SignIn />);

    fireEvent.change(screen.getByRole('textbox', { name: /Email/i }), {
      target: { value: 'wrong@sky.uk' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'WrongPass1!' },
    });

  fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/sign-in'),
      { email: 'wrong@sky.uk', password: 'WrongPass1!' },
      { withCredentials: true }
    );

    // You can also assert side effects like clearing the password field
    expect(screen.getByLabelText(/^Password$/i).value).toBe('');
  });
});

test('navigates to sign-up page when "Create a new account" button is clicked', () => {
  render(<SignIn />); // Assuming SignIn contains the button

  const createAccountButton = screen.getByText(/Create a new account/i);
  fireEvent.click(createAccountButton);

  expect(mockNavigate).toHaveBeenCalledWith('/sign-up');
});
