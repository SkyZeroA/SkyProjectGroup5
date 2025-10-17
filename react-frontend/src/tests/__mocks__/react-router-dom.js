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

module.exports = { BrowserRouter, Routes, Route };
