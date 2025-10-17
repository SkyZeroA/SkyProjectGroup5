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
