import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import { Card, CardContent } from "../components/Card";
import { Button } from "../components/Button";
import Popup from "../components/PopUp";
import MyPieChart from "../components/MyPieChart";
import CalendarHeatmap from "../components/CalendarHeatMap";
import UserRankChart from "../components/UserRankChart";
import PointsBarChart from "../components/PointsBarChart";

const Stats = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [username, setUsername] = useState("");
  const [isOn, setIsOn] = useState(false);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [transportEmissions, setTransportEmissions] = useState(0);
  const [dietEmissions, setDietEmissions] = useState(0);
  const [heatingEmissions, setHeatingEmissions] = useState(0);
  const [highestWeekPoints, setHighestWeekPoints] = useState(0);
  const [highestMonthPoints, setHighestMonthPoints] = useState(0);
  const [highestWeekUser, setHighestWeekUser] = useState("");
  const [highestMonthUser, setHighestMonthUser] = useState("");
  const [userBestWeek, setUserBestWeek] = useState("");
  const [userBestMonth, setUserBestMonth] = useState("");

  const navigate = useNavigate();

  const fetchAllQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:9099/api/fetch-questions", { withCredentials: true });
      setAllQuestions(response.data);
    } catch (error) {
      console.error("Error fetching activity questions:", error);
    }
  };

  const fetchUserActivities = async () => {
    try {
      const response = await axios.get("http://localhost:9099/api/user-activities", { withCredentials: true });
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching user activities:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9099/api/stats", { withCredentials: true });
      setWeekData(response.data.weekLeaderboard);
      setMonthData(response.data.monthLeaderboard);
      setTransportEmissions(response.data.transportEmissions);
      setDietEmissions(response.data.dietEmissions);
      setUsername(response.data.username);
      setHeatingEmissions(response.data.heatingEmissions);
      setHighestWeekUser(response.data.highestWeekUser);
      setHighestWeekPoints(response.data.highestWeekPoints);
      setHighestMonthUser(response.data.highestMonthUser);
      setHighestMonthPoints(response.data.highestMonthPoints);
      setHighestWeekUser(response.data.highestWeekUser);
      setHighestMonthUser(response.data.highestMonthUser);
      setHighestMonthPoints(response.data.highestMonthPoints);
      setHighestWeekPoints(response.data.highestWeekPoints);
      setUserBestWeek(response.data.userBestWeek);
      setUserBestMonth(response.data.userBestMonth);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchUserActivities();
    fetchAllQuestions();
    fetchData();
  }, [isFormOpen]);

  const handleActivitySave = async (selected) => {
    try {
      await axios.post(
        "http://localhost:9099/api/update-user-activities",
        { activities: selected },
        { withCredentials: true }
      );
      await fetchUserActivities();
    } catch (error) {
      console.error("Error saving user activities:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Sticky Header */}
      <div className="top-0 z-10 bg-white">
        <HeaderBanner
          logoAlign="left"
          navbar={
            <div className="w-full flex items-center [font-family:'Sky_Text',Helvetica] text-[16.5px] leading-[24.8px]">
              {/* Left side buttons */}
              <div>
                <Button
                  variant="link"
                  className="text-grey-900"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  variant="link"
                  className="text-grey-900"
                  onClick={() => navigate("/stats")}
                >
                  Statistics
                </Button>
              </div>

              {/* Right side */}
              <div className="ml-auto">
                <Button
                  variant="link"
                  onClick={() => navigate("/profile")}
                >
                  {username}
                </Button>
                <Button 
                  variant="link"
                  onClick={() => navigate("/")}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          }
        />
      </div>

      {/* Main Content */}
      <main className="flex flex-1 px-6 py-6 gap-6">
        {/* Left Section: 4 Chart Squares */}
        <div className="w-3/4 grid grid-cols-2 grid-rows-2 gap-6 h-[calc(100vh-96px)]">
          {/* Pie Chart */}
          <Card className="flex flex-col justify-center items-center h-full w-full overflow-hidden">
            <CardContent className="h-full w-full flex flex-col justify-center items-center">
              <h2 className="[font-family:'Sky_Text',Helvetica] text-2xl font-bold text-center text-gray-900">
                Projected Emissions Breakdown
              </h2>
              <MyPieChart
                transportEmissions={transportEmissions}
                dietEmissions={dietEmissions}
                heatingEmissions={heatingEmissions}
              />
            </CardContent>
          </Card>

          {/* Calendar Heatmap */}
          <Card className="flex flex-col justify-center items-center h-full w-full">
            <CardContent className="h-full w-full flex flex-col justify-center items-center">
              <CalendarHeatmap isFormOpen={isFormOpen} />
            </CardContent>
          </Card>

          {/* User Rank Line Chart */}
          <Card className="flex flex-col justify-center items-center h-full w-full overflow-hidden">
            <CardContent className="h-full w-full flex flex-col justify-center items-center">
              <UserRankChart 
                isFormOpen={isFormOpen} 
                isOn={isOn} 
                setIsOn={setIsOn} 
                weekData={weekData} 
                monthData={monthData} 
              />
            </CardContent>
          </Card>

          {/* User Points vs Average */}
          <Card className="flex flex-col justify-center items-center h-full w-full overflow-hidden">
            <CardContent className="h-full w-full flex flex-col justify-center items-center text-gray-400 text-lg">
              <PointsBarChart isFormOpen={isFormOpen} />
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Info Cards */}
        <div className="w-1/4 flex flex-col gap-6 h-[calc(100vh-96px)]">
          <Card className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 [font-family:'Sky_Text',Helvetica] text-gray-800">
              Highest Week Points
            </h3>
            <p className="[font-family:'Sky_Text',Helvetica] text-gray-500 mb-2">{highestWeekUser}</p>
            <p className="[font-family:'Sky_Text',Helvetica] text-3xl font-bold text-green-600">
              {highestWeekPoints}
            </p>
          </Card>

          <Card className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 [font-family:'Sky_Text',Helvetica] text-gray-800">
              Highest Month Points
            </h3>
            <p className="[font-family:'Sky_Text',Helvetica] text-gray-500 mb-2">{highestMonthUser}</p>
            <p className="[font-family:'Sky_Text',Helvetica] text-3xl font-bold text-green-600">
              {highestMonthPoints}
            </p>
          </Card>

          {/* Additional info cards */}
          <Card className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 [font-family:'Sky_Text',Helvetica] text-gray-800">
              Your Highest Week Points
            </h3>
            <p className="[font-family:'Sky_Text',Helvetica] text-3xl font-bold text-green-600">
              {userBestWeek}
            </p>
          </Card>

          <Card className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 [font-family:'Sky_Text',Helvetica] text-gray-800">
              Your Highest Month Points
            </h3>
            <p className="[font-family:'Sky_Text',Helvetica] text-3xl font-bold text-green-600">
              {userBestMonth}
            </p>
          </Card>
        </div>
      </main>

      <Popup
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        questions={questions}
        allQuestions={allQuestions}
        onActivitiesSave={handleActivitySave}
      />

      {/* Footer */}
      <FooterBanner />
    </div>
  );
};

export default Stats;
