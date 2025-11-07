import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-router-dom Link used by Header/Footer
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => require('react').createElement('a', { href: to }, children),
}));

// Mock axios for networked components
jest.mock('axios');
const mockedAxios = require('axios');

// Mock react-calendar-heatmap used by CalendarHeatMap
jest.mock('react-calendar-heatmap', () => ({
  __esModule: true,
  default: ({ values }) => require('react').createElement('div', null, `heatmap:${values ? values.length : 0}`),
}));

// Mock recharts primitives used by MyPieChart (and other charts)
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => require('react').createElement('div', null, children),
  PieChart: ({ children }) => require('react').createElement('div', null, children),
  Pie: ({ children }) => require('react').createElement('div', null, children),
  Cell: () => require('react').createElement('div', null),
  Tooltip: () => require('react').createElement('div', null),
  Legend: () => require('react').createElement('div', null),
  LineChart: ({ children }) => require('react').createElement('div', null, children),
  Line: () => require('react').createElement('div', null),
  BarChart: ({ children }) => require('react').createElement('div', null, children),
  Bar: () => require('react').createElement('div', null),
  XAxis: () => require('react').createElement('div', null),
  YAxis: () => require('react').createElement('div', null),
  CartesianGrid: () => require('react').createElement('div', null),
}));

// Import components under test
const FAQCard = require('../components/FAQCard').default;
const HeaderBanner = require('../components/HeaderBanner').default;
const FooterBanner = require('../components/FooterBanner').default;
const CalendarHeatMap = require('../components/CalendarHeatMap').default;
const MyPieChart = require('../components/MyPieChart').default;
const PopupForm = require('../components/PopUp').default;

beforeEach(() => {
  if (mockedAxios.get && mockedAxios.get.mockReset) mockedAxios.get.mockReset();
  if (mockedAxios.post && mockedAxios.post.mockReset) mockedAxios.post.mockReset();
  process.env.REACT_APP_API_URL = 'http://localhost:9099';
});

test('FAQCard toggles open and shows answer', () => {
  render(<FAQCard question="Q?" answer="Because yes" />);
  const q = screen.getByText('Q?');
  expect(q).toBeInTheDocument();
  // answer region has aria-hidden when closed (select including hidden)
  const region = screen.getByRole('region', { hidden: true });
  expect(region).toHaveAttribute('aria-hidden', 'true');
  fireEvent.click(screen.getByRole('button'));
  // after click the region becomes visible
  expect(region).toHaveAttribute('aria-hidden', 'false');
  expect(screen.getByText('Because yes')).toBeInTheDocument();
});

test('HeaderBanner and FooterBanner render and contain expected text/links', () => {
  render(<HeaderBanner logoAlign="left" navbar={<div>nav</div>} />);
  expect(screen.getByAltText(/Sky Zero Logo/i)).toBeInTheDocument();

  render(<FooterBanner />);
  // expect at least one of the footer links to be present
  expect(screen.getByText(/Terms & conditions/i)).toBeInTheDocument();
  expect(screen.getByText(/© 2025 Sky UK/)).toBeInTheDocument();
});

test('CalendarHeatMap fetches and displays heatmap', async () => {
  // mock axios response with counts object
  mockedAxios.get.mockResolvedValueOnce({ data: { counts: { '2025-01-01': 2 } } });
  render(<CalendarHeatMap isFormOpen={false} />);
  expect(screen.getByText(/Your Activity/i)).toBeInTheDocument();
  await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
  // heatmap mock should render with values length (zero or more)
  expect(screen.getByText(/heatmap:/i)).toBeInTheDocument();
});

test('MyPieChart renders with given props', () => {
  const { container } = render(
    <MyPieChart transportEmissions={1} dietEmissions={2} heatingEmissions={3} />
  );
  // container should have rendered nodes
  expect(container.firstChild).toBeTruthy();
});

test('PopupForm increments and posts activity', async () => {
  const onClose = jest.fn();
  const onActivitiesSave = jest.fn().mockResolvedValueOnce();

  mockedAxios.get.mockResolvedValueOnce({ data: { 'walk': 1 } });
  mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

  render(
    <PopupForm
      isOpen={true}
      onClose={onClose}
      questions={["walk"]}
      points={[1]}
      allQuestions={["walk","run"]}
      allPoints={[1,2]}
      onActivitiesSave={onActivitiesSave}
    />
  );

  // Should render Log Your Activities title
  expect(screen.getByText(/Log Your Activities/i)).toBeInTheDocument();

  // increment button '+' should exist; find by text '+'
  const plus = screen.getAllByText('+')[0] || screen.getByText('+');
  fireEvent.click(plus);

  // axios.post called via handleSubmit
  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());

  // click Edit Activities then Save to exercise selection flow
  fireEvent.click(screen.getByText(/Edit Activities/i));
  await waitFor(() => expect(screen.getByText(/Save/i)).toBeInTheDocument());
  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() => expect(onActivitiesSave).toHaveBeenCalled());
});
