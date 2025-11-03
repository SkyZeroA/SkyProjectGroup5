import React, { useState } from 'react';

const Switch = ({ setOutput, option1, option2 }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(newState);
    setOutput(newState);
  };

  return (
    <div className="flex justify-center items-center">
      <button
        role="switch"
        aria-checked={isOn}
        onClick={toggleSwitch}
        className="w-20 h-12 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleSwitch();
        }}
      >
        <div
          className={`w-10 h-10 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isOn ? "translate-x-8" : "translate-x-0"
          }`}
        ></div>
      </button>
    </div>
  );
};

export default Switch;
