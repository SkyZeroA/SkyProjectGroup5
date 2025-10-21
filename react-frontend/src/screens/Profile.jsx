import React from "react";
import { Card, CardContent } from "../components/Card";
import HeaderBanner from "../components/HeaderBanner";
import  FooterBanner from "../components/FooterBanner";

const Profile = () => {
  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <HeaderBanner className="md:fixed"/>

      <main className="flex items-center justify-center min-h-screen">
				<div className="w-1/3 px-2">
          <Card className="bg-white min-h-[815px] rounded-lg">
            <CardContent className="p-6">
             <div className="">

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