import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import Input from "../components/Input";
import HeaderBanner from "../components/HeaderBanner";
import FooterBanner from "../components/FooterBanner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ensureCsrfToken } from "../lib/csrf";
import debounce from "lodash.debounce";

const SignUp = () => {
  const [name, setName] = useState("");
  const [firstNameStatus, setFirstNameStatus] = useState("");

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");

  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailError, setEmailError] = useState("Enter your email address.");

  const [password, setPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("Re-type your password.");

  const [formErrors, setFormErrors] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // Regex validation
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,}$/;
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  const emailRegex = /^[^\s@]+@sky\.uk$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /** Live validation for first name */
  useEffect(() => {
    if (!name) {
      setFirstNameStatus("");
    } else if (nameRegex.test(name.trim())) {
      setFirstNameStatus("valid");
    } else {
      setFirstNameStatus("invalid");
    }
  }, [name]);

  /** Live validation for email */
  useEffect(() => {
    if (!email) {
      setEmailStatus("");
    } else if (emailRegex.test(email.trim())) {
      setEmailStatus("valid");
    } else {
      setEmailStatus("invalid");
    }
  }, [email]);

  /** Live validation for password */
  useEffect(() => {
    if (!password) {
      setPasswordStatus("");
    } else if (passwordRegex.test(password)) {
      setPasswordStatus("valid");
    } else {
      setPasswordStatus("invalid");
    }
  }, [password]);

  /** Live validation for username (async) */
  useEffect(() => {
    if (!username) {
      setUsernameStatus("");
      return;
    }
    if (!usernameRegex.test(username.trim())) {
      setUsernameStatus("invalid");
      return;
    }
    setUsernameStatus("checking");

    const checkUsername = debounce(async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/check-username`, {
          params: { username },
          withCredentials: true,
        });
        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch (err) {
        console.error(err);
        setUsernameStatus("");
      }
    }, 500);

    checkUsername();
    return () => checkUsername.cancel();
  }, [username]);

  /** Sign-up form submit */
  const handleSignUp = async (e) => {
    e.preventDefault();
    // Client-side validation
    if (firstNameStatus !== "valid") {
      setFormErrors(["First name must be at least 3 letters and contain no numbers."]);
      return;
    }
    if (usernameStatus !== "available") {
      setFormErrors(["Username must be 3-16 chars, letters, numbers, underscores, or hyphens."]);
      return;
    }
    if (emailStatus !== "valid") {
      setFormErrors(["Email must end with @sky.uk."]);
      return;
    }
    if (passwordStatus !== "valid") {
      setFormErrors(["Password must be 8+ chars, with upper/lower case, number, and special char."]);
      return;
    }
    if (password !== confirmPassword) {
      setFormErrors(["Passwords do not match. Please re-type."]);
      return;
    }

    const signUpPayload = {
      "first-name": name,
      username,
      email,
      password,
      "confirm-password": confirmPassword,
    };

    await ensureCsrfToken(apiUrl);
    try {
      const response = await axios.post(`${apiUrl}/api/sign-up`, signUpPayload, { withCredentials: true });
      if (response?.data?.message === "Sign up successful") {
        setFormErrors([]);
        navigate("/questionnaire");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        const errMsg = error.response?.data?.error;
        if (errMsg === "Username already exists") {
          setFormErrors([]);
          setUsername("");
        } else if (errMsg === "Email already has an account") {
          setFormErrors([]);
          setEmail("");
        } else if (errMsg === "Passwords do not match") {
          setFormErrors([]);
          setPassword("");
          setConfirmPassword("");
        }
      }
      console.error("Sign Up Error:", error);
    }
  };

  return (
    <div className="bg-neutral-50 overflow-hidden w-full min-h-screen relative">
      <header>
        <HeaderBanner className="md:fixed" logoLinked={false} centerLogo={true} />
      </header>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-white focus:p-2 focus:z-50"
      >
        Skip to main content
      </a>

      <main id="main-content" className="flex items-center justify-center min-h-screen">
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

              <form onSubmit={handleSignUp} aria-labelledby="sign-up-heading" className="space-y-6" noValidate>
                <Input
                  id="first-name"
                  type="text"
                  label="First Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isValid={firstNameStatus === "valid"}
                  showError={firstNameStatus === "invalid"}
                  errorMessage="First name must be at least 3 letters and contain no numbers."
                />

                <Input
                  id="username"
                  type="text"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isValid={usernameStatus === "available"}
                  isChecking={usernameStatus === "checking"}
                  showError={usernameStatus === "invalid" || usernameStatus === "taken"}
                  errorMessage={
                    usernameStatus === "invalid"
                      ? "3-16 chars, letters, numbers, underscores, hyphens."
                      : usernameStatus === "taken"
                      ? "This username is already taken."
                      : ""
                  }
                />

                <Input
                  id="email"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isValid={emailStatus === "valid"}
                  showError={emailStatus === "invalid"}
                  errorMessage="Email must end with @sky.uk."
                />

                <Input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isValid={passwordStatus === "valid"}
                  showError={passwordStatus === "invalid"}
                  errorMessage="Password must be 8+ chars, with upper/lower case, number, special char."
                  showPasswordToggle={true}
                  onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
                  showStatusIcon={false}
                />

                <Input
                  id="confirmPassword"
                  type={confirmPasswordVisible ? "text" : "password"}
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  showError={!!confirmPasswordError}
                  errorMessage={confirmPasswordError || "Re-type your password."}
                  showPasswordToggle={true}
                  onPasswordToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  showStatusIcon={false}
                />

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
