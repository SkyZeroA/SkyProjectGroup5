import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../components/ProgressBar';

describe('ProgressBar Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('calculates percentCurrent correctly when current is less than projected', () => {
    render(<ProgressBar current={50} projected={100} />);

    // Fast-forward the timer to trigger the animation
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    const greyBar = screen.getByTestId('progress-bar-current');
    expect(greyBar).toHaveStyle('width: 50%');
  });

  test('caps percentCurrent at 100 when current exceeds projected', () => {
    render(<ProgressBar current={150} projected={100} />);

    // Fast-forward the timer to trigger the animation
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    const greyBar = screen.getByTestId('progress-bar-current');
    expect(greyBar).toHaveStyle('width: 100%');
  });

  test('handles edge case when projected is 0 to avoid division by zero', () => {
    render(<ProgressBar current={50} projected={0} />);

    // Fast-forward the timer to trigger the animation
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    const greyBar = screen.getByTestId('progress-bar-current');
    expect(greyBar).toHaveStyle('width: 100%');
  });
});