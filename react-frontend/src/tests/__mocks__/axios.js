// Manual mock for axios used in tests to avoid importing ESM axios from node_modules
const axios = {
  post: jest.fn(() => Promise.resolve({ data: {} })),
  get: jest.fn(() => Promise.resolve({ data: {} })),
  create: () => axios,
};

// support both CommonJS and ES module interop for tests that use ESM imports
axios.__esModule = true;
axios.default = axios;
module.exports = axios;
