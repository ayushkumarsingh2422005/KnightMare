import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { commoncontext } from "../contexts/commoncontext";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../utils/api";


const Login = () => {
  const { setToken, setUser, showNavbar, setShowNavbar } = useContext(commoncontext);
  setShowNavbar(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        if (result.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setToken(response.data.token);
          setUser(response.data.user);
          toast.success("Login successful!");
          navigate("/home-user");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log('Error while Google Login...', e);
    }
  };

  const handleGoogleSuccess = async (response) => {
    const googleToken = response.credential;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/googlelogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await res.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      localStorage.setItem('user',data.user);
      setUser(data.user);
      if (res.ok) {
        navigate('/');
      } else {
        console.error('Error during Google Login:', data.message);
      }
    } catch (error) {
      console.error('Google Login API Error:', error);
    }
  };
  const handleGoogleFailure = (error) => {
    console.error('Google Login Error:', error);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success("Login successful!");
        navigate("/home-user");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred during login");
    }
  };
 return (
    <div
      style={{
        backgroundImage: "url('chessfloor2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex justify-center items-center min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-5 shadow-lg rounded-lg backdrop-blur-lg relative" style={{ marginTop: '-10%' }}>
        <h2 className="text-3xl font-semibold pb-2 text-center text-white neon-text">Welcome</h2>
        <p className="text-sm text-center">Sign in to your account</p>
        <form className="mt-3" onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="font-bold text-sm cursor-pointer text-red-500 text-center sm:text-left" onClick={() => navigate('/forgotpassword')}>Forgot password?</div>
          <button
            type="submit"
            className="mt-2 w-full py-2 bg-black hover:bg-gray-900 rounded-md text-white font-semibold shadow-md"
          >
            Login
          </button>
        </form>
        <div className="mt-4 border-t border-gray-700 pt-4">
          <p className="text-center text-gray-400">OR</p>
          <div className="mt-4 space-y-3 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
              />
          </div>
          <p className="text-center text-gray-200 mt-4">
            Don't have an account? <a href="/register" className="text-white hover:underline">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );

};
export default Login;