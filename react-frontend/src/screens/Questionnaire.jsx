import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import FooterBanner from "../components/FooterBanner";
import HeaderBanner from "../components/HeaderBanner";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import RadioQuestion from "../components/RadioQuestion";
import SliderQuestion from "../components/SliderQuestion";

const Questionnaire = () => {
  const [transportMethod, setTransportMethod] = useState(0);
  const [travelDistance, setTravelDistance] = useState(0);
  const [officeDays, setOfficeDays] = useState(0);
  const [dietDays, setDietDays] = useState(0);
  const [meats, setMeats] = useState(0);
  const [heatingHours, setHeatingHours] = useState(0);

  // Keeps track of current question
  // Used to make numbers consistent with conditionally displayed questions
  let questionNumber = 1;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const questionnairePayload = { 
      "transportMethod": transportMethod,
      "travelDistance": travelDistance,
      "officeDays": officeDays,
      "dietDays": dietDays,
      "meats": meats,
      "heatingHours": heatingHours,
    };
    console.log("Questionnaire Payload:", questionnairePayload);

    await axios.post("http://localhost:9099/api/questionnaire", questionnairePayload, { withCredentials: true })
      .then((response) => {
        console.log("Response:", response.data);
        if (response?.data?.message === "Questionnaire submitted successfully") {
          navigate("/dashboard")
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <div className="top-0 z-10 bg-white shadow-md">
        <HeaderBanner />
      </div>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-6 py-12 space-y-12">
        {/* Welcome Card */}
        <Card className="mx-auto max-w-2xl bg-white">
          <CardContent>
            <h1 className="mb-4 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Sky_Text',Helvetica] font-normal text-transparent text-[38px] text-center leading-[57px]">
              Welcome to ClearSky
            </h1>
            <p className="mt-4 text-center text-xl [font-family:'Sky_Text',Helvetica]">
              You will now be asked a series of lifestyle questions relating to your carbon
              footprint so that we can calculate a baseline.
            </p>
          </CardContent>
        </Card>

        {/* Questions */}
        <RadioQuestion
          options={[
            { value: 0, label: "Work from Home" },
            { value: 1, label: "Walk/Cycle" },
            { value: 2, label: "Public Transport (Bus/Train)" },
            { value: 3, label: "Car (Petrol/Diesel)" },
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


        {/* Submit Section */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl">Press to submit answers</p>
          <Button variant="link" className="w-64 bg-[#7399ff] hover:bg-[#5577dd] text-white rounded-md text-lg" onClick={handleSubmit}>
            Continue
          </Button>
        </div>
  
      </main>

      {/* Footer */}
      <FooterBanner />
    </div>
  );
};

export default Questionnaire;
