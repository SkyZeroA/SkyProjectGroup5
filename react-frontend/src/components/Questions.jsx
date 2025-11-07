import React, {useState, useEffect } from 'react'
import RadioQuestion from './RadioQuestion';
import SliderQuestion from './SliderQuestion';

const Questions = ({onAnswersChange, isEditing, initialAnswers = {} }) => {
  const [transportMethod, setTransportMethod] = useState(0);
  const [travelDistance, setTravelDistance] = useState(0);
  const [officeDays, setOfficeDays] = useState(0);
  const [dietDays, setDietDays] = useState(0);
  const [meats, setMeats] = useState(0);
  const [heatingHours, setHeatingHours] = useState(0);
  const [turnOffDevices, setTurnOffDevices] = useState(0);
  const [recycle, setRecycle] = useState(0);
  const [reusable, setReusable] = useState(0);
  const [foodWaste, setFoodWaste] = useState(0);
	
	// Keeps track of current question
  // Used to make numbers consistent with conditionally displayed questions
  let questionNumber = 1;

	useEffect(() => {
    if (initialAnswers) {
      setTransportMethod(initialAnswers.transportMethod ?? 0);
      setTravelDistance(initialAnswers.travelDistance ?? 0);
      setOfficeDays(initialAnswers.officeDays ?? 0);
      setDietDays(initialAnswers.dietDays ?? 0);
      setMeats(initialAnswers.meats ?? 0);
      setHeatingHours(initialAnswers.heatingHours ?? 0);
	  setTurnOffDevices(initialAnswers.turnOffDevices ?? 0);
	  setRecycle(initialAnswers.recycle ?? 0);
	  setReusable(initialAnswers.reusable ?? 0);
	  setFoodWaste(initialAnswers.foodWaste ?? 0);
    }
  }, [initialAnswers]);

	// Notify parent whenever answers change
  useEffect(() => {
    if (onAnswersChange) {
      onAnswersChange({
        transportMethod,
        travelDistance,
        officeDays,
        dietDays,
        meats,
        heatingHours,
		turnOffDevices,
		recycle,
		reusable,
		foodWaste
      });
    }
  }, [
		transportMethod,
		travelDistance,
		officeDays, 
		dietDays, 
		meats, 
		heatingHours,
		turnOffDevices,
		recycle,
		reusable,
		foodWaste,
		onAnswersChange
	]);

	return (
		<div
      className={`transition-opacity duration-300 space-y-6 text-[14px] md:text-base ${
        isEditing ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"
      }`}
    >
			<RadioQuestion
				options={[
					{ value: 0, label: "Work from Home" },
					{ value: 1, label: "Walk/Cycle" },
					{ value: 2, label: "Public Transport (Bus/Train)" },
					{ value: 3, label: "Car (Petrol/ Diesel)" },
					{ value: 4, label: "Car (Electric)" },
				]}
				current={transportMethod}
				setCurrent={setTransportMethod}
				question={`Question ${questionNumber++}: How do you usually commute to work?`}
			/>

			{ transportMethod !== 0 && (
			<>
				<RadioQuestion
					options={[
						{ value: 0, label: "0-5" },
						{ value: 1, label: "5-10" },
						{ value: 2, label: "10-15" },
						{ value: 3, label: "15-20" },
						{ value: 4, label: "20-30" },
						{ value: 5, label: "30+" },
					]}
					current={travelDistance}
					setCurrent={setTravelDistance}
					question={`Question ${questionNumber++}: How far do you travel to get to work? (in miles)`}
				/>

				<SliderQuestion
					max={7}
					current={officeDays}
					setCurrent={setOfficeDays}
					question={`Question ${questionNumber++}: How many days a week are you in the office?`}
				/>
			</>
			)}

			<SliderQuestion
				max={7}
				current={dietDays}
				setCurrent={setDietDays}
				question={`Question ${questionNumber++}: How many days a week do you eat meat?`}
			/>

			{ dietDays !== 0 && (
				<RadioQuestion
					options={[
						{ value: 0, label: "Beef" },
						{ value: 1, label: "Lamb" },
						{ value: 2, label: "Pork" },
						{ value: 3, label: "Chicken" },
						{ value: 4, label: "Turkey" },
						{ value: 5, label: "Fish" },
					]}
					current={meats}
					setCurrent={setMeats}
					question={`Question ${questionNumber++}: Which meat do you eat most?`}
				/>
			)}

			<SliderQuestion
			max={24}
			jump={2}
			current={heatingHours}
			setCurrent={setHeatingHours}
			question={`Question ${questionNumber++}: How many hours per day do you have your heating on in winter?`}
			/>

			<RadioQuestion 
				options={[
					{ value: 0, label: "Always" },
					{ value: 1, label: "Most of the time" },
					{ value: 2, label: "Sometimes" },
					{ value: 3, label: "Rarely" },
				]}
				current={turnOffDevices}
				setCurrent={setTurnOffDevices}
				question={`Question ${questionNumber++}: How often do you switch off electronic devices (monitor, laptop, tv) after use?`}
			/>

			<RadioQuestion 
				options={[
					{ value: 0, label: "Always" },
					{ value: 1, label: "Most of the time" },
					{ value: 2, label: "Sometimes" },
					{ value: 3, label: "Rarely" },
				]}
				current={recycle}
				setCurrent={setRecycle}
				question={`Question ${questionNumber++}: How often do you recycle items like paper, plastic, and cans?`}
			/>

			<RadioQuestion 
				options={[
					{ value: 0, label: "Always" },
					{ value: 1, label: "Most of the time" },
					{ value: 2, label: "Sometimes" },
					{ value: 3, label: "Rarely" },
				]}
				current={reusable}
				setCurrent={setReusable}
				question={`Question ${questionNumber++}: How often do you use reusable bottles, coffee cups, or shopping bags?`}
			/>

			<RadioQuestion 
				options={[
					{ value: 0, label: "Rarely" },
					{ value: 1, label: "Sometimes" },
					{ value: 2, label: "Often" },
				]}
				current={foodWaste}
				setCurrent={setFoodWaste}
				question={`Question ${questionNumber++}: How often do you end up with leftover or wasted food?`}
			/>
		</div>
	);
}

export default Questions;