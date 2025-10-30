import { Avatar, AvatarFallback } from "../components/Avatar";
import { Card, CardContent } from "../components/Card";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import ProgressBar from "../components/ProgressBar";
import Switch from "../components/Switch"
import { Button } from "../components/Button";
import Popup from "../components/PopUp";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import MyPieChart from "../components/MyPieChart";

const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [username, setUsername] = useState([]);
  const [totalProjectedCarbon, setTotalProjectedCarbon] = useState([]);
  const [projectedCarbon, setProjectedCarbon] = useState([]);
  const [currentCarbon, setCurrentCarbon] = useState([])
  const [isOn, setIsOn] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [transportEmissions, setTransportEmissions] = useState(0);
  const [dietEmissions, setDietEmissions] = useState(0);
  const [heatingEmissions, setHeatingEmissions] = useState(0);

  const navigate = useNavigate();

  const fetchAllQuestions = async () => {
      await axios.get("http://localhost:9099/api/fetch-questions", { withCredentials: true })
      .then(response => {
        setAllQuestions(response.data);
      })
      .catch(error => {
        console.error("Error fetching activity questions:", error);
      });
  };

  //Will replace above and be used later when we add preferences for user activities
  const fetchUserActivities = async () => {
      await axios.get("http://localhost:9099/api/user-activities", { withCredentials: true })
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error("Error fetching user activities:", error);
      });
  };

  const fetchData = async () => {
      await axios.get("http://localhost:9099/api/dashboard", {withCredentials:true})
      .then(response => {
        setWeekData(response.data.weekLeaderboard);
        setMonthData(response.data.monthLeaderboard);
        setUsername(response.data.username);
        setProjectedCarbon(response.data.projectedCarbon)
        setCurrentCarbon(response.data.currentCarbon)
        setTransportEmissions(response.data.transportEmissions)
        setDietEmissions(response.data.dietEmissions)
        setHeatingEmissions(response.data.heatingEmissions)
      }).catch((error) => {
        console.error("Failed to fetch data from json" , error);
      });
    };
  
  useEffect(() => {
    fetchUserActivities();
    fetchAllQuestions();
    fetchData();
  }, [isFormOpen]);

  const current = isOn ? weekData : monthData;
  const leaderboardData = current
    .sort((a, b) => b.score - a.score)
    .map((user) => ({
      ...user,
      isCurrentUser: user.name === username,
    }));

  console.log(leaderboardData)


  const handleActivitySave = async (selected) => {
  try {
    await axios.post(
      "http://localhost:9099/api/update-user-activities", { activities: selected }, { withCredentials: true });
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
              {/* Left content */}
              <div>
                <Button 
                  variant="link"
                  className="bg-green-500 text-white" 
                  onClick={() => setIsFormOpen(true)}
                >
                  Form
                </Button>
                <Button
                  variant="link"
                  className="bg-blue-500 text-white"
                  onClick={() => navigate("/stats")}
                >
                  Stats
                </Button>
              </div>

              {/* Right content */}
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
        {/* Left Section: Leaderboard */}
        <div className="w-1/3">
          <Card className="h-[calc(100vh-96px)] bg-white rounded-lg">
            <CardContent>
              <h1 className="mb-4 pt-2 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Sky_Text',Helvetica] font-normal text-center text-[38px] leading-[57px]">
                  Leaderboard
              </h1>
							<Card className="h-[calc(100vh-296px)] bg-neutral-50 rounded-lg overflow-y-auto">
								<CardContent>
								<div className="mt-6 space-y-4">
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
							</CardContent>
							</Card>
							<div className="flex justify-center items-center mt-8">
								<span className="mr-10 text-gray-700 [font-family:'Sky_Text',Helvetica] font-normal text-center text-[28px]">Monthly</span>
									<Switch setOutput={setIsOn} option1={weekData} option2={monthData} />
								<span className="ml-10 text-gray-700 [font-family:'Sky_Text',Helvetica] font-normal text-center text-[28px]">Weekly</span>
							</div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Tips */}
        <div className="w-2/3 flex flex-col gap-6 justify-start h-[calc(100vh-96px)]">
          <Card className=" bg-white rounded-lg shadow">
            <CardContent>
                <div className="p-4">
                  <h1 className="[font-family:'Sky_Text',Helvetica] font-normal text-[38px]">Projected Carbon Footprint</h1>
                  <p className="[font-family:'Sky_Text',Helvetica] font-normal text-[24px]">In 2025, you are projected to be responsible for <span className="font-bold">{totalProjectedCarbon} kg</span> of CO2</p>

                  <ProgressBar current={currentCarbon} projected={projectedCarbon} totalProjected={totalProjectedCarbon} className="flex justify-center items-center"/>

                  <p className="mt-3 text-gray-700 [font-family:'Sky_Text',Helvetica] font-normal text-[24px]">
                    Currently, you have produced <strong>{currentCarbon} kg</strong> of CO2 so far, which is <strong>{Math.round(projectedCarbon - currentCarbon)} kg Less</strong> than projected for this point in the year!
                  </p>
                </div>
            </CardContent>
          </Card>
          <div className="flex gap-6 flex-1 overflow-hidden">
             <MyPieChart transportEmissions={transportEmissions} dietEmissions={dietEmissions} heatingEmissions={heatingEmissions} />  
          </div>
        </div>
      </main>

      <Popup isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} questions={questions} allQuestions={allQuestions} onActivitiesSave={handleActivitySave} />

      {/* Footer */}
      <FooterBanner />
    </div>
  );
};


export default Dashboard;
