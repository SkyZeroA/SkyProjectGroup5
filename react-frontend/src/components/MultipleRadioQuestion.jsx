import React from "react";
import { Card, CardContent } from "./Card";

const MultiSelectQuestion = ({ options, current = [], setCurrent, question }) => {
  const handleChange = (value) => {
    if (current.includes(value)) {
      // Remove it
      setCurrent(current.filter((v) => v !== value));
    } else {
      // Add it
      setCurrent([...current, value]);
    }
  };

  return (
    <Card className="mx-auto mt-8 max-w-5xl bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <h2 className="text-lg md:text-2xl [font-family:'Sky_Text',Helvetica] font-normal text-gray-900 p-2">
          {question}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-4">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 min-w-[120px] min-h-[50px] justify-center cursor-pointer"
            >
              <input
                type="checkbox"
                value={option.value}
                checked={current.includes(option.value)}
                onChange={() => handleChange(option.value)}
                className="w-6 h-6 accent-[#7399ff]"
              />
              <span className="[font-family:'Sky_Text',Helvetica] font-normal text-[#4a4a4a] text-[clamp(13px,2vw,16px)] leading-[22.5px]">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiSelectQuestion;
