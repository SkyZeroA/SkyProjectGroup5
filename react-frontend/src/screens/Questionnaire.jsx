import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import FooterBanner from "../components/FooterBanner";
import HeaderBanner from "../components/HeaderBanner";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Questions from "../components/Questions";

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [submissionError, setSubmissionError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(""); // Reset previous error

    console.log("Submitting Answers:", answers);
    try {
      const response = await axios.post(
        "http://localhost:9099/api/set-questionnaire",
        answers,
        { withCredentials: true }
      );
      console.log("Response:", response.data);
      if (response?.data?.message === "Questionnaire submitted successfully") {
        navigate("/about");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmissionError("There was an issue submitting your answers. Please try again.");
      // Optionally, move focus to the error message
      const errorAlert = document.getElementById("submission-error");
      if (errorAlert) errorAlert.focus();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <header className="top-0 z-10 bg-white shadow-md">
        <HeaderBanner />
      </header>

      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-white focus:p-2 focus:z-50"
      >
        Skip to main content
      </a>

      <main id="main-content" className="flex-1 overflow-y-auto px-6 py-12 space-y-12">
        {/* Welcome Card */}
        <Card className="mx-auto max-w-2xl bg-white">
          <CardContent>
            <h1
              id="questionnaire-heading"
              className="mb-4 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Sky_Text',Helvetica] font-normal text-transparent text-[38px] text-center leading-[57px]"
            >
              Welcome to ClearSky
            </h1>
            <p className="mt-4 text-center text-xl [font-family:'Sky_Text',Helvetica]">
              You will now be asked a series of lifestyle questions relating to your carbon
              footprint so that we can calculate a baseline.
            </p>
          </CardContent>
        </Card>

        {/* Questionnaire Form */}
        <form
          onSubmit={handleSubmit}
          aria-labelledby="questionnaire-heading"
          className="space-y-12"
        >
          <section aria-label="Questionnaire questions">
            <Questions
              onAnswersChange={setAnswers}
              isEditing={true}
              initialAnswers={answers}
            />
          </section>

          {/* Submission Section */}
          <div className="flex flex-col items-center space-y-4">
            {submissionError && (
              <div
                id="submission-error"
                tabIndex="-1"
                role="alert"
                className="text-red-600 font-semibold"
              >
                {submissionError}
              </div>
            )}

            <p className="text-xl text-center">Press to submit answers</p>
            <Button
              type="submit"
              variant="link"
              className="w-64 bg-[#7399ff] hover:bg-[#5577dd] text-white rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-[#4bad31] focus:ring-offset-2"
            >
              Continue
            </Button>
          </div>
        </form>
      </main>

      <footer>
        <FooterBanner />
      </footer>
    </div>
  );
};

export default Questionnaire;
