import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import Input from "../components/Input";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const signInPayload = {
      email,
      password,
    };
    console.log("Sign In Payload:", signInPayload);

    try {
      const response = await axios.post(
        "http://localhost:9099/api/sign-in",
        signInPayload,
        { withCredentials: true }
      );

      console.log("Sign In Response:", response.data);
      if (response?.data?.message === "Sign in successful") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Sign In Error:", error);
      if (error.response?.data?.error === "Incorrect username or password") {
        setPassword("");
        incrementAttempts();
        setErrorMessage("Incorrect email or password. Please try again.");
        document.getElementById("password").focus();
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const incrementAttempts = () => {
    setAttempts(attempts + 1);
  };

  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <header>
        <HeaderBanner className="md:fixed" />
      </header>

      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-white focus:p-2 focus:z-50"
      >
        Skip to main content
      </a>

      <main
        id="main-content"
        className="flex items-center justify-center min-h-screen"
      >
        <div className="flex flex-col items-center">
          <Card className="w-[380px] min-h-[500px] rounded-[7px] bg-white shadow-sm transition-all duration-300 ease-in-out">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <h1
                  id="sign-in-heading"
                  className="mb-4 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] text-transparent [font-family:'Sky_Text',Helvetica] text-[38px] leading-[57px]"
                >
                  Hello
                </h1>
                <p className="[font-family:'Sky_Text',Helvetica] font-normal text-[17px] leading-[25.5px]">
                  <span className="text-[#4a4a4a]">Sign in to </span>
                  <span className="text-[#4bad31]">ClearSky</span>
                </p>
              </div>

              <form
                onSubmit={handleSignIn}
                aria-labelledby="sign-in-heading"
                className="space-y-6"
              >
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  errorMessage="Enter your email address."
                  showError={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby="email-error"
                  required
                />
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  errorMessage="Enter your password."
                  showError={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-error"
                  required
                />

                {/* Error message */}
                {errorMessage && (
                  <span
                    id="password-error"
                    role="alert"
                    className="text-red-600 text-sm"
                  >
                    {errorMessage}
                  </span>
                )}

                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-auto py-3 text-[#ffffff] bg-[#000ef5] hover:bg-[#004ef5] focus:outline-none focus:ring-2 focus:ring-[#4bad31] focus:ring-offset-2 [font-family:'Sky_Text',Helvetica] text-[18.5px]"
                >
                  Continue
                </Button>

                <div className="text-center space-y-4">
                  <Button
                    variant="link"
                    className="h-auto p-0 [font-family:'Sky_Text',Helvetica] text-[#000ef5] text-[16.5px] leading-[24.8px]"
                    aria-label="Forgotten your email or password?"
                  >
                    Forgotten your email or password?
                  </Button>

                  <Button
                    variant="link"
                    className="h-auto p-0 [font-family:'Sky_Text',Helvetica]  text-[#000ef5] text-[16.5px] leading-[24.8px]"
                    onClick={() => {
                      navigate("/sign-up");
                    }}
                    aria-label="Create a new account"
                  >
                    Create a new account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer>
        <FooterBanner className="md:fixed" />
      </footer>
    </div>
  );
};

export default SignIn;
