import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import Input from "../components/Input";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import axios from "axios";
import { ensureCsrfToken } from "../lib/csrf";
import { useNavigate } from "react-router-dom";
import ColorblindToggle from "../components/ColourblindToggle";

const SignIn = ({ colorblind, setColorblind }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [formErrors, setFormErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const apiUrl = process.env.REACT_APP_API_URL;
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
      // Ensure token is fetched and axios defaults are set
      await ensureCsrfToken(apiUrl);

      const response = await axios.post(`${apiUrl}/api/sign-in`, signInPayload, { withCredentials: true });

      console.log("Sign In Response:", response.data);
      if (response?.data?.message === "Sign in successful") {
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.error === "Incorrect username or password") {
        setEmail("");
        setPassword("");
        setFormErrors(["Incorrect username or password."]);
        incrementAttempts();
      }
      console.error("Sign In Error:", error);
    }
  };

  const incrementAttempts = () => {
    setAttempts(attempts + 1);
  };

  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <header>
        <HeaderBanner className="md:fixed"  logoLinked={false} centerLogo={true} colorblindButton={<ColorblindToggle colorblind={colorblind} setColorblind={setColorblind} />} />
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
          <Card className="w-[380px] min-h-[460px] rounded-[7px] bg-white shadow-sm transition-all duration-300 ease-in-out">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <h1
                  id="sign-in-heading"
                  className="mb-4 bg-[linear-gradient(90deg,var(--gradient-start)_0%,var(--gradient-middle)_50%,var(--gradient-end)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] text-transparent [font-family:'Sky_Text',Helvetica] text-[38px] leading-[57px]"
                >
                  Hello
                </h1>
                <p className="[font-family:'Sky_Text',Helvetica] font-normal text-[17px] leading-[25.5px]">
                  <span className="text-[#4a4a4a]">Sign in to </span>
                  <span className="text-[var(--color-accent)]">ClearSky</span>
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
                  type={passwordVisible ? "text" : "password"}
                  label="Password"
                  showPasswordToggle={true}
                  onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
                  // errorMessage={`${attempts === 0 ? "Enter your password." : "Incorrect password. Please try again."}`}
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
