import { Avatar, AvatarFallback } from "../components/Avatar";
import { Card, CardContent } from "../components/Card";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import ProgressBar from "../components/ProgressBar";
import Switch from "../components/Switch";
import Popup from "../components/PopUp";
import axios from "axios";
import React, { useState, useEffect } from "react";
import TipCard from "../components/TipCard";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [points, setPoints] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [username, setUsername] = useState([]);
  const [totalProjectedCarbon, setTotalProjectedCarbon] = useState([]);
  const [projectedCarbon, setProjectedCarbon] = useState([]);
  const [currentCarbon, setCurrentCarbon] = useState([]);
  const [isOn, setIsOn] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [allPoints, setAllPoints] = useState([]);
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(true);

  const fetchAllQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:9099/api/fetch-questions", { withCredentials: true });
      setAllQuestions(response.data.map(question => question.name));
      setAllPoints(response.data.map(question => question.points));
    } catch (error) {
      console.error("Error fetching activity questions:", error);
    }
  };

  const fetchUserActivities = async () => {
    try {
      const response = await axios.get("http://localhost:9099/api/user-activities", { withCredentials: true });
      setQuestions(response.data.map(activity => activity.name));
      setPoints(response.data.map(activity => activity.points));
    } catch (error) {
      console.error("Error fetching user activities:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9099/api/dashboard", { withCredentials: true });
      setWeekData(response.data.weekLeaderboard);
      setMonthData(response.data.monthLeaderboard);
      setUsername(response.data.username);
      setTotalProjectedCarbon(response.data.totalCarbon);
      setProjectedCarbon(response.data.projectedCarbon);
      setCurrentCarbon(response.data.currentCarbon);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchUserActivities();
    fetchAllQuestions();
    fetchData();
  }, [isFormOpen]);

  useEffect(() => {
    const fetchInitialTips = async () => {
      setTipsLoading(true);
      try {
        const res = await axios.get("http://localhost:9099/api/initial-ai-tips", { withCredentials: true });
        setTips(res.data.tips);
      } catch (err) {
        console.error("Error fetching tips:", err);
      } finally {
        setTipsLoading(false);
      }
    };
    fetchInitialTips();
  }, []);

  const replaceTip = async (index) => {
    try {
      const res = await axios.get("http://localhost:9099/api/ai-tip", { withCredentials: true });
      const newTip = res.data.tip;
      setTips((prevTips) => {
        const updated = [...prevTips];
        updated[index] = newTip;
        return updated;
      });
    } catch (err) {
      console.error("Error fetching new tip:", err);
    }
  };

  const current = isOn ? weekData : monthData;
  const leaderboardData = current
    .sort((a, b) => b.score - a.score)
    .map((user) => ({
      ...user,
      isCurrentUser: user.name === username,
    }));

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
      {/* Header */}
      <div className="top-0 z-50 bg-white">
        <HeaderBanner
          logoAlign="left"
          navbar={<Navbar username={username} setIsFormOpen={setIsFormOpen} />}
        />
      </div>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row flex-1 px-4 md:px-6 py-4 md:py-6 gap-6 md:items-stretch">

        {/* Left Column - Leaderboard */}
        <div className="w-full md:w-1/3 flex flex-col max-h-[calc(100vh-96px)]">
          <Card className="bg-white rounded-lg flex flex-col md:min-h-[calc(100vh-96px)]">
            <CardContent className="p-3 md:p-6 flex flex-col">
              {/* Header */}
              <h1 className="mb-4 pt-2 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)]
                [-webkit-background-clip:text] bg-clip-text 
                [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
                [font-family:'Sky_Text',Helvetica] font-normal text-center 
                text-[26px] md:text-[38px] leading-[36px] md:leading-[57px]">
                Leaderboard
              </h1>

              {/* Scrollable leaderboard list */}
              <div className="bg-neutral-50 overflow-y-auto rounded-lg p-2 md:p-4 max-h-[calc(100vh-296px)] md:min-h-[calc(100vh-296px)] scroll-py-4">
                <div className="space-y-3 md:space-y-4">
                  {leaderboardData.map((user) => (
										<Card
											key={user.name}
											className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all duration-300 ease-in-out bg-white ${
												user.isCurrentUser
													? "sticky top-0 bottom-0 z-10 border-2 border-green-500"
													: ""
											}`}
										>
											<div className="flex items-center gap-4">
												<Avatar className="w-12 h-12 bg-gray-200">
													{user.avatarFilename ? (
                            <img
                              src={`http://localhost:9099/uploads/${user.avatarFilename}`}
                              alt="User avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-gray-200 text-black font-bold text-lg">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          )}
												</Avatar>
												<span className="text-lg font-medium text-gray-900">
													{user.name}
												</span>
											</div>
											<span className="text-lg font-medium text-gray-900">
												{user.score}
											</span>
										</Card>
									))}
                </div>
              </div>

              {/* Footer Switch */}
              <div className="flex justify-center items-center mt-4 md:mt-6">
                <span className="mr-6 md:mr-10 text-gray-700 [font-family:'Sky_Text',Helvetica] font-normal text-center text-[18px] md:text-[24px]">
                  Monthly
                </span>
                <Switch setOutput={setIsOn} option1={weekData} option2={monthData} />
                <span className="ml-6 md:ml-10 text-gray-700 [font-family:'Sky_Text',Helvetica] font-normal text-center text-[18px] md:text-[24px]">
                  Weekly
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Projected Carbon + Tips */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 h-auto md:h-[calc(100vh-96px)]">
          {/* Projected Carbon Section */}
          <Card className="bg-white rounded-lg flex-shrink-0">
            <CardContent className="p-3 md:p-6">
              <h1 className="[font-family:'Sky_Text',Helvetica] font-normal text-[26px] md:text-[38px]">
                Projected Carbon Footprint
              </h1>
              <p className="[font-family:'Sky_Text',Helvetica] font-normal text-[16px] md:text-[24px]">
                In 2025, you are projected to be responsible for{" "}
                <span className="font-bold">{totalProjectedCarbon} kg</span> of CO2
              </p>

              <ProgressBar
                current={currentCarbon}
                projected={projectedCarbon}
                totalProjected={totalProjectedCarbon}
                className="flex justify-center items-center mt-2 md:mt-4"
              />

              <p className="mt-3 text-gray-700 [font-family:'Sky_Text',Helvetica] font-normal text-[16px] md:text-[24px]">
                Currently, you have produced{" "}
                <strong>{currentCarbon} kg</strong> of CO2 so far, which is{" "}
                <strong>{Math.round(projectedCarbon - currentCarbon)} kg Less</strong> than
                projected for this point in the year!
              </p>
            </CardContent>
          </Card>

          {/* AI Generated Tips Section */}
          <Card className="bg-white rounded-lg flex-grow overflow-hidden">
            <CardContent className="p-3 md:p-6 flex flex-col h-full">
              <h1 className="[font-family:'Sky_Text',Helvetica] font-normal text-[26px] md:text-[38px] mb-4">
                Tips for reducing your carbon footprint
              </h1>
              <ul className="list-none flex-1 pr-2">
                {(tipsLoading ? [0, 1, 2] : tips).map((tip, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <TipCard
                      tip={tipsLoading ? "Generating Tip…" : tip}
                      onDelete={async () => {
                        if (!tipsLoading) await replaceTip(index);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>


      <Popup
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        questions={questions}
        points={points}
        allQuestions={allQuestions}
        allPoints={allPoints}
        onActivitiesSave={handleActivitySave}
      />

      <FooterBanner />
    </div>
  );
};

export default Dashboard;
