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
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <HeaderBanner/>

      <Card className="absolute top-[106px] left-[609px] w-[510px] h-[249px] bg-white rounded-[7px]">
        <CardContent className="p-0">
          <h1 className="absolute py-6 top-[25px] left-[76px] w-[358px] h-[29px] flex items-center justify-center bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Sky_Text',Helvetica] font-normal text-[38px] text-center tracking-[0] leading-[57px] whitespace-nowrap">
            Welcome to ClearSky
          </h1>
          <p className="absolute top-[99px] left-[58px] w-[402px] h-[132px] flex items-center justify-center [font-family:'Sky_Text',Helvetica] font-normal text-black text-2xl text-center tracking-[0] leading-9">
            You will now be asked a series of questions relating to your carbon
            footprint so that we can calculate a baseline.
          </p>
        </CardContent>
      </Card>

      <Card className="absolute top-[380px] left-[76px] w-[1575px] h-[148px] bg-white rounded-[7px] border-0">
        <CardContent className="p-0">
          <h2 className="absolute top-0 left-[6px] w-[402px] h-[41px] flex items-center justify-center [font-family:'Sky_Text',Helvetica] font-normal text-black text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
            Question 1: How do you get to work?
          </h2>

          <RadioGroup
            value={transportMethod}
            onValueChange={setTransportMethod}
            className="flex justify-between items-center w-full mt-12 px-12"
          >
            {transportOptions.map((option) => (
              <div
                key={option.value}
                className={"flex flex-col items-center"}
              >
                <Label className="w-[67px] h-[41px] flex items-center justify-center [font-family:'Sky_Text',Helvetica] font-normal text-black text-2xl text-center tracking-[0] leading-9 whitespace-nowrap cursor-pointer">
                  {option.label}
                </Label>
                <div className="flex justify-center mt-[14px]">
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="w-[27px] h-[27px] bg-[#ebebeb] border-0 data-[state=checked]:bg-[#7399ff] data-[state=checked]:text-white"
                  />
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="absolute top-[553px] left-[76px] w-[1575px] h-[148px] bg-white rounded-[7px] border-0">
        <CardContent className="p-0">
          <h2 className="absolute top-0 left-[6px] w-[624px] h-[41px] flex items-center justify-center [font-family:'Sky_Text',Helvetica] font-normal text-black text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
            Question 2: How far do you travel to get to work? (in miles)
          </h2>

          <RadioGroup
            value={travelDistance}
            onValueChange={setTravelDistance}
            className="flex justify-between items-center w-full mt-12 px-12"
          >
            {distanceOptions.map((option, index) => (
              <div
                key={option.value}
                className={"flex flex-col items-center"}
              >
                <Label className="w-[67px] h-[41px] flex items-center justify-center [font-family:'Sky_Text',Helvetica] font-normal text-black text-2xl text-center tracking-[0] leading-9 whitespace-nowrap cursor-pointer">
                  {option.label}
                </Label>
                <div className="flex justify-center mt-[14px]">
                  <RadioGroupItem
                    value={option.value}
                    id={`distance-${option.value}`}
                    className="w-[27px] h-[27px] bg-[#ebebeb] border-0 data-[state=checked]:bg-[#7399ff] data-[state=checked]:text-white"
                  />
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="absolute top-[726px] left-[76px] w-[1575px] h-[148px] bg-white rounded-[7px] border-0">
        <CardContent className="p-0">
          <h2 className="absolute top-0 left-[6px] w-[603px] h-[41px] flex items-center justify-center [font-family:'Sky_Text',Helvetica] font-normal text-black text-2xl text-center tracking-[0] leading-9 whitespace-nowrap">
            Question 3: How many days a week are you in the office?
          </h2>
            <Slider />
          <div className="relative">
            {dayLabels.map((day, index) => (
              <div
                key={index}
                className={`absolute top-[53px] ${day.left} w-[67px] h-[41px] flex items-center justify-center [font-family:'Sky_Text',Helvetica] font-normal text-black text-2xl text-center tracking-[0] leading-9 whitespace-nowrap`}
              >
                {day.label}
              </div>
            ))}

            <div className="absolute top-[105px] left-[152px] w-[1272px] h-[27px] bg-[#ebebeb] rounded-[13.5px]" />
            <div className="absolute top-[105px] left-[152px] w-[379px] h-[27px] bg-[#7399ff] rounded-[13.5px]" />
            <div className="absolute top-[105px] left-[508px] w-[27px] h-[27px] flex bg-[#ebebeb] rounded-[13.5px]">
              <div className="bg-neutral-50 mt-1 w-[19px] h-[19px] ml-1 rounded-[9.5px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="absolute top-[928px] left-[734px] w-[260px] h-[45px] flex items-center justify-center [font-family:'Sky_Text',Helvetica] font-normal text-black text-2xl text-center tracking-[0] leading-9">
        Press to submit answers
      </div>

      <Button className="absolute top-[974px] left-[696px] w-[336px] h-[45px] bg-[#7399ff] hover:bg-[#5577dd] text-white rounded-md [font-family:'Sky_Text',Helvetica] font-normal text-lg h-auto">
        Continue
      </Button>

      <img
        className="top-[1081px] left-[793px] w-[141px] h-[79px] absolute object-cover"
        alt="Sky Zero Logo"
        src="/image-5.png"
      />

      <FooterBanner/>
    </div>
  );
};

export default Questionnaire;