import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like: expect(element).toBeInTheDocument()
import '@testing-library/jest-dom';



// Mock the screen components to make them predictable for unit tests
jest.mock('../screens/SignIn', () => () => <div>Mock SignIn</div>);
jest.mock('../screens/SignUp', () => () => <div>Mock SignUp</div>);
jest.mock('../screens/Questionnaire', () => () => <div>Mock Questionnaire</div>);
jest.mock('../screens/Dashboard', () => () => <div>Mock Dashboard</div>);

// Use Jest manual mock in src/__mocks__/react-router-dom.js
// jest.mock('react-router-dom');



test('App renders SignIn route by default', () => {
  render(<App />);
  expect(screen.getByText(/Mock SignIn/)).toBeInTheDocument();
});
