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

    // Options for now, will use JSON file later ?
  const transportOptions = [
    { value: "car", label: "Car", left: "left-52" },
    { value: "bike", label: "Bike", left: "left-[457px]" },
    { value: "bus", label: "Bus", left: "left-[706px]" },
    { value: "train", label: "Train", left: "left-[955px]" },
    { value: "walk", label: "Walk", left: "left-[1204px]" },
    { value: "plane", label: "Plane", left: "left-[1453px]" },
  ];

  const distanceOptions = [
    { value: "0-5", label: "0-5", left: "left-52" },
    { value: "5-10", label: "5-10", left: "left-[457px]" },
    { value: "10-15", label: "10-15", left: "left-[706px]" },
    { value: "15-20", label: "15-20", left: "left-[955px]" },
    { value: "20-30", label: "20-30", left: "left-[1204px]" },
    { value: "30+", label: "30+", left: "left-[1453px]" },
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
    <div className="bg-neutral-50 min-h-screen w-full">
      <HeaderBanner />

      {/* Intro card, centered and responsive */}
      <div className="container mx-auto px-4">
        <Card className="mx-auto mt-12 max-w-2xl bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <h1 className="text-center text-3xl md:text-4xl font-semibold text-green-600">
              Welcome to ClearSky
            </h1>
            <p className="mt-4 text-center text-sm md:text-base text-gray-700">
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
              className="flex justify-between items-center w-full mt-6 px-6 overflow-x-auto"
            >
              {transportOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-3 min-w-[120px] justify-center">
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
        <Card className="mx-auto mt-6 max-w-5xl bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <h2 className="text-lg md:text-2xl font-medium text-gray-900 text-center">
              Question 2: How far do you travel to get to work? (in miles)
            </h2>

            <RadioGroup
              value={travelDistance}
              onValueChange={setTravelDistance}
              className="flex justify-between items-center w-full mt-6 px-6 overflow-x-auto"
            >
              {distanceOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-3 min-w-[120px] justify-center">
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
              <Slider value={officeDays} onChange={setOfficeDays} min={0} max={7} />

              <div className="mt-6 grid grid-cols-8 gap-2 text-center text-xs md:text-sm text-gray-700">
                {dayLabels.map((day, index) => (
                  <div key={index} className="flex justify-center">
                    {day.label}
                  </div>
                ))}
              </div>

              {/* visual bar (kept simple and responsive) */}
              <div className="mt-4 h-3 bg-gray-200 rounded-full w-full">
                <div className="h-3 bg-[#7399ff] rounded-full transition-all duration-200" style={{ width: `${(officeDays / 7) * 100}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-gray-700">Press to submit answers</div>

        <div className="flex justify-center mt-4">
          <Button className="bg-[#7399ff] hover:bg-[#5577dd] text-white rounded-md px-6 py-2">Continue</Button>
        </div>

        <div className="flex justify-center mt-6">
          <img alt="Sky Zero Logo" src="/image-5.png" className="w-36 h-auto" />
        </div>
      </div>

      <FooterBanner />
    </div>
  );
};

export default Questionnaire;