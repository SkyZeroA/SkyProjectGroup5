import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderBanner from '../components/HeaderBanner';

describe('HeaderBanner', () => {
  test('renders default layout with clickable logo and navbar', () => {
    const navbar = <div>Navbar Content</div>;
    render(
      <Router>
        <HeaderBanner navbar={navbar} logoLinked={true} />
      </Router>
    );

    // Check that the logo is displayed and clickable
    const logo = screen.getByAltText('Sky Zero Logo');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/dashboard');

    // Check that the navbar is rendered
    expect(screen.getByText('Navbar Content')).toBeInTheDocument();
  });

  test('renders centered layout with non-clickable logo and colorblind button', () => {
    const colorblindButton = <button>Colorblind Toggle</button>;
    render(
      <Router>
        <HeaderBanner centerLogo={true} logoLinked={false} colorblindButton={colorblindButton} />
      </Router>
    );

    // Check that the logo is centered and not clickable
    const logo = screen.getByAltText('Sky Zero Logo');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toBeNull();

    // Check that the colorblind button is rendered
    expect(screen.getByText('Colorblind Toggle')).toBeInTheDocument();
  });

  test('does not render navbar or colorblind button when not provided', () => {
    render(
      <Router>
        <HeaderBanner />
      </Router>
    );

    // Check that the navbar and colorblind button are not rendered
    expect(screen.queryByText('Navbar Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Colorblind Toggle')).not.toBeInTheDocument();
  });
});