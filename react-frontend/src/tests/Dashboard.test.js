import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// import axios from 'axios';
import Dashboard from '../screens/Dashboard';

const mockNavigate = jest.fn();

jest.mock('axios');
const mockedAxios = require('axios');

jest.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));


test('renders leaderboard and carbon footprint sections', async () => {
    mockedAxios.get.mockImplementation((url) => {
        if (url.includes('/api/dashboard')) {
            return Promise.resolve({
                data: {
                    weekLeaderboard: [{ name: 'Harry', score: 100 }],
                    monthLeaderboard: [{ name: 'Harry', score: 400 }],
                    username: 'Harry',
                    projectedCarbon: 1200,
                    currentCarbon: 300,
                },
            });
        } else if (url.includes('/api/fetch-questions')) {
            return Promise.resolve({ data: ['Q1', 'Q2', 'Q3'] });
        }
    });


    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Projected Carbon Footprint/i)).toBeInTheDocument();
      expect(screen.getByText(/Harry/i)).toBeInTheDocument();
      expect(screen.getByText(/1200 Tons/i)).toBeInTheDocument();
      expect(screen.getByText(/300 Tons/i)).toBeInTheDocument();
    });
});


test('handles dashboard API failure gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Dashboard API failed'));
    mockedAxios.get.mockResolvedValueOnce({ data: ['Q1', 'Q2'] }); // fetch-questions
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();
    });
});


test('opens form popup when "Form" button is clicked', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: ['Q1', 'Q2'] }); // fetch-questions
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        weekLeaderboard: [],
        monthLeaderboard: [],
        username: 'Harry',
        projectedCarbon: 1000,
        currentCarbon: 200,
      },
    });

    render(<Dashboard />);

    const formButton = await screen.findByRole('button', { name: /Form/i });
    formButton.click();

    await waitFor(() => {
      expect(screen.getByText(/Q1/i)).toBeInTheDocument();
    });
});

