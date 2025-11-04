import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/Card";
import HeaderBanner from "../components/HeaderBanner";
import  FooterBanner from "../components/FooterBanner";
import { Avatar, AvatarFallback } from "../components/Avatar";
import axios from "axios";
import { Button } from "../components/Button";
import Questions from "../components/Questions";
import Navbar from "../components/Navbar";
import ColorblindToggle from "../components/ColourblindToggle";

const Profile = ({ colorblind, setColorblind }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [answers, setAnswers] = useState({})
  const [isEditing, setIsEditing] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  // Gets the username and first name of the current user
  const fetchUserData = async () => {
    await axios.get(`${apiUrl}/api/fetch-user-data`, { withCredentials: true })
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
    await axios.get(`${apiUrl}/api/fetch-questionnaire-answers`, { withCredentials: true })
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
    await axios.post(`${apiUrl}/api/set-questionnaire`, answers, { withCredentials: true })
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
          `${apiUrl}/api/upload-avatar`,
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
          className="md:fixed"
          logoAlign="left"
          navbar={<Navbar />}
        />
      </header>

      <main className="flex flex-col md:flex-row items-center justify-center min-h-screen px-4 md:px-0">
        <div className="w-full md:w-1/3 px-2 mb-6 md:mb-0">
          <Card className="bg-white min-h-[auto] md:min-h-[815px] rounded-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="relative flex flex-col items-center">
                  <Avatar className="w-40 h-40 md:w-[250px] md:h-[250px] bg-gray-200 overflow-hidden">
                    {avatar && avatar !== 'None' ? (
                      <img
                        // src={`http://localhost:9099${avatar}`}
                        src={`${apiUrl}${avatar}`}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-200 text-black font-bold text-[24px] md:text-[50px]">
                        {username ? username.charAt(0) : ''}
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

                <span className="pt-5 text-lg md:text-xl font-semibold [font-family:'Sky_Text',Helvetica]">
                  Hi {firstName}!
                </span>
                <span className="[font-family:'Sky_Text',Helvetica] text-gray-900 text-sm md:text-base">
                  Username: {username}
                </span>
              </div>
              <div className="flex justify-center mt-4">
                <ColorblindToggle colorblind={colorblind} setColorblind={setColorblind} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-2/3 px-2">
          <Card className="bg-white rounded-lg h-auto md:h-[815px] flex items-start md:items-center justify-center">
            <div className="bg-white rounded-lg h-auto md:h-[95%] w-full md:w-[95%] overflow-hidden">
              <CardContent className="h-full p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-[20px] md:text-[34px] [font-family:'Sky_Text',Helvetica]">
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

      <FooterBanner className="md:fixed"/>
    </div>
  );
};

export default Profile;