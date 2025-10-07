import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import HeaderBanner from "../components/HeaderBanner";
import  FooterBanner from "../components/FooterBanner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-w-[1728px] min-h-[1024px] relative">
      <HeaderBanner/>

      <main className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Card className="w-[380px] min-h-[500px] rounded-[7px] bg-white shadow-sm transition-all duration-300 ease-in-out">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <h1 className="mb-4 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Sky_Text',Helvetica] text-transparent text-[38px] leading-[57px]">
                  Hello
                </h1>
                <p className="[font-family:'Sky_Text',Helvetica] font-normal text-[17px] leading-[25.5px]">
                  <span className="text-[#4a4a4a]">Sign in to </span>
                  <span className="text-[#4bad31]">ClearSky</span>
                </p>
              </div>
  
              <div className="space-y-6">
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  errorMessage="Enter your email address."
                  showError={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
  
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  errorMessage="Enter your password."
                  showError={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
  
                <Button className="w-full h-auto p-0 bg-transparent hover:bg-transparent">
                  <img
                    className="w-[336px] h-[45px] object-cover"
                    alt="Continue Button"
                    src="/image-9.png"
                  />
                </Button>
  
                <div className="text-center space-y-4">
                  <Button
                    variant="link"
                    className="h-auto p-0 [font-family:'Sky_Text',Helvetica] text-[#000ef5] text-[16.5px] leading-[24.8px]"
                  >
                    Forgotten your email or password?
                  </Button>
  
                  <Button
                    variant="link"
                    className="h-auto p-0 [font-family:'Sky_Text',Helvetica]  text-[#000ef5] text-[16.5px] leading-[24.8px]"
                  >
                    Create a new account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center mt-8">
            <img
              className="w-[141px] h-[79px] object-cover"
              alt="Sky Logo"
              src="/image-5.png"
            />
          </div>
        </div>
      </main>

      <FooterBanner/>
    </div>
  );
};

export default SignIn;