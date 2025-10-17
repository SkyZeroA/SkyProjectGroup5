import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

const mockNavigate = jest.fn();


jest.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));


const Questionnaire = require('../screens/Questionnaire').default;


test("renders all questions and submit button", () => {
    render(<Questionnaire />);

    expect(
      screen.getByText(/Welcome to ClearSky/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Question 1: How do you usually commute to work\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Question 2: What type of diet do you typically follow\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Question 3: How energy-efficient is your home\?/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Continue/i })
    ).toBeInTheDocument();
  });


test("allows selecting transport, diet, and home efficiency options", () => {
    render(<Questionnaire />);

    // Select one of each option group
    const transportOption = screen.getByLabelText(/Car \(Electric\)/i);
    const dietOption = screen.getByLabelText(/Vegan/i);
    const homeOption = screen.getByLabelText(/Inefficient/i);

    // Simulate selecting them
    fireEvent.click(transportOption);
    fireEvent.click(dietOption);
    fireEvent.click(homeOption);

    // Verify they are selected
    expect(transportOption).toBeChecked();
    expect(dietOption).toBeChecked();
    expect(homeOption).toBeChecked();
  });


test("submits questionnaire successfully and navigates to /dashboard", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { message: "Questionnaire submitted successfully" },
    });

    render(<Questionnaire />);

    // Select one option from each question
    fireEvent.click(screen.getByLabelText(/Car \(Electric\)/i));
    fireEvent.click(screen.getByLabelText(/Vegan/i));
    fireEvent.click(screen.getByLabelText(/Moderately Efficient/i));

    // Click the Continue button
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:9099/api/questionnaire",
        {
          transportMethod: 3,
          diet: 3,
          homeEfficiency: 1,
        },
        { withCredentials: true }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
