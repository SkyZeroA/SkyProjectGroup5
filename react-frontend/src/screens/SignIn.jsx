import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import Input from "../components/Input";
import HeaderBanner from "../components/HeaderBanner";
import  FooterBanner from "../components/FooterBanner";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [formErrors, setFormErrors] = useState([]);
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@sky\.uk$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  const handleSignIn = async (e) => {
    e.preventDefault();
    const signInPayload = { 
      "email": email,
      "password": password
    };
    console.log("Sign In Payload:", signInPayload);

    if (!emailRegex.test(email.trim())) {
      const msg = "Email must be a valid @sky.uk address.";
      setFormErrors([msg]);
      return;
    }

    if (!passwordRegex.test(password)) {
      const msg = "Password must be at least 8 characters, include upper and lower case letters, a number, and a special character.";
      setFormErrors([msg]);
      return;
    }

    // await axios.post("http://localhost:9099/api/sign-in", signInPayload, {withCredentials:true})
    await axios.post(`${apiUrl}/api/sign-in`, signInPayload, {withCredentials:true})
      .then((response) => {
        console.log("Sign In Response:", response.data);
        if (response?.data?.message === "Sign in successful") {
          navigate("/dashboard")
        }
      })
      .catch((error) => {
        if (error.response?.data?.error === "Incorrect username or password") {
          setEmail("");
          setPassword("");
          setFormErrors(["Incorrect username or password."]);
          incrementAttempts();
        }
        console.error("Sign In Error:", error);
      });
  };

  const incrementAttempts = () => {
    setAttempts(attempts + 1);
  }

  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <HeaderBanner className="md:fixed"/>

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
                  // errorMessage={`${attempts === 0 ? "Enter your password." : "Incorrect password. Please try again."}`}
                  errorMessage="Enter your password."
                  showError={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
  
                <Button
                  variant="default"
                  className="w-full h-auto py-3 text=[#ffffff] bg-[#000ef5] hover:bg-[#004ef5] [font-family:'Sky_Text',Helvetica] text-[18.5px] "
                  onClick={handleSignIn}
                >
                  Continue
                </Button>
                {formErrors.length > 0 && (
                  <div className="mt-3 text-center">
                    {formErrors.map((err, i) => (
                      <p key={i} className="text-sm text-red-600">{err}</p>
                    ))}
                  </div>
                )}
  
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
                    onClick={() => {navigate('/sign-up')}}
                  >
                    Create a new account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FooterBanner className="md:fixed"/>
    </div>
  );
};

export default SignIn;