import React, { useState, useEffect } from 'react';
import HeaderBanner from '../components/HeaderBanner';
import FooterBanner from '../components/FooterBanner';
import Popup from '../components/PopUp';
import { Card, CardContent } from '../components/Card';
import Navbar from '../components/Navbar';
import axios from 'axios';

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
      <main id="main-content" className="flex flex-col sm:flex-row flex-1 px-4 sm:px-6 py-6 gap-4 sm:gap-6">

        
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