// components/PopupForm.jsx or .tsx

import React, {useState, useEffect} from "react";
import { Card, CardContent } from "./Card";

const PopupForm = ({ isOpen, onClose, questions, onSubmit }) => {
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        if (isOpen) {
        const initialAnswers = questions.reduce((acc, q) => {
            acc[q] = 0;
            return acc;
        }, {});
        setAnswers(initialAnswers);
        }
    }, [isOpen, questions]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(answers);
        onClose();
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
          <h2 className="text-xl font-semibold mb-4">Log Your Activities</h2>

          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div key={question} className="mb-4">
                <label className="block mb-2 font-medium text-gray-800">
                  {question}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => decrement(question)}
                    className="bg-gray-200 px-3 py-1 rounded text-lg"
                  >
                    −
                  </button>
                  <span className="text-lg w-8 text-center">{answers[question]}</span>
                  <button
                    type="button"
                    onClick={() => increment(question)}
                    className="bg-gray-200 px-3 py-1 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopupForm;
