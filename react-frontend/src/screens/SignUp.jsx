import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import Input from "../components/Input";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <HeaderBanner/>

      <main className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Card className="w-[380px] min-h-[544px] rounded-[7px] bg-white shadow-sm transition-all duration-300 ease-in-out mt-[100px]">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <h1 className="mb-4 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Sky_Text',Helvetica] font-normal text-transparent text-[38px] leading-[57px]">
                  Hello
                </h1>
                <p className="[font-family:'Sky_Text',Helvetica] font-normal text-[17px] leading-[25.5px]">
                  <span className="text-[#4a4a4a]">Create your </span>
                  <span className="text-[#4bad31]">ClearSky</span>
                  <span className="text-[#4a4a4a]"> account</span>
                </p>
              </div>
  
              <div className="space-y-6">
                <Input
                  id="name"
                  type="text"
                  label="Name"
                  errorMessage="Enter your full name."
                  showError={true}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

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

                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  errorMessage="Passwords do not match."
                  showError={true}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
  
                <Button
                  variant="default"
                  className="w-full h-auto py-3 text=[#ffffff] bg-[#000ef5] hover:bg-[#004ef5] [font-family:'Sky_Text',Helvetica] text-[18.5px] "
                >
                  Continue
                </Button>
  
                <div className="text-center">
                  <Button
                    variant="link"
                    className="h-auto p-0 [font-family:'Sky_Text',Helvetica] text-[#000ef5] text-[16.5px] leading-[24.8px]"
                  >
                    Already got an account? Sign in here
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FooterBanner/>
    </div>
  );
};

export default SignUp;