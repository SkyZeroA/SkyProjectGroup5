import { useState } from "react";

const Slider = ({ value: controlledValue, onChange, min = 0, max = 100 }) => {
  const [internalValue, setInternalValue] = useState(50);
  const isControlled = controlledValue !== undefined && onChange;

  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e) => {
    const v = Number(e.target.value);
    if (isControlled) onChange(v);
    else setInternalValue(v);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <label htmlFor="slider" className="block text-sm md:text-base font-medium mb-2 text-gray-700">
        Value: {value}
      </label>
      <input
        id="slider"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
};

export default Slider;
