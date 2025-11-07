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

  const [usernameError, setUsernameError] = useState("Enter your username.");
  const [emailError, setEmailError] = useState("Enter your email address.");
  const [confirmPasswordError, setConfirmPasswordError] = useState("Re-type your password.");
  const [firstNameError, setFirstNameError] = useState("Enter your first name.");
  const [passwordError, setPasswordError] = useState("Enter your password.");
  const [formErrors, setFormErrors] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate()

  // Validation regexes
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,}$/;
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailRegex = /^[^\s@]+@sky\.uk$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Each error caught in this function sets the relevant error message and clears the relevant fields
  // This is so if the user makes two mistakes, one after the other, they will not see both error messages, only the one relevant to their most recent mistake
  const handleSignUp = async (e) => {
    e.preventDefault();
    // Client-side validation
    if (!nameRegex.test(name.trim())) {
      const msg = "First name must be at least 3 characters and may not include numbers, letters, spaces, hyphens or apostrophes.";
      // setFirstNameError(msg);
      setFormErrors([msg]);
      return;
    }
    if (!usernameRegex.test(username.trim())) {
      const msg = "Username must be 3-16 characters and may include letters, numbers, underscores or hyphens.";
      // setUsernameError(msg);
      setFormErrors([msg]);
      return;
    }
    if (!emailRegex.test(email.trim())) {
      const msg = "Email must be a valid @sky.uk address.";
      // setUsernameError("Enter your username.");
      // setEmailError(msg);
      setConfirmPasswordError("Re-type your password.");
      setFormErrors([msg]);
      return;
    }

    if (!passwordRegex.test(password)) {
      const msg = "Password must be at least 8 characters, include upper and lower case letters, a number, and a special character.";
      // setUsernameError("Enter your username.");
      setEmailError("Enter your email address.");
      // setPasswordError(msg);
      // setPassword("");
      // setConfirmPassword("");
      setFormErrors([msg]);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match. Please re-type.";
      setUsernameError("Enter your username.");
      setEmailError("Enter your email address.");
      // setConfirmPasswordError(msg);
      // setPassword("");
      // setConfirmPassword("");
      setFormErrors([msg]);
      return;
    }
    const signUpPayload = {
      "first-name": name,
      username,
      email,
      password,
      "confirm-password": confirmPassword,
    };
    console.log("Sign Up Payload:", signUpPayload);

    await axios.post(`${apiUrl}/api/sign-up`, signUpPayload, {withCredentials:true})
      .then((response) => {
        console.log("Sign In Response:", response.data);
        if (response?.data?.message === "Sign up successful") {
          setFormErrors([]);
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
            setFormErrors([]);

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
      <header>
        <HeaderBanner className="md:fixed" logoLinked={false} />
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
                  className="mb-4 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:'Sky_Text',Helvetica] font-normal text-transparent text-[38px] leading-[57px]"
                >
                  Hello
                </h1>
                <p className="[font-family:'Sky_Text',Helvetica] font-normal text-[17px] leading-[25.5px]">
                  <span className="text-[#4a4a4a]">Create your </span>
                  <span className="text-[#4bad31]">ClearSky</span>
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
                  errorMessage={firstNameError}
                  showError={true}
                  value={name}
                  onChange={(e) => { setName(e.target.value)}}
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
                  type={passwordVisible ? "text" : "password"}
                  label="Password"
                  showPasswordToggle={true}
                  onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
                  errorMessage={passwordError}
                  showError={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-describedby="password-error"
                />

                <Input
                  id="confirmPassword"
                  type={confirmPasswordVisible ? "text" : "password"}
                  label="Confirm Password"
                  showPasswordToggle={true}
                  onPasswordToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
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

                {formErrors.length > 0 && (
                  <div className="mt-3 text-center">
                    {formErrors.map((err, i) => (
                      <p key={i} className="text-sm text-red-600">{err}</p>
                    ))}
                  </div>
                )}
  
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
