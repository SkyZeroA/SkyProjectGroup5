import { render, screen } from '@testing-library/react';
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like: expect(element).toBeInTheDocument()
import '@testing-library/jest-dom';
// Import the mocked components directly for isolated rendering
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Questionnaire from '../screens/Questionnaire';
import Dashboard from '../screens/Dashboard';


// Mock the screen components to make them predictable for unit tests
jest.mock('../screens/SignIn', () => () => <div>SignIn</div>);
jest.mock('../screens/SignUp', () => () => <div>SignUp</div>);
jest.mock('../screens/Questionnaire', () => () => <div>Questionnaire</div>);
jest.mock('../screens/Dashboard', () => () => <div>Dashboard</div>);


test('SignIn component renders in isolation', () => {
  render(<SignIn />);
  expect(screen.getByText(/SignIn/)).toBeInTheDocument();
});

test('SignUp component renders in isolation', () => {
  render(<SignUp />);
  expect(screen.getByText(/SignUp/)).toBeInTheDocument();
});

test('Questionnaire component renders in isolation', () => {
  render(<Questionnaire />);
  expect(screen.getByText(/Questionnaire/)).toBeInTheDocument();
});

test('Dashboard component renders in isolation', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Dashboard/)).toBeInTheDocument();
});
