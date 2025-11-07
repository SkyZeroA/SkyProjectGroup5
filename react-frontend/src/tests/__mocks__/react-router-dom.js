const React = require('react');

function BrowserRouter({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function Routes({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function Route({ element }) {
  return element || null;
}

function MemoryRouter({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function useLocation() {
  return { pathname: '/' };
}

function Navigate() {
  return null;
}

function useNavigate() {
  return () => {};
}

function Link({ children, to, className, ...props }) {
  return React.createElement('a', { href: to || '#', className, ...props }, children);
}

const exportsObj = { BrowserRouter, Routes, Route, MemoryRouter, useLocation, Navigate, useNavigate, Link };
// support both CommonJS and ES module interop for tests that use ESM imports
exportsObj.__esModule = true;
exportsObj.default = exportsObj;
module.exports = exportsObj;
