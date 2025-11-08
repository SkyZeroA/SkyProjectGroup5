import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import FooterBanner from '../components/FooterBanner';

describe('FooterBanner', () => {
  test('renders all footer links with correct labels and URLs', () => {
    render(
      <Router>
        <FooterBanner />
      </Router>
    );

    const footerLinks = [
      { label: 'Terms & conditions', url: 'https://www.sky.com/help/articles/sky-terms-and-conditions' },
      { label: 'Privacy & cookies notice', url: 'https://www.sky.com/help/articles/privacy-hub-home' },
      { label: 'Accessibility', url: 'https://skyaccessibility.sky/' },
      { label: 'Site map', url: 'https://www.sky.com/sitemap' },
      { label: 'Contact us', url: 'https://www.sky.com/help/articles/contacting-sky' },
      { label: 'Complaints', url: 'https://www.sky.com/help/articles/sky-customer-complaints-code-of-practice/' },
      { label: 'Sky Group', url: 'https://www.skygroup.sky/' },
      { label: 'Store locator', url: 'https://www.sky.com/shop/store-locator' },
    ];

    footerLinks.forEach((link) => {
      const anchor = screen.getByText(link.label);
      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute('href', link.url);
      if (link.url.startsWith('http')) {
        expect(anchor).toHaveAttribute('target', '_blank');
        expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  test('renders Sky logo and copyright text', () => {
    render(
      <Router>
        <FooterBanner />
      </Router>
    );

    const logo = screen.getByAltText('Sky Logo');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', 'https://www.sky.com/');

    const copyright = screen.getByText('© 2025 Sky UK');
    expect(copyright).toBeInTheDocument();
  });
});