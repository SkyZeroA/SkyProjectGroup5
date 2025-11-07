// Ensure we can import index.js safely in tests by mocking react-dom/client
jest.mock('react-dom/client', () => {
  return {
    createRoot: jest.fn(() => ({ render: jest.fn() })),
  };
});

test('index imports and calls createRoot', () => {
  const rdc = require('react-dom/client');

  // Requiring index.js will execute the module, using the mocked createRoot above
  require('../index.js');

  expect(rdc.createRoot).toHaveBeenCalled();
});
