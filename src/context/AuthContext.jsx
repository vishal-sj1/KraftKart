import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (userData) => {
    const { email, password } = userData;
    if (!email || !password) {
      throw new Error("Email and password are required for login");
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const signup = async (userData) => {
    const { email, name, password, phone_number } = userData;
    if (!email || !name || !password) {
      throw new Error("Email, name, and password are required for signup");
    }

    try {
      await axios.post("http://localhost:5000/api/register", {
        email,
        name,
        password,
        phone_number: phone_number || null,
        provider: "manual",
      });
      return await login({ email, password });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const googleLogin = async (userData) => {
    const { email, name, picture, phone_number } = userData;
    if (!email || !name) {
      throw new Error("Email and name are required for Google login");
    }

    try {
      console.log("Sending Google Login Request:", userData);
      const response = await axios.post("http://localhost:5000/api/google-login", {
        email,
        name,
        picture,
        phone_number: phone_number || null,
      });
      console.log("Google Login Response:", response.data);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      console.log("User State Updated:", user);
      return true;
    } catch (error) {
      console.error("Google Login API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Google login failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    loading,
    login,
    signup,
    googleLogin,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};