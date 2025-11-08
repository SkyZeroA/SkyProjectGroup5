import React from "react";
import { Card, CardContent } from "./Card";
import Slider from "./Slider";

const SliderQuestion = ({ min = 0, max, jump, current, setCurrent, question }) => {
  const sliderId = `slider-${question.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <Card className="mx-auto max-w-5xl bg-white rounded-lg">
      <CardContent className="p-6 pb-8">
        <label
          htmlFor={sliderId}
          className="text-base md:text-2xl [font-family:'Sky_Text',Helvetica] font-normal text-gray-900 p-2 block"
        >
          {question}
        </label>
        <Slider
          id={sliderId}
          value={current}
          onChange={setCurrent}
          min={min}
          max={max}
          jump={jump}
        />
      </CardContent>
    </Card>
  );
};

export default SliderQuestion;