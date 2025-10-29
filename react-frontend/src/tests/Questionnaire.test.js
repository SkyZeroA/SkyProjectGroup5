import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = require('axios');

const mockNavigate = jest.fn();


jest.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));


const Questionnaire = require('../screens/Questionnaire').default;

beforeEach(() => {
  if (mockedAxios.post && mockedAxios.post.mockReset) mockedAxios.post.mockReset();
  mockNavigate.mockClear();
});


// test("renders all questions and submit button", () => {
//     render(<Questionnaire />);

//     expect(
//       screen.getByText(/Welcome to ClearSky/i)
//     ).toBeInTheDocument();

//     expect(
//       screen.getByText(/Question 1: How do you usually commute to work\?/i)
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText(/Question 2: What type of diet do you typically follow\?/i)
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText(/Question 3: How energy-efficient is your home\?/i)
//     ).toBeInTheDocument();

//     expect(
//       screen.getByRole("button", { name: /Continue/i })
//     ).toBeInTheDocument();
// });


test("renders initial questions and submit button", () => {
  render(<Questionnaire />);
  expect(screen.getByText(/Welcome to ClearSky/i)).toBeInTheDocument();
  expect(screen.getByText(/Question 1: How do you usually commute to work\?/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Continue/i })).toBeInTheDocument();
});


// test("shows conditional questions based on transport and diet selection", () => {
//   render(<Questionnaire />);

//   // Select transport method other than 'Work from Home'
//   fireEvent.click(screen.getByLabelText(/Car \(Electric\)/i));
//   expect(screen.getByText(/Question 2: How far do you travel to get to work\?/i)).toBeInTheDocument();
//   expect(screen.getByText(/Question 3: How many days a week are you in the office\?/i)).toBeInTheDocument();

//   // Select diet days > 0
//   const dietSlider = screen.getByLabelText(/Question 4: How many days a week do you eat meat\?/i);
//   fireEvent.change(dietSlider, { target: { value: 3 } });
//   expect(screen.getByText(/Question 5: Which meat do you eat most\?/i)).toBeInTheDocument();
// });




test("shows conditional questions based on transport and diet selection", () => {
  render(<Questionnaire />);

  // Select transport method other than 'Work from Home'
  // Labels are plain spans and the actual radio buttons are sibling elements; click the radio button next to the label
  const carLabel = screen.getByText(/Car \(Electric\)/i);
  fireEvent.click(carLabel.nextElementSibling);

  expect(screen.getByText(/Question 2: How far do you travel to get to work\?/i)).toBeInTheDocument();
  expect(screen.getByText(/Question 3: How many days a week are you in the office\?/i)).toBeInTheDocument();

  // Select diet days > 0 using the slider (role='slider'). Sliders render in order: officeDays, dietDays, heatingHours
  const sliders = screen.getAllByRole('slider');
  const dietSlider = sliders[1];
  fireEvent.change(dietSlider, { target: { value: 3 } });
  expect(screen.getByText(/Question 5: Which meat do you eat most\?/i)).toBeInTheDocument();
});

