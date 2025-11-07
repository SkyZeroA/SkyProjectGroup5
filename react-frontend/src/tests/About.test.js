import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Stub layout components used by About so tests remain focused
jest.mock('../components/HeaderBanner', () => () => require('react').createElement('div', null, 'HeaderBanner'));
jest.mock('../components/FooterBanner', () => () => require('react').createElement('div', null, 'FooterBanner'));
jest.mock('../components/Navbar', () => () => require('react').createElement('div', null, 'Navbar'));
jest.mock('../components/FAQCard', () => ({ question }) => require('react').createElement('div', null, question));

const About = require('../screens/About').default;

// Suppress a known DOM nesting warning coming from the component markup in the test
const origConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('In HTML, <p> cannot be a descendant of <p>.')) return;
    origConsoleError(...args);
  };
});
afterAll(() => {
  console.error = origConsoleError;
});

test('renders About page static content and FAQ', () => {
  render(<About />);

  // The main heading contains both parts (split between text and a span).
  const headings = screen.getAllByRole('heading', { level: 1 });
  const mainHeading = headings.find(h => /Welcome to/i.test(h.textContent || ''));
  expect(mainHeading).toBeDefined();
  expect(mainHeading).toHaveTextContent(/ClearSky/i);

  // FAQCard is stubbed to render the question text — check one expected FAQ text
  expect(screen.getByText(/Why do you ask about my lifestyle habits\?/i)).toBeInTheDocument();
});
