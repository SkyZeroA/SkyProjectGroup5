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

  const dayLabels = Array.from({ length: 8 }, (_, i) => i.toString());

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Sticky Header */}
      <div className="top-0 z-10 bg-white shadow-md">
        <HeaderBanner />
      </div>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-6 py-12 space-y-12">
        {/* Welcome Card */}
        <Card className="mx-auto max-w-2xl">
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
        <Card className="bg-white">
          <CardContent>
            <h2 className="text-2xl text-center mb-6">
              Question 1: How do you get to work?
            </h2>
            <RadioGroup
              value={transportMethod}
              onValueChange={setTransportMethod}
              className="flex justify-between items-center w-full mt-12 px-12 gap-8"
            >
              {transportOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <Label className="text-xl">{option.label}</Label>
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="w-6 h-6 mt-2 bg-[#ebebeb] border-0 data-[state=checked]:bg-[#7399ff]"
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
                    className="w-6 h-6 mt-2 bg-[#ebebeb] border-0 data-[state=checked]:bg-[#7399ff]"
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

        {/* Submit Section */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl">Press to submit answers</p>
          <Button className="w-64 bg-[#7399ff] hover:bg-[#5577dd] text-white rounded-md text-lg">
            Continue
          </Button>
          <img
            className="w-[141px] h-[79px]"
            alt="Sky Zero Logo"
            src="/image-5.png"
          />
        </div>
      </main>

      {/* Footer */}
      <FooterBanner />
    </div>
  );
};

export default Questionnaire;
