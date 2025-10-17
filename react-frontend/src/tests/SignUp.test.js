import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

const mockNavigate = jest.fn();


jest.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));


const SignUp = require('../screens/SignUp').default;


test("renders all input fields and buttons", () => {
    render(<SignUp />);

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue/i })).toBeInTheDocument();
    expect(screen.getByText(/Already got an account\? Sign in here/i)).toBeInTheDocument();
});

test("updates form input fields correctly", () => {
    render(<SignUp />);

    const nameInput = screen.getByLabelText(/First Name/i);
    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

    fireEvent.change(nameInput, { target: { value: "harry" } });
    fireEvent.change(usernameInput, { target: { value: "harry123" } });
    fireEvent.change(emailInput, { target: { value: "harry@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "test123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "test123" } });

    expect(nameInput.value).toBe("harry");
    expect(usernameInput.value).toBe("harry123");
    expect(emailInput.value).toBe("harry@example.com");
    expect(passwordInput.value).toBe("test123");
    expect(confirmPasswordInput.value).toBe("test123");
});

test("successful signup navigates to /questionnaire", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { message: "Sign up successful" },
    });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "harry" } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "harry123" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "harry@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "test123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "test123" } });

    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:9099/api/sign-up",
        {
          "first-name": "harry",
          username: "harry123",
          email: "harry@example.com",
          password: "test123",
          "confirm-password": "test123",
        },
        { withCredentials: true }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/questionnaire");
    });
});


test("handles username already exists error", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { error: "Username already exists" },
      },
    });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "takenUser" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(
        screen.getByText(/Username already exists. Please choose another./i)
      ).toBeInTheDocument();
    });
});

test("handles email already has an account error", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { error: "Email already has an account" },
      },
    });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "harry@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(
        screen.getByText(/Email already has an account. Please use another./i)
      ).toBeInTheDocument();
    });
});