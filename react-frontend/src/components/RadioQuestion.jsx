import React from "react";
import { Card, CardContent } from "./Card";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

const RadioQuestion = ({options, current, setCurrent, question}) => {
	return (
		<Card className="mx-auto mt-8 max-w-5xl bg-white rounded-lg shadow">
			<CardContent className="p-6">
				<h2 className="text-lg md:text-2xl [font-family:'Sky_Text',Helvetica] font-normal text-gray-900 p-2">
					{question}
				</h2>
				<RadioGroup
					value={current}
					onValueChange={setCurrent}
					className={
						"flex justify-between grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-x-8 lg:gap-x-6 md:gap-x-4 sm:gap-x-8 lg:gap-y-2" +
						" [font-family:'Sky_Text',Helvetica] font-normal text-[#4a4a4a] text-[clamp(13px,2vw,16px)] leading-[22.5px]"
					}>
					{options.map((option) => (
						<div key={option.value} className="flex items-center gap-3 min-w-[120px] min-h-[50px] justify-center">
							<span className="text-sm md:text-base cursor-pointer [font-family:'Sky_Text',Helvetica] font-normal">
								{option.label}
							</span>
							<RadioGroupItem
								value={option.value}
								id={option.value}
								className="w-7 h-7 bg-[#ebebeb] border-0 data-[state=checked]:bg-[#7399ff] data-[state=checked]:text-white"
							/>
						</div>
					))}
				</RadioGroup>
			</CardContent>
		</Card>
	);
};

export default RadioQuestion;