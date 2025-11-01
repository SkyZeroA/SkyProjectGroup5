import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const [auth, setAuth] = useState(null); // null=loading, true=authed, false=not authed
  const apiUrl = process.env.REACT_APP_API_URL;
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${apiUrl}/api/fetch-user-data`, { withCredentials: true })
      .then(() => {
        if (mounted) setAuth(true);
      })
      .catch(() => {
        if (mounted) setAuth(false);
      });
    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  // Still checking session
  if (auth === null) return null;

  if (!auth) {
    // Redirect to sign-in, preserving attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
