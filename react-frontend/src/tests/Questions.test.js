import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

const Questions = require('../components/Questions').default;

test('Questions calls onAnswersChange with initialAnswers and updates', async () => {
  const onAnswersChange = jest.fn();
  const initialAnswers = {
    transportMethod: 1,
    travelDistance: 2,
    officeDays: 3,
    dietDays: 4,
    meats: 3,
    heatingHours: 6,
  };

  render(<Questions onAnswersChange={onAnswersChange} isEditing={true} initialAnswers={initialAnswers} />);

  await waitFor(() => expect(onAnswersChange).toHaveBeenCalled());
  // last call should include the initialAnswers shape
  const calledWith = onAnswersChange.mock.calls[onAnswersChange.mock.calls.length - 1][0];
  expect(calledWith.transportMethod).toBeDefined();
  expect(calledWith.travelDistance).toBeDefined();
  expect(calledWith.officeDays).toBeDefined();
});
