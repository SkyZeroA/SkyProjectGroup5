import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock modules used by components
jest.mock('axios');
const mockedAxios = require('axios');

jest.mock('@radix-ui/react-radio-group', () => ({
  Root: ({ children, ...props }) => require('react').createElement('div', props, children),
  Item: ({ children, ...props }) => require('react').createElement('div', props, children),
  Indicator: ({ children, ...props }) => require('react').createElement('div', props, children),
}));

// Provide a simple mock for lucide-react CircleIcon used by RadioGroup
jest.mock('lucide-react', () => ({ CircleIcon: () => require('react').createElement('div', null) }));

// Mock react-router-dom useNavigate for Navbar/RequireAuth
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => require('react').createElement('a', { href: to }, children),
  useNavigate: () => jest.fn(),
  Navigate: ({ to }) => require('react').createElement('div', null, `navigate:${to}`),
  useLocation: () => ({ pathname: '/' }),
}));

// Import components under test
const Input = require('../components/Input').default;
const MultiSelectQuestion = require('../components/MultipleRadioQuestion').default;
const RadioQuestion = require('../components/RadioQuestion').default;
const Slider = require('../components/Slider').default;
const SliderQuestion = require('../components/SliderQuestion').default;
const Navbar = require('../components/Navbar').default;
const RequireAuth = require('../components/RequireAuth').default;
const Switch = require('../components/Switch').default;
const TipCard = require('../components/TipCard').default;

beforeEach(() => {
  process.env.REACT_APP_API_URL = 'http://localhost:9099';
  if (mockedAxios.get && mockedAxios.get.mockReset) mockedAxios.get.mockReset();
  if (mockedAxios.post && mockedAxios.post.mockReset) mockedAxios.post.mockReset();
});

test('Input calls focus and blur handlers', () => {
  const onFocus = jest.fn();
  const onBlur = jest.fn();
  render(<Input label="Email" id="email" onFocus={onFocus} onBlur={onBlur} />);
  const input = screen.getByLabelText('Email');
  fireEvent.focus(input);
  expect(onFocus).toHaveBeenCalled();
  fireEvent.blur(input);
  expect(onBlur).toHaveBeenCalled();
});

test('MultiSelectQuestion toggles selection', () => {
  const setCurrent = jest.fn();
  const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
  render(<MultiSelectQuestion options={options} current={[]} setCurrent={setCurrent} question="Q" />);
  const checkbox = screen.getByLabelText('A');
  fireEvent.click(checkbox);
  expect(setCurrent).toHaveBeenCalled();
});

test('RadioQuestion renders options', () => {
  const setCurrent = jest.fn();
  const options = [{ value: '0', label: 'Zero' }, { value: '1', label: 'One' }];
  render(<RadioQuestion options={options} current={'0'} setCurrent={setCurrent} question="Q" />);
  expect(screen.getByText('Zero')).toBeInTheDocument();
});

test('Slider controlled calls onChange', () => {
  const onChange = jest.fn();
  const { getByRole } = render(<Slider value={10} onChange={onChange} min={0} max={20} />);
  const input = getByRole('slider') || document.getElementById('slider');
  // simulate change
  fireEvent.change(input, { target: { value: '15' } });
  expect(onChange).toHaveBeenCalled();
});

test('SliderQuestion renders and passes to Slider', () => {
  const setCurrent = jest.fn();
  render(<SliderQuestion current={3} setCurrent={setCurrent} max={7} question="How many" />);
  expect(screen.getByText(/How many/i)).toBeInTheDocument();
});

test('Navbar fetches user data and displays buttons', async () => {
  // Provide three sequential get responses: fetchAllQuestions, fetchUserActivities, fetchUserData
  mockedAxios.get
    .mockResolvedValueOnce({ data: [{ name: 'walk', points: 1 }] })
    .mockResolvedValueOnce({ data: [{ name: 'walk', points: 1 }] })
    .mockResolvedValueOnce({ data: { username: 'bob' } });

  render(<Navbar />);

  // Wait for axios calls
  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
  // 'Log your Activities' button should be present
  expect(screen.getByText(/Log your Activities/i)).toBeInTheDocument();
});

test('RequireAuth shows children when auth succeeds', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: { username: 'bob' } });
  render(
    <RequireAuth>
      <div>protected</div>
    </RequireAuth>
  );
  await waitFor(() => expect(screen.getByText('protected')).toBeInTheDocument());
});

test('Switch toggles and calls setOutput', () => {
  const setOutput = jest.fn();
  render(<Switch setOutput={setOutput} />);
  const btn = screen.getByRole('switch');
  fireEvent.click(btn);
  expect(setOutput).toHaveBeenCalled();
});

test('TipCard shows deleting state and calls onDelete', async () => {
  const onDelete = jest.fn().mockResolvedValueOnce();
  render(<TipCard tip="Save energy" onDelete={onDelete} />);
  const del = screen.getByLabelText(/Delete Tip/i);
  fireEvent.click(del);
  // Deleting placeholder should appear
  expect(screen.getByText(/Generating Tip/i)).toBeInTheDocument();
  await waitFor(() => expect(onDelete).toHaveBeenCalled());
});