test("submits questionnaire successfully and navigates to /dashboard", async () => {
  mockedAxios.post.mockResolvedValueOnce({
    data: { message: "Questionnaire submitted successfully" },
  });

  render(<Questionnaire />);

  // Select transport option (Car Electric)
  const carLabel2 = screen.getByText(/Car \(Electric\)/i);
  fireEvent.click(carLabel2.nextElementSibling);

  // Select travel distance option '10-15' (click its sibling radio button)
  const travelLabel = screen.getByText(/10-15/i);
  fireEvent.click(travelLabel.nextElementSibling);

  // Sliders: [officeDays, dietDays, heatingHours]
  const sliders2 = screen.getAllByRole('slider');
  const officeSlider = sliders2[0];
  fireEvent.change(officeSlider, { target: { value: 3 } });

  const dietSlider2 = sliders2[1];
  fireEvent.change(dietSlider2, { target: { value: 4 } });

  // Click the 'Chicken' option (radio) by finding the text and clicking its sibling button
  const chickenLabel = screen.getByText(/Chicken/i);
  fireEvent.click(chickenLabel.nextElementSibling);

  const heatingSlider = sliders2[2];
  fireEvent.change(heatingSlider, { target: { value: 6 } });

  fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

  await waitFor(() => {
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:9099/api/questionnaire",
      {
        transportMethod: 4,
        travelDistance: 2,
        officeDays: 3,
        dietDays: 4,
        meats: 3,
        heatingHours: 6,
      },
      { withCredentials: true }
    );
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

test("handles submission error gracefully", async () => {
  mockedAxios.post.mockRejectedValueOnce(new Error("Network Error"));

  render(<Questionnaire />);

  // Select transport option (Car Electric) by clicking the visible text's sibling button
  const car = screen.getByText(/Car \(Electric\)/i);
  fireEvent.click(car.nextElementSibling);

  // Select travel distance option '10-15' (click its sibling button)
  const travel = screen.getByText(/10-15/i);
  fireEvent.click(travel.nextElementSibling);

  // Sliders: [officeDays, dietDays, heatingHours]
  const sliders = screen.getAllByRole('slider');
  const officeSlider = sliders[0];
  fireEvent.change(officeSlider, { target: { value: 3 } });

  const dietSlider = sliders[1];
  fireEvent.change(dietSlider, { target: { value: 4 } });

  // Click the 'Chicken' option (radio) by finding the text and clicking its sibling button
  const chicken = screen.getByText(/Chicken/i);
  fireEvent.click(chicken.nextElementSibling);

  const heatingSlider = sliders[2];
  fireEvent.change(heatingSlider, { target: { value: 6 } });

  fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

  await waitFor(() => {
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});



// test("allows selecting transport, diet, and home efficiency options", () => {
//     render(<Questionnaire />);

//     // Select one of each option group
//     const transportOption = screen.getByLabelText(/Car \(Electric\)/i);
//     const dietOption = screen.getByLabelText(/Vegan/i);
//     const homeOption = screen.getByLabelText(/Inefficient/i);

//     // Simulate selecting them
//     fireEvent.click(transportOption);
//     fireEvent.click(dietOption);
//     fireEvent.click(homeOption);

//     // Verify they are selected
//     expect(transportOption).toBeChecked();
//     expect(dietOption).toBeChecked();
//     expect(homeOption).toBeChecked();
// });


// test("submits questionnaire successfully and navigates to /dashboard", async () => {
//     mockedAxios.post.mockResolvedValueOnce({
//       data: { message: "Questionnaire submitted successfully" },
//     });

//     render(<Questionnaire />);

//     // Select one option from each question
//     fireEvent.click(screen.getByLabelText(/Car \(Electric\)/i));
//     fireEvent.click(screen.getByLabelText(/Vegan/i));
//     fireEvent.click(screen.getByLabelText(/Moderately Efficient/i));

//     // Click the Continue button
//     fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

//     await waitFor(() => {
//       expect(mockedAxios.post).toHaveBeenCalledWith(
//         "http://localhost:9099/api/questionnaire",
//         {
//           transportMethod: 3,
//           diet: 3,
//           homeEfficiency: 1,
//         },
//         { withCredentials: true }
//       );
//       expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
//     });
// });


// test("handles submission error gracefully", async () => {
//     mockedAxios.post.mockRejectedValueOnce(new Error("Network Error"));

//     render(<Questionnaire />);

//     // Select one option from each question
//     fireEvent.click(screen.getByLabelText(/Car \(Electric\)/i));
//     fireEvent.click(screen.getByLabelText(/Vegan/i));
//     fireEvent.click(screen.getByLabelText(/Moderately Efficient/i));

//     // Click the Continue button
//     fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

//     await waitFor(() => {
//       expect(mockedAxios.post).toHaveBeenCalled();
//       // Ensure navigation does not occur on error
//       expect(mockNavigate).not.toHaveBeenCalled();
//     });
// });
