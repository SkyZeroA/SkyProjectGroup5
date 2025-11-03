import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/Card";
import HeaderBanner from "../components/HeaderBanner";
import  FooterBanner from "../components/FooterBanner";
import { Avatar, AvatarFallback } from "../components/Avatar";
import axios from "axios";
import { Button } from "../components/Button";
import Questions from "../components/Questions";
import Navbar from "../components/Navbar";
import Popup from "../components/PopUp";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [answers, setAnswers] = useState({})
  const [isEditing, setIsEditing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

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


  // Gets the username and first name of the current user
  const fetchUserData = async () => {
    await axios.get("http://localhost:9099/api/fetch-user-data", { withCredentials: true })
      .then(response => {
        setUsername(response.data.username);
        setFirstName(response.data.firstName);
        setAvatar(response.data.avatar && response.data.avatar !== "None" ? response.data.avatar : null);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  };

  const fetchQuestionnaireData = async () => {
    await axios.get("http://localhost:9099/api/fetch-questionnaire-answers", { withCredentials: true })
      .then(response => {
        setAnswers(response.data.answers);
      })
      .catch(error => {
        console.error("Error fetching questionnaire data:", error);
      });
  };


  const handleQuestionnaireUpdate = async () => {
    if (isEditing) {
    console.log("Submitting Answers:", answers);
    await axios.post("http://localhost:9099/api/set-questionnaire", answers, { withCredentials: true })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
  };


  // Allows the user to change their profile picture
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl); // local preview

      // Prepare form data for backend
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const res = await axios.post(
          "http://localhost:9099/api/upload-avatar",
          formData,
          { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Avatar uploaded:", res.data);
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };


  useEffect(() => {
    fetchUserData();
  }, [avatar])

  useEffect(() => {
    fetchQuestionnaireData();
  }, [])

  console.log("avatar", avatar)
  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <header className="top-0 z-50 bg-white">
        <HeaderBanner
          logoAlign="left"
          navbar={<Navbar username={username} setIsFormOpen={setIsFormOpen} />}
        />
      </header>

      <main className="flex items-center justify-center min-h-screen">
				<div className="w-1/3 px-2">
          <Card className="bg-white min-h-[815px] rounded-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="relative flex flex-col items-center">
                  <Avatar className="w-[250px] h-[250px] bg-gray-200 overflow-hidden">
                    {avatar && avatar !== 'None' ? (
                      <img
                        src={`http://localhost:9099${avatar}`}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-200 text-black font-bold text-[50px]">
                        {username.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Hidden file input */}
                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  {/* Upload button below avatar */}
                  <label
                    htmlFor="avatarUpload"
                    className="mt-3 inline-block cursor-pointer text-blue-600 hover:underline text-sm"
                  >
                    Change Avatar
                  </label>
                </div>

                <span className="pt-5 text-xl font-semibold [font-family:'Sky_Text',Helvetica]">
                  Hi {firstName}!
                </span>
                <span className="[font-family:'Sky_Text',Helvetica] text-gray-900">
                  Username: {username}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
				<div className="w-2/3 px-2">
          <Card className="bg-white rounded-lg h-[815px] flex items-center justify-center">
            <div className="bg-white rounded-lg h-[95%] w-[95%] overflow-hidden">
              <CardContent className="h-full p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-[34px] [font-family:'Sky_Text',Helvetica]">
                    Your Lifestyle Questionnaire
                  </h1>

                  <Button
                    variant="outline"
                    onClick={() => {
                      handleQuestionnaireUpdate();
                      setIsEditing((prev) => !prev);
                    }}
                    className="text-sm px-4 py-2"
                  >
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </div>

                <div className="py-4 space-y-6">
                  <Questions onAnswersChange={setAnswers} initialAnswers={answers} isEditing={isEditing} />
                </div>
              </CardContent>
            </div>
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

      <FooterBanner className="md:fixed"/>
    </div>
  );
};

export default Profile;