import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import { Card, CardContent } from "../components/Card";
import MyPieChart from "../components/MyPieChart";
import CalendarHeatmap from "../components/CalendarHeatMap";
import UserRankChart from "../components/UserRankChart";
import PointsBarChart from "../components/PointsBarChart";
import Navbar from "../components/Navbar";
import { subscribeActivity } from "../lib/activityBus";

const Stats = ({ colorblind }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [transportEmissions, setTransportEmissions] = useState(0);
  const [dietEmissions, setDietEmissions] = useState(0);
  const [heatingEmissions, setHeatingEmissions] = useState(0);
  const [turnOffDevices, setTurnOffDevices] = useState(0);
  const [recycle, setRecycle] = useState(0);
  const [reusable, setReusable] = useState(0);
  const [foodWaste, setFoodWaste] = useState(0);
  const [highestWeekPoints, setHighestWeekPoints] = useState(0);
  const [highestMonthPoints, setHighestMonthPoints] = useState(0);
  const [highestWeekUser, setHighestWeekUser] = useState("");
  const [highestMonthUser, setHighestMonthUser] = useState("");
  const [userBestWeek, setUserBestWeek] = useState("");
  const [userBestMonth, setUserBestMonth] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/stats`, { withCredentials: true });
      const data = response.data;
      setWeekData(data.weekLeaderboard);
      setMonthData(data.monthLeaderboard);
      setTransportEmissions(data.transportEmissions);
      setDietEmissions(data.dietEmissions);
      setHeatingEmissions(data.heatingEmissions);
      setTurnOffDevices(data.turnOffDevicesEmissions);
      setRecycle(data.recycleEmissions);
      setReusable(data.reusableEmissions);
      setFoodWaste(data.foodWasteEmissions);
      setHighestWeekUser(data.highestWeekUser);
      setHighestWeekPoints(data.highestWeekPoints);
      setHighestMonthUser(data.highestMonthUser);
      setHighestMonthPoints(data.highestMonthPoints);
      setUserBestWeek(data.userBestWeek);
      setUserBestMonth(data.userBestMonth);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // subscribe to activity updates published by Navbar's popup
  useEffect(() => {
    const unsub = subscribeActivity(() => {
      setIsFormOpen(prev => !prev);
      fetchData();
    });
    return unsub;
  }, [fetchData]);


  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="top-0 z-50 bg-white">
        <HeaderBanner
          logoAlign="left"
          navbar={<Navbar />}
        />
      </header>

      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-white focus:p-2 focus:z-50"
      >
        Skip to main content
      </a>

      {/* Main Content */}
      <main id="main-content" className="flex flex-col sm:flex-row flex-1 px-4 sm:px-6 py-6 gap-4 sm:gap-6">
        {/* Left Section: Charts */}
        <section className="w-full sm:w-3/4 grid grid-cols-1 sm:grid-cols-2 grid-rows-4 sm:grid-rows-2 gap-4 sm:gap-6" aria-label="Charts and visual statistics">
          {/* Emissions Pie Chart */}
          <Card className="flex flex-col justify-center items-center h-64 sm:h-full w-full overflow-hidden bg-white">
            <CardContent className="h-full w-full flex flex-col justify-center items-center sm:pb-6 pb-0">
              <h2 className="[font-family:'Sky_Text',Helvetica] text-xl sm:text-2xl font-bold text-center text-gray-900">
                Projected Emissions Breakdown
              </h2>
              <MyPieChart
                transportEmissions={transportEmissions}
                dietEmissions={dietEmissions}
                heatingEmissions={heatingEmissions}
                turnOffDevices={turnOffDevices}
                recycle={recycle}
                reusable={reusable}
                foodWaste={foodWaste}
                colorblind={colorblind}
              />
            </CardContent>
          </Card>

          {/* Calendar Heatmap */}
          <Card className="flex flex-col justify-center items-center h-64 sm:h-full w-full bg-white">
            <CardContent className="h-full w-full flex flex-col justify-center items-center">
              <CalendarHeatmap isFormOpen={isFormOpen} colorblind={colorblind} />
            </CardContent>
          </Card>

          {/* User Rank Chart */}
          <Card className="flex flex-col justify-center items-center h-64 sm:h-full w-full overflow-hidden bg-white">
            <CardContent className="h-full w-full flex flex-col justify-center items-center pb-2">
              <UserRankChart 
                isFormOpen={isFormOpen} 
                isOn={isOn} 
                setIsOn={setIsOn} 
                weekData={weekData} 
                monthData={monthData} 
                colourblind={colorblind}
              />
            </CardContent>
          </Card>

          {/* User Points Bar Chart */}
          <Card className="flex flex-col justify-center items-center h-64 sm:h-full w-full overflow-hidden bg-white">
            <CardContent className="h-full w-full flex flex-col justify-center items-center pb-2">
              <PointsBarChart isFormOpen={isFormOpen} colourblind={colorblind} />
            </CardContent>
          </Card>
        </section>

        {/* Right Section: Info Cards */}
        <aside className="w-full sm:w-1/4 flex flex-col gap-4 sm:gap-6" aria-label="User statistics summary">
          <Card className="bg-white rounded-lg p-4 sm:p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 [font-family:'Sky_Text',Helvetica] text-gray-800">
              Highest Week Points
            </h3>
            <p className="[font-family:'Sky_Text',Helvetica] text-gray-500 mb-2">{highestWeekUser}</p>
            <p className="[font-family:'Sky_Text',Helvetica] text-2xl sm:text-3xl font-bold text-[var(--stats-color)]">
              {highestWeekPoints}
            </p>
          </Card>

          <Card className="bg-white rounded-lg p-4 sm:p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 [font-family:'Sky_Text',Helvetica] text-gray-800">
              Highest Month Points
            </h3>
            <p className="[font-family:'Sky_Text',Helvetica] text-gray-500 mb-2">{highestMonthUser}</p>
            <p className="[font-family:'Sky_Text',Helvetica] text-2xl sm:text-3xl font-bold text-[var(--stats-color)]">
              {highestMonthPoints}
            </p>
          </Card>

          <Card className="bg-white rounded-lg p-4 sm:p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 [font-family:'Sky_Text',Helvetica] text-gray-800">
              Your Highest Week Points
            </h3>
            <p className="[font-family:'Sky_Text',Helvetica] text-2xl sm:text-3xl font-bold text-[var(--stats-color)]">
              {userBestWeek}
            </p>
          </Card>

          <Card className="bg-white rounded-lg p-4 sm:p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 [font-family:'Sky_Text',Helvetica] text-gray-800">
              Your Highest Month Points
            </h3>
            <p className="[font-family:'Sky_Text',Helvetica] text-2xl sm:text-3xl font-bold text-[var(--stats-color)]">
              {userBestMonth}
            </p>
          </Card>
        </aside>
      </main>

      {/* Footer */}
      <footer>
        <FooterBanner />
      </footer>
    </div>
  );
};

export default Stats;
