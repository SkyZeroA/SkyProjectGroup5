import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

// Stub layout and heavy children
jest.mock('../components/HeaderBanner', () => () => require('react').createElement('div', null, 'HeaderBanner'));
jest.mock('../components/FooterBanner', () => () => require('react').createElement('div', null, 'FooterBanner'));
jest.mock('../components/Navbar', () => () => require('react').createElement('div', null, 'Navbar'));
jest.mock('../components/Questions', () => ({ onAnswersChange }) => {
  // Render minimal controls and call onAnswersChange to simulate existing answers
  const React = require('react');
  React.useEffect(() => {
    if (onAnswersChange) onAnswersChange({ q1: 1 });
  }, []);
  return require('react').createElement('div', null, 'QuestionsStub');
});

const Profile = require('../screens/Profile').default;

beforeEach(() => {
  if (mockedAxios.get && mockedAxios.get.mockReset) mockedAxios.get.mockReset();
});

test('loads and displays user profile data', async () => {
  mockedAxios.get
    .mockResolvedValueOnce({ data: { username: 'bob123', firstName: 'Bob', avatar: null } }) // fetch-user-data
    .mockResolvedValueOnce({ data: { answers: { q1: 1 } } }); // fetch-questionnaire-answers

  render(<Profile />);

  await waitFor(() => {
    expect(screen.getByText(/Hi Bob/i)).toBeInTheDocument();
    expect(screen.getByText(/bob123/i)).toBeInTheDocument();
    // Questions stub present
    expect(screen.getByText('QuestionsStub')).toBeInTheDocument();
  });
});

test('allows changing avatar and saves questionnaire on Save click', async () => {
  // Ensure environment API url doesn't break URL construction in the component
  process.env.REACT_APP_API_URL = '';

  const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

  // axios sequence: fetch-user-data, fetch-questionnaire-answers
  mockedAxios.get
    .mockResolvedValueOnce({ data: { username: 'alice', firstName: 'Alice', avatar: null } })
    .mockResolvedValueOnce({ data: { answers: { q1: 2 } } });

  // Any subsequent GETs (e.g. after avatar change which triggers a refetch) should also resolve
  mockedAxios.get.mockResolvedValue({ data: { username: 'alice', firstName: 'Alice', avatar: null } });

  // mock upload-avatar and set-questionnaire endpoints
  mockedAxios.post = jest.fn()
    .mockResolvedValueOnce({ data: { success: true } }) // upload-avatar
    .mockResolvedValueOnce({ data: { message: 'Questionnaire saved' } }); // set-questionnaire

  // stub createObjectURL used for preview
  const origCreateObjectURL = global.URL.createObjectURL;
  global.URL.createObjectURL = jest.fn(() => 'blob:mock');

  render(<Profile />);

  // initial data shows up
  await waitFor(() => expect(screen.getByText(/Hi Alice/i)).toBeInTheDocument());

  // Find the file input via its label and change it
  const fileInput = screen.getByLabelText('Change Avatar');
  expect(fileInput).toBeInTheDocument();

  // Simulate selecting a file
  await waitFor(() => {
    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  // upload-avatar should have been called
  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());

  // Test Edit -> Save flow: clicking twice triggers the save POST on second click
  const editBtn = screen.getByRole('button', { name: /edit/i });
  expect(editBtn).toBeInTheDocument();

  // First click toggles to editing (no POST to set-questionnaire yet)
  fireEvent.click(editBtn);

  // Second click should invoke the set-questionnaire post (answers come from Questions stub)
  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());

  // restore global
  if (origCreateObjectURL) global.URL.createObjectURL = origCreateObjectURL;
});
