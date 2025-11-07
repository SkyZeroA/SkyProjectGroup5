import '@testing-library/jest-dom';

jest.mock('axios');
const axios = require('axios');

// Ensure axios.defaults exists in the mocked axios so helper can set headers
axios.defaults = axios.defaults || { headers: { common: {} } };

const { ensureCsrfToken, setCsrfToken, clearCsrfToken } = require('../lib/csrf');

beforeEach(() => {
  jest.clearAllMocks();
  // ensure defaults exist for each test
  axios.defaults = axios.defaults || { headers: { common: {} } };
  // clear any existing cached token
  try { clearCsrfToken(); } catch (e) {}
});

test('ensureCsrfToken fetches and caches token and sets axios defaults', async () => {
  axios.get.mockResolvedValueOnce({ data: { csrf_token: 'abc123' } });
  const token = await ensureCsrfToken('http://api');
  expect(token).toBe('abc123');
  expect(axios.defaults.headers.common['X-CSRFToken']).toBe('abc123');
  expect(axios.get).toHaveBeenCalledTimes(1);

  // calling again should return cached token and not call axios.get again
  const token2 = await ensureCsrfToken('http://api');
  expect(token2).toBe('abc123');
  expect(axios.get).toHaveBeenCalledTimes(1);
});

test('setCsrfToken and clearCsrfToken manipulate axios defaults', () => {
  setCsrfToken('token-xyz');
  expect(axios.defaults.headers.common['X-CSRFToken']).toBe('token-xyz');
  expect(axios.defaults.headers.common['X-CSRF-Token']).toBe('token-xyz');

  clearCsrfToken();
  expect(axios.defaults.headers.common['X-CSRFToken']).toBeUndefined();
  expect(axios.defaults.headers.common['X-CSRF-Token']).toBeUndefined();
});
