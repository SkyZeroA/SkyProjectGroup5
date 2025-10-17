// components/PopupForm.jsx or .tsx

import React from "react";
import { Card, CardContent } from "./Card";

const PopupForm = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          <h2 className="text-xl font-semibold mb-4">Add Score</h2>

          {/* Example form */}
          <form>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Score"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
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
