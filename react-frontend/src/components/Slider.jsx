import { useState } from "react";

const Slider = ({ id, value: controlledValue, onChange, min = 0, max = 100, jump = 1 }) => {
  const [internalValue, setInternalValue] = useState(50);
  const isControlled = controlledValue !== undefined && onChange;

  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e) => {
    const v = Number(e.target.value);
    if (isControlled) onChange(v);
    else setInternalValue(v);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  const dayLabels = [];
  for (let i = min; i <= max; i += jump) {
    dayLabels.push({ label: i.toString() });
  }

  return (
    <div className="w-full p-4">
      <div className="flex relative w-full h-3 rounded-full bg-gray-200">
        <div
          className="absolute top-0 left-0 h-3 bg-[#7399ff] rounded-full pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full pointer-events-none"
          style={{ left: `${percentage}%` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer"
        />

        <div className="absolute left-0 right-0 flex justify-between mt-6 w-full text-center text-xs md:text-sm text-gray-700">
          {dayLabels.map((day, index) => (
            <div key={index} className="flex justify-between [font-family:'Sky_Text',Helvetica] font-normal">
              {day.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;