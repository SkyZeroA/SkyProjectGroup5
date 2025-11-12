import React from "react";
import { Card, CardContent } from "./Card";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

const RadioQuestion = ({ options, current, setCurrent, question }) => {
  // Generate a unique prefix for this question’s radios
  const groupId = question.replace(/\s+/g, "-").toLowerCase();

  return (
    <Card className="mx-auto mt-8 max-w-5xl bg-white rounded-lg">
      <CardContent className="p-6">
        <h2 className="text-lg md:text-2xl [font-family:'Sky_Text',Helvetica] font-normal text-gray-900 p-2">
          {question}
        </h2>
        <RadioGroup
          value={current}
          onValueChange={setCurrent}
          className="flex justify-between grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-x-8 lg:gap-x-6 md:gap-x-4 sm:gap-x-8 lg:gap-y-2 [font-family:'Sky_Text',Helvetica] font-normal text-[#4a4a4a] text-[clamp(13px,2vw,16px)] leading-[22.5px]"
        >
          {options.map((option) => {
            const uniqueId = `${groupId}-${option.value}`;
            return (
              <div
                key={option.value}
                className="flex items-center justify-between gap-2 w-36 lg:w-28 min-h-[50px] px-3 mx-auto"
              >
                {/* Properly link label to input using htmlFor */}
                <label
                  htmlFor={uniqueId}
                  className="text-sm md:text-base [font-family:'Sky_Text',Helvetica] font-normal mr-2 whitespace-normal break-words cursor-pointer"
                >
                  {option.label}
                </label>
                <RadioGroupItem
                  value={option.value}
                  id={uniqueId}
                  className="w-7 h-7 bg-[#ebebeb] border-0 data-[state=checked]:bg-[#7399ff] data-[state=checked]:text-white"
                />
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default RadioQuestion;
