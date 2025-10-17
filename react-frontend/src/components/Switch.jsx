import React, { useState } from 'react';

const Switch = ({ setOutput, option1, option2 }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(newState);
    setOutput(newState);
  };

  return (
    <div
      className="w-20 h-12 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)]"
      onClick={toggleSwitch}
    >
      <div
        className={`w-10 h-10 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? 'translate-x-8' : 'translate-x-0'
        }`}
      ></div>
    </div>
  );
};

export default Switch;
