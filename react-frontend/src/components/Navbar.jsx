import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import axios from 'axios';
import { publishActivity } from '../lib/activityBus';
import Popup from './PopUp';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
	const [username, setUsername] = useState("");
	const [points, setPoints] = useState([]);
	const [allPoints, setAllPoints] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;


  const fetchUserData = async () => {
    await axios.get(`${apiUrl}/api/fetch-user-data`, { withCredentials: true })
      .then(response => {
        setUsername(response.data.username);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  };

  const fetchAllQuestions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/fetch-questions`, { withCredentials: true });
      setAllQuestions(response.data.map(activity => activity.name));
      setAllPoints(response.data.map(activity => activity.points));
    } catch (error) {
      console.error("Error fetching activity questions:", error);
    }
  };

  const fetchUserActivities = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user-activities`, { withCredentials: true });
      setQuestions(response.data.map(activity => activity.name));
      setPoints(response.data.map(activity => activity.points));
    } catch (error) {
      console.error("Error fetching user activities:", error);
    }
  };

  const handleActivitySave = async (selected) => {
    try {
      await axios.post(
        `${apiUrl}/api/update-user-activities`,
        { activities: selected },
        { withCredentials: true }
      );
      await fetchUserActivities();
      // Publish activity update via in-app bus
      publishActivity({ source: 'navbar', changed: true });
    } catch (error) {
      console.error("Error saving user activities:", error);
    }
  };

	useEffect(() => {
		fetchAllQuestions();
		fetchUserActivities();
	}, [isFormOpen]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const mainLinks = [
		{ label: "About", onClick: () => navigate("/about") },
    { label: "Dashboard", onClick: () => navigate("/dashboard") },
    { label: "Statistics", onClick: () => navigate("/stats") },
  ];

  const userLinks = [
    { label: username, onClick: () => navigate("/profile") },
    { label: "Sign Out", onClick: () => navigate("/") },
  ];

  return (
    <>
      <div className="relative w-full flex items-center justify-between [font-family:'Sky_Text',Helvetica] text-[16.5px] leading-[24.8px]">
        
        {/* LEFT SIDE: Navigation Links (desktop only) */}
        <div className="hidden md:flex gap-6 items-center">
          {mainLinks.map((link) => (
            <Button
              key={link.label}
              variant="link"
              className="text-grey-900"
              onClick={link.onClick}
            >
              {link.label}
            </Button>
          ))}
        </div>

        {/* CENTER: Log Activities Button (always visible) */}
        <div className="flex justify-center flex-grow md:flex-grow-0">
          <Button
            variant="link"
            className="text-green-500 whitespace-nowrap"
            onClick={() => setIsFormOpen(true)}
          >
            Log your Activities
          </Button>
        </div>

        {/* RIGHT SIDE: User links (desktop) */}
        <div className="hidden md:flex gap-4 items-center">
          {userLinks.map((link) => (
            <Button
              key={link.label}
              variant="link"
              className="text-grey-900"
              onClick={link.onClick}
            >
              {link.label}
            </Button>
          ))}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-700 focus:outline-none"
        >
          {menuOpen ? (
            <span className="text-2xl font-bold">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>

        {/* MOBILE DROPDOWN MENU */}
        {menuOpen && (
          <div className="absolute top-[64px] left-0 w-full bg-white border-t shadow-md flex flex-col items-start p-4 space-y-3 md:hidden z-20">
            {[...mainLinks, ...userLinks].map((link) => (
              <Button
                key={link.label}
                variant="link"
                className="w-full text-left text-gray-900 text-[18px]"
                onClick={() => {
                  link.onClick();
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Popup Form */}
      <Popup
        isOpen={isFormOpen}
        onClose={() => {
          // always close the popup
          setIsFormOpen(false);
          // publish close (no changes) so pages can decide whether to refresh
          publishActivity({ source: 'navbar', changed: false });
        }}
        questions={questions}
        points={points}
        allPoints={allPoints}
        allQuestions={allQuestions}
        onActivitiesSave={handleActivitySave}
      />
    </>
  );
};

export default Navbar;
