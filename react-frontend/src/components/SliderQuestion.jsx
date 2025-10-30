import React from "react";
import { Card, CardContent } from "./Card";
import Slider from "./Slider";

const SliderQuestion = ({min = 0, max, jump, current, setCurrent, question}) => {
	return (
		<Card className="mx-auto max-w-5xl bg-white rounded-lg shadow">
			<CardContent className="p-6 pb-8">
				<h2 className="text-lg md:text-2xl [font-family:'Sky_Text',Helvetica] font-normal text-gray-900 p-2">
					{question}
				</h2>
				<Slider
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