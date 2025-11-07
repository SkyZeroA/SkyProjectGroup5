import React from 'react';
import App from '../App';

test('App is callable and returns JSX element', () => {
  // Calling the App function will execute its body (create elements) without mounting
  const jsx = App();
  expect(jsx).toBeDefined();
});
