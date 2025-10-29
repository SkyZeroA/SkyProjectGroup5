import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/Card";
import HeaderBanner from "../components/HeaderBanner";
import  FooterBanner from "../components/FooterBanner";
import { Avatar, AvatarFallback } from "../components/Avatar";
import axios from "axios";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState(null);


  const navigate = useNavigate();

  // Gets the username and first name of the current user
  const fetchUserInfo = async () => {
    await axios.get("http://localhost:9099/api/fetch-user-data", { withCredentials: true })
      .then(response => {
        setUsername(response.data.username);
        setFirstName(response.data.firstName);
        setAvatar(response.data.avatar)
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
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
    fetchUserInfo();
  }, [avatar])

  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <HeaderBanner
          className="md:fixed"
          logoAlign="left"
          navbar={
            <div className="w-full flex items-center [font-family:'Sky_Text',Helvetica] text-[16.5px] leading-[24.8px]">
              <div className="ml-auto">
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

      <main className="flex items-center justify-center min-h-screen">
				<div className="w-1/3 px-2">
          <Card className="bg-white min-h-[815px] rounded-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="relative flex flex-col items-center">
                  <Avatar className="w-[250px] h-[250px] bg-gray-200 overflow-hidden">
                    {avatar ? (
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
					<Card className="bg-white rounded-lg min-h-[815px]">
						<CardContent>
             
            </CardContent>
					</Card>
				</div>
      </main>
      <FooterBanner className="md:fixed"/>
    </div>
  );
};

export default Profile;