import { useState } from "react";

const Slider = () => {
  const [value, setValue] = useState(50);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="w-full max-w-md mx-auto p-12">
      <label htmlFor="slider" className="block text-lg font-medium mb-2">
        Value: {value}
      </label>
      <input
        id="slider"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
};

export default Slider;
