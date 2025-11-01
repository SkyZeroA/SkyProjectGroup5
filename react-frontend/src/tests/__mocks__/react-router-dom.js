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

module.exports = { BrowserRouter, Routes, Route, MemoryRouter, useLocation, Navigate, useNavigate, Link };
