import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

// test('handles fetch-questions API failure gracefully', async () => {
//     mockedAxios.get.mockRejectedValueOnce(new Error('Fetch questions API failed'));
//     mockedAxios.get.mockResolvedValueOnce({
//       data: {
//         weekLeaderboard: [],
//         monthLeaderboard: [],
//         username: 'Harry',
//         projectedCarbon: 1000,
//         currentCarbon: 200,
//       },
//     });

//     render(<Dashboard />);

//     await waitFor(() => {
//       expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();
//     });
// });

// test('submits form answers and calls fetchData on success', async () => {
//   const mockAnswers = { question1: 'Yes', question2: 'No' };
//   const mockResponse = { data: { message: 'Activity logged' } };

//   mockedAxios.post.mockResolvedValueOnce(mockResponse);

//   const dashboardInstance = new Dashboard({});
//   await dashboardInstance.handleFormSubmit(mockAnswers);

//   expect(mockedAxios.post).toHaveBeenCalledWith(
//     'http://localhost:9099/api/log-activity',
//     mockAnswers,
//     { withCredentials: true }
//   );  
// });

// test('logs error on form submission failure', async () => {
//   const mockAnswers = { question1: 'Yes', question2: 'No' };
//   const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
//   mockedAxios.post.mockRejectedValueOnce(new Error('Submission failed'));

//   const dashboardInstance = new Dashboard({});
//   await dashboardInstance.handleFormSubmit(mockAnswers);

//   expect(consoleErrorSpy).toHaveBeenCalledWith(
//     expect.stringContaining('Error submitting form:'),
//     expect.any(Error)
//   );

//   consoleErrorSpy.mockRestore();
// });

test('submits form answers and calls fetchData on success', async () => {
  const mockAnswers = { question1: 'Yes', question2: 'No' };
  const mockResponse = { data: { message: 'Activity logged' } };

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

  mockedAxios.post.mockResolvedValueOnce(mockResponse);

  render(<Dashboard />);

  // Simulate opening the form
  const formButton = await screen.findByRole('button', { name: /Form/i });
  fireEvent.click(formButton);

  // Simulate answering and submitting the form
  const submitButton = await screen.findByRole('button', { name: /Submit/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:9099/api/log-activity',
      expect.any(Object), // You can match specific answers if needed
      { withCredentials: true }
    );
  });
});

test('logs error on form submission failure', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
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

  mockedAxios.post.mockRejectedValueOnce(new Error('Submission failed'));

  render(<Dashboard />);

  // Simulate opening the form
  const formButton = await screen.findByRole('button', { name: /Form/i });
  fireEvent.click(formButton);

  // Simulate answering and submitting the form
  const submitButton = await screen.findByRole('button', { name: /Submit/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error submitting form:'),
      expect.any(Error)
    );
  }
  );
  consoleErrorSpy.mockRestore();
});


test('navigates to "/" on Sign Out button click', async () => {
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

  const signOutButton = await screen.findByRole('button', { name: /Sign Out/i });
  fireEvent.click(signOutButton);
  
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});


test('logs error when dashboard API fails (correct mock order)', async () => {
  // Ensure fetch-questions resolves first, then dashboard fails
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  mockedAxios.get.mockResolvedValueOnce({ data: ['Q1', 'Q2'] }); // fetch-questions
  mockedAxios.get.mockRejectedValueOnce(new Error('Dashboard API failed')); // dashboard

  render(<Dashboard />);

  await waitFor(() => {
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to fetch data from json'),
      expect.any(Error)
    );
  });

  consoleErrorSpy.mockRestore();
});


test('highlights current user in leaderboard and sorts correctly', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: ['Q1'] }); // fetch-questions
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      weekLeaderboard: [
        { name: 'Alice', score: 50 },
        { name: 'Harry', score: 100 }
      ],
      monthLeaderboard: [
        { name: 'Bob', score: 60 },
        { name: 'Harry', score: 80 }
      ],
      username: 'Harry',
      projectedCarbon: 1000,
      currentCarbon: 200,
    },
  });

  render(<Dashboard />);

  await waitFor(() => {
    // Harry should be present
    expect(screen.getByText('Harry')).toBeInTheDocument();
    // The current user row should include the current-user border class
    const highlighted = document.querySelector('.border-2.border-green-500');
    expect(highlighted).toBeInTheDocument();
    expect(highlighted).toHaveTextContent('Harry');
  });
});


test('after successful form submission fetchData updates dashboard content', async () => {
  // fetch-questions
  mockedAxios.get.mockResolvedValueOnce({ data: ['Q1', 'Q2'] });
  // initial dashboard response
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      weekLeaderboard: [],
      monthLeaderboard: [],
      username: 'Harry',
      projectedCarbon: 1000,
      currentCarbon: 200,
    },
  });

  // post response
  mockedAxios.post.mockResolvedValueOnce({ data: { message: 'Activity logged' } });

  // dashboard response after fetchData is called inside handleFormSubmit
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      weekLeaderboard: [],
      monthLeaderboard: [],
      username: 'Harry',
      projectedCarbon: 2000,
      currentCarbon: 500,
    },
  });

  render(<Dashboard />);

  // Open the form and submit
  const formButton = await screen.findByRole('button', { name: /Form/i });
  fireEvent.click(formButton);

  const submitButton = await screen.findByRole('button', { name: /Submit/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    // After fetchData runs post-submit, the updated projectedCarbon should appear
    expect(screen.getByText(/2000 Tons/i)).toBeInTheDocument();
  });
});

// console.error("Failed to fetch data from json" , error);
// test('logs error when dashboard API fails', async () => {
//   const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

//   mockedAxios.get.mockRejectedValueOnce(new Error('Dashboard API failed'));
//   mockedAxios.get.mockResolvedValueOnce({ data: ['Q1', 'Q2'] }); // fetch-questions

//   render(<Dashboard />);

//   await waitFor(() => {
//     expect(consoleErrorSpy).toHaveBeenCalledWith(
//       expect.stringContaining('Failed to fetch data from json'),
//       expect.any(Error)
//     );
//   });

//   consoleErrorSpy.mockRestore();
// });