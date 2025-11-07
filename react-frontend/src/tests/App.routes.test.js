import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';

jest.mock('../screens/SignIn', () => () => <div>SignIn</div>);
jest.mock('../screens/SignUp', () => () => <div>SignUp</div>);
jest.mock('../screens/Questionnaire', () => () => <div>Questionnaire</div>);
jest.mock('../screens/Dashboard', () => () => <div>Dashboard</div>);
jest.mock('../screens/Profile', () => () => <div>Profile</div>);
jest.mock('../screens/Stats', () => () => <div>Stats</div>);
jest.mock('../screens/About', () => () => <div>About</div>);
jest.mock('../components/RequireAuth', () => ({ children }) => <>{children}</>);

const routes = [
  { path: '/', componentText: 'SignIn' },
  { path: '/sign-up', componentText: 'SignUp' },
  { path: '/dashboard', componentText: 'Dashboard' },
  { path: '/profile', componentText: 'Profile' },
  { path: '/stats', componentText: 'Stats' },
  { path: '/about', componentText: 'About' },
  { path: '/questionnaire', componentText: 'Questionnaire' },
];

describe('App routing', () => {
  routes.forEach(({ path, componentText }) => {
    test(`renders ${componentText} at route "${path}"`, () => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText(componentText)).toBeInTheDocument();
    });
  });
});
