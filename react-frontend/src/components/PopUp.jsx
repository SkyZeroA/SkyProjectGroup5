// components/PopupForm.jsx or .tsx

import React, {useState, useEffect} from "react";
import { Card, CardContent } from "./Card";
import axios from "axios";

const PopupForm = ({ isOpen, onClose, questions, points, allQuestions, allPoints, onActivitiesSave }) => {
    const [answers, setAnswers] = useState({});
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [isEditingActivities, setIsEditingActivities] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
      const fetchActivityCounts = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/user-activity-counts`, { withCredentials: true });
          setAnswers(response.data || {});
        } catch (error) {
          console.error("Error fetching activity counts:", error);
        }
      };
      if (isOpen) {
        fetchActivityCounts();
      }
    }, [isOpen, questions]);

    if (!isOpen) {return null; }

    const increment = (question) => {
        setAnswers((prev) => ({
        ...prev,
        [question]: Number(prev[question]) + 1,
        }));
    };

    const decrement = (question) => {
        setAnswers((prev) => ({
        ...prev,
        [question]: Math.max(0, Number(prev[question]) - 1),
        }));
    };

  const handleSubmit = async (question, isPositive) => {
    try {
      const response = await axios.post(`${apiUrl}/api/log-activity`, {question, isPositive}, { withCredentials: true });
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
        className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-300 flex flex-col
          ${
            isEditingActivities
              ? "w-[90vw] max-w-7xl max-h-[90vh]"
              : questions.length > 8
              ? "w-[90vw] max-w-7xl max-h-[90vh]"
              : questions.length > 5
              ? "w-[90vw] max-w-4xl max-h-[90vh]"
              : "w-[90vw] max-w-md max-h-[80vh]"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="flex flex-col flex-grow p-0">
          <h2 className="text-xl font-semibold text-center mb-4">
            {isEditingActivities ? "Edit Your Activities" : "Log Your Activities"}
          </h2>
          <div className="flex-grow overflow-y-auto pr-2 max-h-[60vh]">
            {isEditingActivities ? (
              <div
                className={`grid gap-4
                  ${
                    allQuestions.length > 15
                      ? "grid-cols-4"
                      : allQuestions.length > 8
                      ? "grid-cols-3"
                      : allQuestions.length > 4
                      ? "grid-cols-2"
                      : "grid-cols-1"
                  }`}
              >
                {allQuestions.map((activity, index) => {
                  const isSelected = selectedActivities.includes(activity);
                  const points = allPoints[index];
                  return (
                    <div
                      key={activity}
                      onClick={() => handleActivitySelect(activity)}
                      className={`cursor-pointer p-4 border rounded-md shadow-sm transition
                        ${
                          isSelected
                            ? "bg-green-100 border-green-600 text-green-800"
                            : "bg-white hover:bg-gray-100"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{activity}</span>
                        <span className="text-xs font-light">({points} pts)</span>
                        {isSelected && (
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <form>
                <p className="text-sm text-gray-700 font-normal mb-4">
                  Activity counts will reset at the start of each week.
                </p>
                  <div
                    className={`grid gap-4
                      grid-cols-1
                      ${questions.length > 20 ? "xl:grid-cols-5" : ""}
                      ${questions.length > 15 ? "lg:grid-cols-4" : ""}
                      ${questions.length > 8 ? "md:grid-cols-3" : ""}
                      ${questions.length > 5 ? "sm:grid-cols-2" : ""}
                    `}
                  >
                  {questions.length === 0 ? (
                    <p className="text-gray-600 text-sm italic">
                      No activities set. Click "Edit Activities" below to add some.
                    </p>
                  ) : (
                    questions.map((question, index) => {
                      const questionPoints = points[index] || 0;
                      return (
                        <div key={question} className="mb-2">
                          <label className="block mb-2 font-medium text-gray-800">
                            {question} ({questionPoints} pts)
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                if ((answers[question] || 0) > 0) {
                                  decrement(question);
                                  handleSubmit(question, 0);
                                }
                              }}
                              className="bg-gray-200 px-3 py-1 rounded text-lg"
                            >
                              −
                            </button>
                            <span className="text-lg w-8 text-center">{answers[question] || 0}</span>
                            <button
                              type="button"
                              onClick={() => {
                                increment(question);
                                handleSubmit(question, 1);
                              }}
                              className="bg-gray-200 px-3 py-1 rounded text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </form>
            )}
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            {isEditingActivities ? (
              <div className="justify-end flex w-full gap-2">
                <button
                  className="bg-gray-200 px-4 py-2 rounded"
                  onClick={() => setIsEditingActivities(false)}
                >
                  Cancel
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleActivitiesSave}>
                  Save
                </button>
              </div>
            ) : (
              <div className="justify-between flex w-full gap-2">
                <button
                  onClick={() => {
                    if (!isEditingActivities) {
                      setSelectedActivities([...questions]);
                    }
                    setIsEditingActivities(true);
                  }}
                  type="button"
                  className="flex bg-green-600 text-white px-4 py-2 rounded"
                >
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopupForm;
