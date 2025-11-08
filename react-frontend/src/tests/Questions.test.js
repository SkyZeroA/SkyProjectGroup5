import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
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

test('Questions renders conditional questions based on transportMethod', async () => {
  const onAnswersChange = jest.fn();
  const { getByText, queryByText } = render(
    <Questions onAnswersChange={onAnswersChange} isEditing={true} initialAnswers={{ transportMethod: 1 }} />
  );

  // Check that travelDistance and officeDays questions are rendered
  expect(getByText(/How far do you travel to get to work/)).toBeInTheDocument();
  expect(getByText(/How many days a week are you in the office/)).toBeInTheDocument();

  // Check that dietDays question is always rendered
  expect(getByText(/How many days a week do you eat meat/)).toBeInTheDocument();

  // Check that meat question is not rendered when dietDays is 0
  expect(queryByText(/Which meat do you eat most/)).not.toBeInTheDocument();
});

test('Questions updates state on interaction', async () => {
  const onAnswersChange = jest.fn();
  const { getByLabelText } = render(
    <Questions onAnswersChange={onAnswersChange} isEditing={true} initialAnswers={{}} />
  );

  // Interact with transportMethod
  const transportOption = getByLabelText('Walk/Cycle');
  fireEvent.click(transportOption);
  await waitFor(() => expect(onAnswersChange).toHaveBeenCalledWith(expect.objectContaining({ transportMethod: 1 })));

  // Interact with dietDays slider
  const dietSlider = getByLabelText(/How many days a week do you eat meat/);
  fireEvent.change(dietSlider, { target: { value: 3 } });
  await waitFor(() => expect(onAnswersChange).toHaveBeenCalledWith(expect.objectContaining({ dietDays: 3 })));
});

test('Questions handles empty initialAnswers gracefully', async () => {
  const onAnswersChange = jest.fn();
  const { getByText } = render(
    <Questions onAnswersChange={onAnswersChange} isEditing={true} initialAnswers={{}} />
  );

  // Check that default questions are rendered
  expect(getByText(/How do you usually commute to work/)).toBeInTheDocument();
  expect(getByText(/How many days a week do you eat meat/)).toBeInTheDocument();
});

test('Questions respects isEditing prop', async () => {
  const onAnswersChange = jest.fn();
  const { container } = render(
    <Questions onAnswersChange={onAnswersChange} isEditing={false} initialAnswers={{}} />
  );

  // Check that the component is visually disabled
  expect(container.firstChild).toHaveClass('opacity-50 pointer-events-none');
});
