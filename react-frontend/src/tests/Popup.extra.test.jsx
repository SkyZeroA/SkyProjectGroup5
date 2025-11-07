import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

jest.mock('../lib/csrf', () => ({ ensureCsrfToken: jest.fn(() => Promise.resolve()) }));

const Popup = require('../components/PopUp').default;

test('edit activities flow: select and save calls onActivitiesSave', async () => {
  const onActivitiesSave = jest.fn(() => Promise.resolve());
  const onClose = jest.fn();

  // mock fetching user activity counts when isOpen
  mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: { Running: 2 } });

  const allQuestions = ['Running', 'Cycling'];
  const allPoints = [5, 10];

  render(
    React.createElement(Popup, {
      isOpen: true,
      onClose,
      questions: [],
      points: [],
      allQuestions,
      allPoints,
      onActivitiesSave,
    })
  );

  // Initially, because questions empty, the 'No activities set' message appears
  expect(screen.getByText(/No activities set/i)).toBeInTheDocument();

  // Click Edit Activities button (disambiguate from paragraph text)
  const editBtn = screen.getByRole('button', { name: /Edit Activities/i });
  fireEvent.click(editBtn);

  // Now allQuestions should be rendered as selectable items
  const runningItem = await screen.findByText('Running');
  fireEvent.click(runningItem);

  // Click Save
  const saveBtn = screen.getByText(/Save/i);
  fireEvent.click(saveBtn);

  await waitFor(() => expect(onActivitiesSave).toHaveBeenCalledWith(['Running']));
});

test('increment button triggers log activity post', async () => {
  const onActivitiesSave = jest.fn();
  const onClose = jest.fn();

  // Render Popup with one question so non-editing form shows
  mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: { Running: 1 } });
  mockedAxios.post = jest.fn().mockResolvedValueOnce({ data: { message: 'Activity logged' } });

  render(
    React.createElement(Popup, {
      isOpen: true,
      onClose,
      questions: ['Running'],
      points: [5],
      allQuestions: [],
      allPoints: [],
      onActivitiesSave,
    })
  );

  // Wait for question label
  expect(await screen.findByText(/Running/)).toBeInTheDocument();

  const plusBtn = screen.getByText('+');
  fireEvent.click(plusBtn);

  await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith(
    expect.stringContaining('/api/log-activity'),
    expect.any(Object),
    { withCredentials: true }
  ));
});
