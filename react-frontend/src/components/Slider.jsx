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
    <div className="w-full p-4">
      <div className="mt-4 h-3 bg-gray-200 rounded-full w-full">
        <input
          id="slider"
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="h-3 bg-[#7399ff] rounded-full transition-all duration-200" style={{ width: `${(value / 7) * 100}%` }} />
      </div>
    </div>
  );
};

export default Slider;