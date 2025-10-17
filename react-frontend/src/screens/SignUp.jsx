import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import Input from "../components/Input";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import { useNavigate } from "react-router-dom"
import axios from "axios";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("Enter your username.");
  const [emailError, setEmailError] = useState("Enter your email address.");
  const [confirmPasswordError, setConfirmPasswordError] = useState("Re-type your password.");

  const navigate = useNavigate()

  // Each error caught in this function sets the relevant error message and clears the relevant fields
  // This is so if the user makes two mistakes, one after the other, they will not see both error messages, only the one relevant to their most recent mistake
  // There will be a better way to do this but I can't think of it right now
  const handleSignUp = async (e) => {
    e.preventDefault();
    const signUpPayload = {
      "first-name": name,
      "username": username,
      "email": email,
      "password": password,
      "confirm-password": confirmPassword
    };
    console.log("Sign Up Payload:", signUpPayload);

    await axios.post("http://localhost:9099/api/sign-up", signUpPayload, { withCredentials: true })
      .then((response) => {
        console.log("Sign In Response:", response.data);
        if (response?.data?.message === "Sign up successful") {
          navigate("/questionnaire")
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          if (error.response?.data?.error === "Username already exists") {
            // Handle username already exists error
            setUsernameError("Username already exists. Please choose another.");
            setEmailError("Enter your email address.");
            setConfirmPasswordError("Re-type your password.");
            setUsername("");
            setPassword("");
            setConfirmPassword("");

          } else if (error.response?.data?.error === "Email already has an account") {
            // Handle email already has an account error
            setUsernameError("Enter your username.");
            setEmailError("Email already has an account. Please use another.");
            setConfirmPasswordError("Re-type your password.");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

          } else if (error.response?.data?.error === "Passwords do not match") {
            // Handle passwords do not match error
            setUsernameError("Enter your username.");
            setEmailError("Enter your email address.");
            setConfirmPasswordError("Passwords do not match. Please re-type.");
            setPassword("");
            setConfirmPassword("");
          }
        }
        console.error("Sign Up Error:", error);
      });
  };

  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <HeaderBanner className="lg:fixed"/>

      <main className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Card className="w-[380px] min-h-[544px] rounded-[7px] bg-white shadow-sm transition-all duration-300 ease-in-out mt-[5px]">
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
                  id="first-name"
                  type="text"
                  label="First Name"
                  errorMessage="Enter your first name."
                  showError={true}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  id="username"
                  type="text"
                  label="Username"
                  errorMessage={usernameError}
                  showError={true}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                  id="email"
                  type="email"
                  label="Email"
                  errorMessage={emailError}
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
                  errorMessage={confirmPasswordError}
                  showError={true}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
  
                <Button
                  variant="default"
                  className="w-full h-auto py-3 text=[#ffffff] bg-[#000ef5] hover:bg-[#004ef5] [font-family:'Sky_Text',Helvetica] text-[18.5px]"
                  onClick={handleSignUp}
                >
                  Continue
                </Button>
  
                <div className="text-center">
                  <Button
                    variant="link"
                    className="h-auto p-0 [font-family:'Sky_Text',Helvetica] text-[#000ef5] text-[16.5px] leading-[24.8px]"
                    onClick={() => {navigate('/')}}
                  >
                    Already got an account? Sign in here
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FooterBanner className="lg:fixed"/>
    </div>
  );
};

export default SignUp;