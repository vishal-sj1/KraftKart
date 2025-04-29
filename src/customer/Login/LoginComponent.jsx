import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// InputField component for form fields
const InputField = ({
  type,
  placeholder,
  icon,
  isPasswordShown,
  setIsPasswordShown,
  showVisibilityToggle,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="relative w-full mb-4">
      <input
        type={isPasswordShown && type === "password" ? "text" : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full py-3 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        required={!placeholder.includes("Phone Number")}
      />
      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">{icon}</span>
      {showVisibilityToggle && (
        <span
          onClick={() => setIsPasswordShown((prev) => !prev)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 cursor-pointer"
        >
          <VisibilityIcon fontSize="small" />
        </span>
      )}
    </div>
  );
};

// SocialLogin component for Google OAuth
const SocialLogin = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    try {
      const userObject = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google User:", userObject);
      const userData = {
        email: userObject.email,
        name: userObject.name,
        picture: userObject.picture,
        phone_number: null,
      };
      console.log("User Data to Send:", userData);
      await googleLogin(userData);
      console.log("Google Login Successful, Navigating to /");
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error.message);
      setError(error.message || "Google login failed");
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed: OAuth Error");
    setError("Failed to authenticate with Google");
  };

  return (
    <div className="w-full px-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <p className="text-gray-500 text-sm">or</p>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="continue_with"
          shape="rectangular"
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="flex items-center justify-center  py-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:border-purple-500 transition"
            >
              <img src="google.svg" alt="Google" className="w-5 h-5 mr-2" />
              Continue with Google
            </button>
          )}
        />
      </div>
    </div>
  );
};

// Main LoginComponent
const LoginComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone_number: "",
  });
  const [error, setError] = useState("");

  const { login, signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
        navigate("/", { replace: true });
      } else {
        await signup({
          email: formData.email,
          name: formData.name || formData.email.split("@")[0],
          password: formData.password,
          phone_number: formData.phone_number || null,
        });
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="flex justify-center items-center lg:mt-1 bg-white p-4">
      <div className="w-full max-w-md p-6 border-[#D0D0D0] rounded-lg shadow-lg shadow-[#aaa8a8]">
        <h2 className="text-xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="email"
            placeholder="Email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={<MailOutlineIcon fontSize="small" />}
          />

          {!isLogin && (
            <InputField
              type="text"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={<MailOutlineIcon fontSize="small" />}
            />
          )}

          {!isLogin && (
            <InputField
              type="tel"
              placeholder="Phone Number (optional)"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              icon={<PhoneIcon fontSize="small" />}
            />
          )}

          <InputField
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon={<LockIcon fontSize="small" />}
            isPasswordShown={isPasswordShown}
            setIsPasswordShown={setIsPasswordShown}
            showVisibilityToggle={true}
          />

          {!isLogin && (
            <InputField
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<LockIcon fontSize="small" />}
              isPasswordShown={isPasswordShown}
              setIsPasswordShown={setIsPasswordShown}
              showVisibilityToggle={false}
            />
          )}

          {isLogin && (
            <a
              href="#"
              className="text-sm text-purple-500 hover:underline block text-right"
            >
              Forgot password?
            </a>
          )}

          <button
            type="submit"
            className="w-full py-3 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
          <span
            className="text-purple-500 hover:underline cursor-pointer"
            onClick={() => navigate(isLogin ? "/signup" : "/login")}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
        <SocialLogin />
      </div>
    </div>
  );
};

export default LoginComponent;