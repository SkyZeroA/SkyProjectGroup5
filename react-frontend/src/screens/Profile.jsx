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

  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    await axios.get("http://localhost:9099/api/fetch-user-data", { withCredentials: true })
      .then(response => {
        setUsername(response.data.username);
        setFirstName(response.data.firstName);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  };

  useEffect(() => {
    fetchUserInfo();
  }, [])

  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <HeaderBanner
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
                <Avatar className="w-[250px] h-[250px] bg-gray-200">
                  <AvatarFallback className="bg-gray-200 text-black font-bold text-[50px]">
                    {username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="pt-5 text-xl font-semibold [font-family:'Sky_Text',Helvetica]">Hi {firstName}!</span>
                <span className="text-gray-900 [font-family:'Sky_Text',Helvetica]">Username: {username}</span>
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