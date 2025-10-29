// Manual mock for axios used in tests to avoid importing ESM axios from node_modules
const axios = {
  post: jest.fn(() => Promise.resolve({ data: {} })),
  get: jest.fn(() => Promise.resolve({ data: {} })),
  create: () => axios,
};

module.exports = axios;
