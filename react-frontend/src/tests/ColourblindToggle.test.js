// ColorblindToggle.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ColorblindToggle from '../components/ColourblindToggle';
import '@testing-library/jest-dom';


describe('ColorblindToggle', () => {
  it('renders the button with the correct label when colorblind is false', () => {
    const setColorblind = jest.fn(); // Mock the setColorblind function
    const { getByText } = render(<ColorblindToggle colorblind={false} setColorblind={setColorblind} />);
    
    // Check that the button text is "Enable Colorblind Mode"
    expect(getByText('Enable Colorblind Mode')).toBeInTheDocument();
  });

  it('renders the button with the correct label when colorblind is true', () => {
    const setColorblind = jest.fn(); // Mock the setColorblind function
    const { getByText } = render(<ColorblindToggle colorblind={true} setColorblind={setColorblind} />);
    
    // Check that the button text is "Disable Colorblind Mode"
    expect(getByText('Disable Colorblind Mode')).toBeInTheDocument();
  });

  it('calls setColorblind with the correct argument when clicked', () => {
    const setColorblind = jest.fn();
    const { getByText } = render(<ColorblindToggle colorblind={false} setColorblind={setColorblind} />);

    const button = getByText('Enable Colorblind Mode');
    fireEvent.click(button);

    // Check that setColorblind was called with `true` (toggling the state)
    expect(setColorblind).toHaveBeenCalledWith(true);
  });

  it('toggles colorblind mode correctly on multiple clicks', () => {
    const setColorblind = jest.fn();
    const { getByText, rerender } = render(<ColorblindToggle colorblind={false} setColorblind={setColorblind} />);

    const button = getByText('Enable Colorblind Mode');
    
    // First click, should call setColorblind(true)
    fireEvent.click(button);
    expect(setColorblind).toHaveBeenCalledWith(true);

    // Re-render with colorblind true
    rerender(<ColorblindToggle colorblind={true} setColorblind={setColorblind} />);

    // Button should now say "Disable Colorblind Mode"
    expect(getByText('Disable Colorblind Mode')).toBeInTheDocument();

    // Second click, should call setColorblind(false)
    fireEvent.click(getByText('Disable Colorblind Mode'));
    expect(setColorblind).toHaveBeenCalledWith(false);
  });
});
