import React, { useState, useEffect } from 'react';
import HeaderBanner from '../components/HeaderBanner';
import FooterBanner from '../components/FooterBanner';
import Popup from '../components/PopUp';
import { Card, CardContent } from '../components/Card';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Avatar, AvatarFallback } from '../components/Avatar';
import ProgressBar from '../components/ProgressBar';
import FAQCard from '../components/FAQCard';

const About = () => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [allQuestions, setAllQuestions] = useState([]);
	const [username, setUsername] = useState("");

	const fetchAllQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:9099/api/fetch-questions",
				{ withCredentials: true });
      setAllQuestions(response.data);
    } catch (error) {
      console.error("Error fetching activity questions:", error);
    }
  };

  const fetchUserActivities = async () => {
    try {
      const response = await axios.get("http://localhost:9099/api/user-activities",
				{ withCredentials: true });
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching user activities:", error);
    }
  };

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

	useEffect(() => {
		fetchAllQuestions();
		fetchUserActivities();
	}, [isFormOpen]);


	// Dummy leaderboard data
	const leaderboardData = [
		{ name: "Alice", score: 150 },
		{ name: "Bob", score: 120 },
		{ name: "Charlie", score: 100 },
		{ name: "David", score: 90 },
	];

	// FAQs
	const faqs = [
		{
			question: "How is my carbon footprint calculated?",
			answer: "Your carbon footprint is estimated based on your lifestyle choices and activities logged in the app."
		},
		{
			question: "How often should I update my activities?",
			answer: "For the most accurate tracking, we recommend updating your activities daily or weekly."
		},
		{
			question: "Can I change my answers in the questionnaire later?",
			answer: "Yes, you can update your questionnaire responses at any time through your profile settings."
		},
	];	

	return (
		 <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="top-0 z-50 bg-white">
        <HeaderBanner
          logoAlign="left"
          navbar={<Navbar username={username} setIsFormOpen={setIsFormOpen} />}
        />
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex flex-col flex-1 px-4 sm:px-6 py-6 gap-6 max-w-8xl mx-auto w-full">
        {/* Intro Card */}
        <Card className="bg-white p-4">
          <CardContent>
            <h1 className="text-[26px] md:text-[38px] [font-family:'Sky_Text',Helvetica] font-normal mb-2">
							Welcome to 
							<span className="bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)]
							[-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]"> ClearSky</span></h1>
            <p className="text-gray-700 [font-family:'Sky_Text',Helvetica] font-normal text-[16px] md:text-[20px] lg:text-[22px]">
							ClearSky is your personal companion on the journey to a more sustainable lifestyle.
							<br />
							Track your eco-friendly activities, monitor your carbon footprint, and see how you rank on our community leaderboard.
							<br />
							Click here to navigate straight to your <a href="/dashboard" className="text-green-600 underline">Dashboard</a>, or scroll down and learn about the features we offer and answer any questions you might have!
						</p>
          </CardContent>
        </Card>

        <Card className="bg-white p-4">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Leaderboard Section - Left Third */}
              <div className="w-full md:w-1/3 md:border-r md:pr-6">
                <h1 className="mb-4 pt-2 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)]
                [-webkit-background-clip:text] bg-clip-text 
                [-webkit-text-fill-color:transparent] [text-fill-color:transparent]
                [font-family:'Sky_Text',Helvetica] font-normal text-center 
                text-[26px] md:text-[38px] leading-[36px] md:leading-[57px]">
                Leaderboard
              </h1>
                <div className="bg-neutral-50 rounded-lg p-2 md:p-4 max-h-[calc(100vh-296px)] relative">
                  <div className="space-y-3 md:space-y-4">
                  {leaderboardData.map((user) => (
                    <Card
                      key={user.name}
                      className="flex items-center justify-between p-4 rounded-lg shadow-sm transition-all duration-300 ease-in-out bg-white"
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
                  {/* Gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-[90%] bg-gradient-to-t from-white via-neutral-50/80 to-transparent pointer-events-none z-10"></div>
                </div>
              </div>

              {/* Feature Description - Right Two Thirds (stacks below on mobile) */}
              <div className="w-full md:w-2/3">
                <h2 className="text-[26px] md:text-[34px] [font-family:'Sky_Text',Helvetica] font-normal mb-4">Leaderboard</h2>
                <p className="text-gray-600 [font-family:'Sky_Text',Helvetica] font-normal text-[16px] md:text-[20px] lg:text-[24px]">
                  See how your eco score ranks among others!
                  <br /><br />
                  How it works:
                  <br />
                  Your score increases as you log daily eco-friendly actions through the Eco-Counter.
                  <br />
                  The points associated with each activity are derived from the carbon you have saved by performing it.
									<br /><br />
									For example:
									<br />
									You decide to cycle to work instead of driving, which saves approximately 2.5 kg of CO2 emissions.
									<br />
									This will cause your eco score to increase by 5 points.
									<p className="italic mt-8 text-center">
										Points = CO2 saved (in kg) × 2
									</p>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white p-4">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Description - Left Half (matches style of first card) */}
              <div className="w-full md:w-1/2 md:border-r md:pr-6 order-2 md:order-1">
                <h2 className="text-[26px] md:text-[34px] [font-family:'Sky_Text',Helvetica] font-normal mb-4">Progress Bar</h2>
                <p className="text-gray-600 [font-family:'Sky_Text',Helvetica] font-normal text-[16px] md:text-[20px] lg:text-[24px]">
                  Your estimated yearly carbon emissions based on your lifestyle. 
									<br /><br />
									How it works: 
									<br />
									This is calculated using your answers from the lifestyle questionnaire and updated when habits change and activities are logged.
                </p>
              </div>

              {/* Progress bar - Right Half (stacked above description on mobile) */}
              <div className="w-full md:w-1/2 flex items-center justify-center order-1 md:order-2">
                <div className="w-full">
                  <ProgressBar current={30} projected={50} totalProjected={100} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white p-4">
          <CardContent>
          <h2 className="[font-family:'Sky_Text',Helvetica] font-normal text-[26px] md:text-[34px] mb-4">Frequently Asked Questions</h2>
          <div className="flex flex-col">
            {faqs.map((faq, idx) => (
              <FAQCard key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          </CardContent>
        </Card>
      </main>

      {/* Popup Form */}
      <Popup
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        questions={questions}
        allQuestions={allQuestions}
        onActivitiesSave={handleActivitySave}
      />

      {/* Footer */}
      <footer>
        <FooterBanner />
      </footer>
    </div>
	);
}

export default About;