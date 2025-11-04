import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import Input from "../components/Input";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Reset previous error messages
    setUsernameError("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const signUpPayload = {
      "first-name": name,
      username,
      email,
      password,
      "confirm-password": confirmPassword,
    };
    console.log("Sign Up Payload:", signUpPayload);

    try {
      const response = await axios.post(
        "http://localhost:9099/api/sign-up",
        signUpPayload,
        { withCredentials: true }
      );
      console.log("Sign Up Response:", response.data);
      if (response?.data?.message === "Sign up successful") {
        navigate("/questionnaire");
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
      if (error.response?.status === 401) {
        const errMsg = error.response?.data?.error;
        if (errMsg === "Username already exists") {
          setUsernameError("Username already exists. Please choose another.");
          setUsername("");
          setPassword("");
          setConfirmPassword("");
        } else if (errMsg === "Email already has an account") {
          setEmailError("Email already has an account. Please use another.");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else if (errMsg === "Passwords do not match") {
          setConfirmPasswordError("Passwords do not match. Please re-type.");
          setPassword("");
          setConfirmPassword("");
        }
      }
    }
  };

  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <header>
        <HeaderBanner className="lg:fixed" />
      </header>

      {/* Skip link for keyboard users */}
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
          <Card className="w-[380px] min-h-[544px] rounded-[7px] bg-white shadow-sm transition-all duration-300 ease-in-out mt-[5px]">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <h1
                  id="sign-up-heading"
                  className="mb-4 bg-[linear-gradient(90deg,var(--gradient-start)_0%,var(--gradient-middle)_50%,var(--gradient-end)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:'Sky_Text',Helvetica] font-normal text-transparent text-[38px] leading-[57px]"
                >
                  Hello
                </h1>
                <p className="[font-family:'Sky_Text',Helvetica] font-normal text-[17px] leading-[25.5px]">
                  <span className="text-[#4a4a4a]">Create your </span>
                  <span className="text-[var(--color-accent)]">ClearSky</span>
                  <span className="text-[#4a4a4a]"> account</span>
                </p>
              </div>

              <form
                onSubmit={handleSignUp}
                aria-labelledby="sign-up-heading"
                className="space-y-6"
              >
                <Input
                  id="first-name"
                  type="text"
                  label="First Name"
                  errorMessage={nameError || "Enter your first name."}
                  showError={!!nameError}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-describedby="first-name-error"
                />

                <Input
                  id="username"
                  type="text"
                  label="Username"
                  errorMessage={usernameError || "Enter your username."}
                  showError={!!usernameError}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  aria-describedby="username-error"
                />

                <Input
                  id="email"
                  type="email"
                  label="Email"
                  errorMessage={emailError || "Enter your email address."}
                  showError={!!emailError}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-describedby="email-error"
                />

                <Input
                  id="password"
                  type="password"
                  label="Password"
                  errorMessage={passwordError || "Enter your password."}
                  showError={!!passwordError}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-describedby="password-error"
                />

                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  errorMessage={confirmPasswordError || "Re-type your password."}
                  showError={!!confirmPasswordError}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  aria-describedby="confirm-password-error"
                />

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-auto py-3 text-[#ffffff] bg-[#000ef5] hover:bg-[#004ef5] focus:outline-none focus:ring-2 focus:ring-[#4bad31] focus:ring-offset-2 [font-family:'Sky_Text',Helvetica] text-[18.5px]"
                >
                  Continue
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    className="h-auto p-0 [font-family:'Sky_Text',Helvetica] text-[#000ef5] text-[16.5px] leading-[24.8px]"
                    onClick={() => navigate("/")}
                    aria-label="Already have an account? Sign in here"
                  >
                    Already got an account? Sign in here
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer>
        <FooterBanner className="lg:fixed" />
      </footer>
    </div>
  );
};

export default SignUp;
