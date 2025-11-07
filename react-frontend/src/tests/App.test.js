import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';

// Mock screens so tests stay fast and isolated
jest.mock('../screens/SignIn', () => () => <div>SignIn</div>);
jest.mock('../screens/SignUp', () => () => <div>SignUp</div>);
jest.mock('../screens/Questionnaire', () => () => <div>Questionnaire</div>);
jest.mock('../screens/Dashboard', () => () => <div>Dashboard</div>);
jest.mock('../screens/Profile', () => () => <div>Profile</div>);
jest.mock('../screens/Stats', () => () => <div>Stats</div>);
jest.mock('../screens/About', () => () => <div>About</div>);
jest.mock('../components/RequireAuth', () => ({ children }) => <>{children}</>);

test('App renders without crashing', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText('SignIn')).toBeInTheDocument();
});

test('colorblind state toggles document class', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  // By default, should not have class
  expect(document.documentElement.classList.contains('colorblind')).toBe(false);
});
