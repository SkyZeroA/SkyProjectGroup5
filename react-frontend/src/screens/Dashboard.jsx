import { Avatar, AvatarFallback } from "../components/Avatar";
import { Card, CardContent } from "../components/Card";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import Switch from "../components/Switch"
import { Button } from "../components/Button";
import Popup from "../components/PopUp";
import axios from "axios";
import React, { useState, useEffect } from "react";


const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
	const [weekData, setWeekData] = useState([]);
	const [monthData, setMonthData] = useState([]);
	const [username, setUsername] = useState([]);
	const [isOn, setIsOn] = useState(false);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:9099/api/fetch-questions", { withCredentials: true });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching activity questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  // Will replace above and be used later when we add preferences for user activities
  // const [userActivities, setUserActivities] = useState([]);
  // useEffect(() => {
  //   const fetchUserActivities = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:9099/api/user-activities");
  //       setUserActivities(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user activities:", error);
  //     }
  //   };
  //   fetchUserActivities();
  // }, []);

	useEffect(() => {
		const fetchLeaderboard = async () => {
			await axios.get("http://localhost:9099/api/dashboard", {withCredentials:true})
			.then(response => {
        setWeekData(response.data.weekLeaderboard);
				setMonthData(response.data.monthLeaderboard);
				setUsername(response.data.username);
      }).catch((error) => {
        console.error("Failed to fetch data from json" , error);
      });
    };
		fetchLeaderboard();
	}, []);
	console.log(weekData);
	console.log(monthData);

	const current = isOn ? weekData : monthData;

	console.log(current);

  const leaderboardData = current
    .sort((a, b) => b.score - a.score)
    .map((user) => ({
      ...user,
      isCurrentUser: user.name === username,
    }));

  const handleFormSubmit = async (answers) => {
    console.log("Form submitted with answers:", answers);
    try {
      const response = await axios.post("http://localhost:9099/api/log-activity", answers, { withCredentials: true });
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Sticky Header */}
      <div className="top-0 z-10 bg-white">
        <HeaderBanner logoAlign="left" navbar={<Button variant="link"
                    className="h-auto p-0 [font-family:'Sky_Text',Helvetica]  text-[#000ef5] text-[16.5px] leading-[24.8px] bg-green-500 text-white px-4 py-2 rounded" 
                    onClick={() => setIsFormOpen(true)}>Form</Button>} />
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
													<AvatarFallback className="bg-gray-200 text-black font-bold text-lg">
														{user.name.charAt(0)}
													</AvatarFallback>
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
        <div className="w-2/3">
          <Card className="h-full bg-white rounded-lg shadow">
            <CardContent>
              <h2 className="text-2xl font-bold text-center text-gray-900">
                Tips to reduce your Carbon Footprint
              </h2>
              <ul className="mt-4 space-y-4 text-gray-700">
                <li>
                  <strong>Streamline your digital life:</strong> Delete unused
                  files and emails to reduce cloud storage energy use. Turn off
                  devices when not in use and stream at lower quality when
                  possible.
                </li>
                <li>
                  <strong>Choose low-carbon commutes:</strong> Walk, cycle, or
                  use public transport where possible. Carpool with colleagues
                  or explore EV options if driving.
                </li>
                <li>
                  <strong>Eat more sustainably:</strong> Swap meat for
                  plant-based meals a few times a week. Bring your own lunch in
                  reusable containers to cut down on packaging waste.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* Will be used later when we add preferences for user activities
      <Popup isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} questions={userActivities} onSubmit={handleFormSubmit} />
      */}

      <Popup isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} questions={questions} onSubmit={handleFormSubmit} />

      {/* Footer */}
      <FooterBanner />
    </div>
  );
};

export default Dashboard;