import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like: expect(element).toBeInTheDocument()
import '@testing-library/jest-dom';

// Use Jest manual mock in __mocks__/react-router-dom.js
// jest.mock('react-router-dom');


// Mock the screen components to make them predictable for unit tests
jest.mock('../screens/SignIn', () => () => <div>SignIn</div>);
jest.mock('../screens/SignUp', () => () => <div>SignUp</div>);
jest.mock('../screens/Questionnaire', () => () => <div>Questionnaire</div>);
jest.mock('../screens/Dashboard', () => () => <div>Dashboard</div>);


test('App renders Sign In route by default', () => {
  render(<App />);
  expect(screen.getByText(/SignIn/)).toBeInTheDocument();
});

test('App renders Sign Up route', () => {
  render(<App />);
  expect(screen.getByText(/SignUp/)).toBeInTheDocument();
});

test('App renders Questionnaire route', () => {
  render(<App />);
  expect(screen.getByText(/Questionnaire/)).toBeInTheDocument();
});

test('App renders Dashboard route', () => {
  render(<App />);
  expect(screen.getByText(/Dashboard/)).toBeInTheDocument();
});
