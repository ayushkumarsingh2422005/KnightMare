import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { commoncontext } from "../contexts/commoncontext";
import { GoogleLogin } from "@react-oauth/google";
import { assets } from "../assets/assets";

const Login = () => {
  const { setToken, setUser, setShowNavbar } = useContext(commoncontext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setShowNavbar(true);
  }, [setShowNavbar]);

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
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('chessfloor2.jpg')" }}
    >
      <div className="absolute inset-0 "></div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className=" backdrop-blur-md p-6 rounded-xl shadow-2xl">
          {/* Chess Knight Icon */}
          <div className="flex justify-center mb-1">
            <div className="w-16 h-16 flex items-center justify-center bg-black rounded-full ">
              <img src={assets.logo} alt="login"/>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-center  text-blue-400">Welcome Back</h2>
          <p className="text-gray-400 text-sm  text-center mb-4">Sign in to continue your chess journey</p>
          
          <form className="space-y-3" onSubmit={handleLogin}>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none  text-white"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-gray-300">Password</label>
                <span 
                  className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer" 
                  onClick={() => navigate('/forgotpassword')}
                >
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none  text-white"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-black hover:bg-gray-900 rounded-lg text-white font-semibold transition duration-300 border border-gray-700"
            >
              Login
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
            Don't have an account? <span 
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium" 
              onClick={() => navigate('/register')}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;