// components/PopupForm.jsx or .tsx

import React, {useState, useEffect} from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import axios from "axios";

const PopupForm = ({ isOpen, onClose, questions, allQuestions, onActivitiesSave }) => {
    const [answers, setAnswers] = useState({});
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [isEditingActivities, setIsEditingActivities] = useState(false);

    // useEffect(() => {
    //     if (isOpen) {
    //     const initialAnswers = questions.reduce((acc, q) => {
    //         acc[q] = 0;
    //         return acc;
    //     }, {});
    //     setAnswers(initialAnswers);
    //     }
    // }, [isOpen, questions]);

    // if (!isOpen) {return null; }

    useEffect(() => {
      const fetchActivityCounts = async () => {
        try {
          const response = await axios.get("http://localhost:9099/api/user-activity-counts", { withCredentials: true });
          setAnswers(response.data);
        } catch (error) {
          console.error("Error fetching activity counts:", error);
        }
      };

      if (isOpen) {
        fetchActivityCounts();
      }
    }, [isOpen]);

    if (!isOpen) {return null; }



    const increment = (question) => {
        setAnswers((prev) => ({
        ...prev,
        [question]: prev[question] + 1,
        }));
    };

    const decrement = (question) => {
        setAnswers((prev) => ({
        ...prev,
        [question]: Math.max(0, prev[question] - 1), // prevent negatives
        }));
    };

  //   const handleSubmit = (e) => {
  //       e.preventDefault();
  //       onSubmit(answers);
  //       onClose();
  // };
  const handleSubmit = async (question, isPositive) => {
    try {
      const response = await axios.post("http://localhost:9099/api/log-activity", {question, isPositive}, { withCredentials: true });
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleActivitiesSave = async () => {
    await onActivitiesSave(selectedActivities);
    setIsEditingActivities(false);
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <Card
        className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent>
          <h2 className="text-xl font-semibold justify-center mb-4">{isEditingActivities ? "Edit Your Activities" : "Log Your Activities"}</h2>
          {isEditingActivities ? (
            <div>
            <div className="max-h-80 overflow-y-auto pr-2">
              {allQuestions.map((activity) => (
                <label key={activity} className="block mb-2">
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(activity)}
                    onChange={() => handleActivitySelect(activity)}
                    className="mr-2"
                  />
                  {activity}
                </label>
              ))}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setIsEditingActivities(false)}>
                  Cancel
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleActivitiesSave}>
                  Save
                </button>
              </div>
              </div>
          ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600 text-gray-700 [font-family:'Sky_Text',Helvetica] font-normal">Activity counts will reset at the start of each week.</p>
            <div className="max-h-80 overflow-y-auto pr-2 mt-4">
            {questions.map((question) => (
              <div key={question} className="mb-4">
                <label className="block mb-2 font-medium text-gray-800">
                  {question}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {decrement(question); handleSubmit(question, 0)}}
                    className="bg-gray-200 px-3 py-1 rounded text-lg"
                  >
                    −
                  </button>
                  <span className="text-lg w-8 text-center">{answers[question]}</span>
                  <button
                    type="button"
                    onClick={() => {increment(question); handleSubmit(question, 1)}}
                    className="bg-gray-200 px-3 py-1 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            </div>

            <div className="flex justify-between gap-2 mt-6">
              <button onClick={() => {
    if (!isEditingActivities) {
      setSelectedActivities([...questions]);
    }
    setIsEditingActivities((prev) => !prev);
  }} type="button" className="flex bg-green-600 text-white px-4 py-2 rounded">
            Edit Activities
          </button>
              <button
                type="button"
                className="flex bg-green-600 text-white px-4 py-2 rounded"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PopupForm;
