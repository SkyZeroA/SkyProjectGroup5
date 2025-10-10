import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import FooterBanner from "../components/FooterBanner";
import HeaderBanner from "../components/HeaderBanner";
import Slider from "../components/Slider";
import { Label } from "../components/Label";
import { RadioGroup, RadioGroupItem } from "../components/RadioGroup";

const Questionnaire = () => {
  const [transportMethod, setTransportMethod] = useState("bike");
  const [travelDistance, setTravelDistance] = useState("15-20");
  const [officeDays, setOfficeDays] = useState(2);

  const transportOptions = [
    { value: "car", label: "Car" },
    { value: "bike", label: "Bike" },
    { value: "bus", label: "Bus" },
    { value: "train", label: "Train" },
    { value: "walk", label: "Walk" },
    { value: "plane", label: "Plane" },
  ];

  const distanceOptions = [
    { value: "0-5", label: "0-5" },
    { value: "5-10", label: "5-10" },
    { value: "10-15", label: "10-15" },
    { value: "15-20", label: "15-20" },
    { value: "20-30", label: "20-30" },
    { value: "30+", label: "30+" },
  ];

  const dayLabels = [
    { label: "0", left: "left-52" },
    { label: "1", left: "left-[386px]" },
    { label: "2", left: "left-[564px]" },
    { label: "3", left: "left-[742px]" },
    { label: "4", left: "left-[920px]" },
    { label: "5", left: "left-[1098px]" },
    { label: "6", left: "left-[1276px]" },
    { label: "7", left: "left-[1454px]" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Sticky Header */}
      <div className="top-0 z-10 bg-white shadow-md">
        <HeaderBanner />
      </div>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-6 py-12 space-y-12">
        {/* Welcome Card */}
        <Card className="mx-auto max-w-2xl bg-white">
          <CardContent>
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-300 via-green-500 to-green-700 text-transparent bg-clip-text">
              Welcome to ClearSky
            </h1>
            <p className="mt-4 text-center text-xl">
              You will now be asked a series of questions relating to your carbon
              footprint so that we can calculate a baseline.
            </p>
          </CardContent>
        </Card>

        {/* Question 1 */}
        <Card className="mx-auto mt-8 max-w-5xl bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <h2 className="text-lg md:text-2xl font-medium text-gray-900 text-center">
              Question 1: How do you get to work?
            </h2>
            <RadioGroup
              value={transportMethod}
              onValueChange={setTransportMethod}
              className={
                "flex justify-between grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-x-8 lg:gap-x-6 md:gap-x-4 sm:gap-x-8 lg:gap-y-2" +
                "[font-family:'Sky_Text',Helvetica] font-normal text-[#4a4a4a] text-[clamp(13px,2vw,16px)] leading-[22.5px]"
              }>
              {transportOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-3 min-w-[120px] min-h-[50px] justify-center">
                  <Label className="text-sm md:text-base cursor-pointer">{option.label}</Label>
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

        {/* Question 2 */}
        <Card className="mx-auto mt-8 max-w-5xl bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <h2 className="text-lg md:text-2xl font-medium text-gray-900 text-center">
              Question 2: How far do you travel to get to work? (in miles)
            </h2>

            <RadioGroup
              value={travelDistance}
              onValueChange={setTravelDistance}
              className={
                "flex justify-between grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-x-8 lg:gap-x-6 md:gap-x-4 sm:gap-x-8 lg:gap-y-2" +
                "[font-family:'Sky_Text',Helvetica] font-normal text-[#4a4a4a] text-[clamp(13px,2vw,16px)] leading-[22.5px]"
              }
            >
              {distanceOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-3 min-w-[120px] min-h-[50px] justify-center">
                  <Label className="text-sm md:text-base cursor-pointer">{option.label}</Label>
                  <RadioGroupItem
                    value={option.value}
                    id={`distance-${option.value}`}
                    className="w-7 h-7 bg-[#ebebeb] border-0 data-[state=checked]:bg-[#7399ff] data-[state=checked]:text-white"
                  />
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Question 3 */}
        <Card className="mx-auto mt-6 max-w-5xl bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <h2 className="text-lg md:text-2xl font-medium text-gray-900 text-center">
              Question 3: How many days a week are you in the office?
            </h2>

            <div className="mt-6">
              <Slider value={officeDays} onChange={setOfficeDays} min={0} max={7} jump={1} />

              {/* <div className="mt-6 w-full grid grid-cols-8 gap-[9vw] text-center text-xs md:text-sm text-gray-700">
                {dayLabels.map((day, index) => (
                  <div key={index} className="flex justify-center">
                    {day.label}
                  </div>
                ))}
              </div> */}
              {/* visual bar (kept simple and responsive) */}
              {/* <div className="mt-4 h-3 bg-gray-200 rounded-full w-full">
                <div className="h-3 bg-[#7399ff] rounded-full transition-all duration-200" style={{ width: `${(officeDays / 7) * 100}%` }} />
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl">Press to submit answers</p>
          <Button className="w-64 bg-[#7399ff] hover:bg-[#5577dd] text-white rounded-md text-lg">
            Continue
          </Button>
        </div>
  
      </main>

      {/* Footer */}
      <FooterBanner />
    </div>
  );
};

export default Questionnaire;
