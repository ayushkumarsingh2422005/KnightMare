import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { commoncontext } from "../contexts/commoncontext";
import { GoogleLogin } from "@react-oauth/google";
import { assets } from "../assets/assets";

const Register = () => {
  const { setToken, setUser, backendUrl, setShowNavbar } = useContext(commoncontext);
  const navigate = useNavigate();
  setShowNavbar(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

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
      localStorage.setItem('user', data.user);
      setUser(data.user);
      if (res.ok) {
        toast.success("Login successful!");
        navigate('/');
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (error) {
      toast.error("Google Login API Error");
      console.error('Google Login API Error:', error);
    }
  };

  const handleGoogleFailure = (error) => {
    toast.error("Google Login Failed");
    console.error('Google Login Error:', error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/auth/register`, formData);
      if (response.data.success) {
        setToken(response.data.token)
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Registration successful!");
        navigate("/home-user");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred during registration");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('chessfloor2.jpg')" }}
    >
      <div className="absolute inset-0"></div>
      <div className="relative z-10 w-full max-w-md px-4">
        <div className=" backdrop-blur-md p-6 rounded-xl shadow-2xl">
          <div className="flex justify-center mb-1">
            <div className="w-16 h-16 flex items-center justify-center bg-black rounded-full">
              <img src={assets.logo} alt="register"/>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-center text-blue-400">Create Account</h2>
          <p className="text-gray-400 text-sm text-center mb-4">Join us to begin your chess journey</p>
          
          <form className="space-y-3" onSubmit={handleRegister}>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-white"
                placeholder="Choose a username"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-white"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-white"
                placeholder="Create a password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-black hover:bg-gray-900 rounded-lg text-white font-semibold transition duration-300 border border-gray-700 hover:border-blue-400"
            >
              Register
            </button>
          </form>
          
          <div className="mt-6 flex items-center">
            <div className="flex-grow h-px bg-gray-700"></div>
            <p className="mx-4 text-gray-400">OR</p>
            <div className="flex-grow h-px bg-gray-700"></div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
              width="100%"
            />
          </div>
          
          <p className="text-center text-gray-300 mt-6">
            Already have an account?{" "}
            <span 
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium" 
              onClick={() => navigate('/login')}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
