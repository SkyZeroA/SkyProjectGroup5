import { Avatar, AvatarFallback } from "../components/Avatar";
import { Card, CardContent } from "../components/Card";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import { React, useState, useEffect, use } from "react";
import axios from "axios";

const Dashboard = () => {
  const [weekData, setWeekData] = useState([]);
	const [monthData, setMonthData] = useState([]);
	const [username, setUsername] = useState([]);

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

const exampleData = [
    { name: "Harry", score: 0 },
    { name: "Ben", score: 0 },
    { name: "Zubin", score: 0 },
    { name: "Adnan", score: 0 },
    { name: "Taran", score: 0 },
    { name: "Sarah", score: 0 },
    { name: "Mike", score: 0 },
    { name: "Emma1", score: 0 },
    { name: "Mike1", score: 0 },
    { name: "Emma", score: 0 },
  ];

	console.log(exampleData);

  const leaderboardData = weekData
    .sort((a, b) => b.score - a.score)
    .map((user) => ({
      ...user,
      isCurrentUser: user.name === username,
    }));

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Sticky Header */}
      <div className="top-0 z-10 bg-white">
        <HeaderBanner />
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
							<Card className="h-[calc(100vh-196px)] bg-neutral-50 rounded-lg overflow-y-auto">
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

      {/* Footer */}
      <FooterBanner />
    </div>
  );
};

export default Dashboard;