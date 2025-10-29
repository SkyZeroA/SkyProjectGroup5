import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import FooterBanner from "../components/FooterBanner";
import HeaderBanner from "../components/HeaderBanner";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Questions from "../components/Questions";

const Questionnaire = () => {
  const [answers, setAnswers] = useState();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Submitting Answers:", answers);
    await axios.post("http://localhost:9099/api/questionnaire", answers, { withCredentials: true })
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

        {/* Contains all questions and answers */}
        <Questions onAnswersChange={setAnswers}/>

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
