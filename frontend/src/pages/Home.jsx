

import { React, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { commoncontext } from "../contexts/commoncontext.jsx";
import HomeUser from '../pages/HomeUser.jsx';

const Home = () => {
  const { token, setShowNavbar } = useContext(commoncontext);

  useEffect(() => {
    setShowNavbar(true);
  }, [setShowNavbar]);

  if (token) {
    return <HomeUser />;
  }

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center relative" 
      style={{ backgroundImage: "url('/bgchess5.jpg')" }}
    >
      {/* Overlay to enhance text readability if needed */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Main content */}
      <div className="relative z-10 px-4 w-fit max-w-md">
        <div className="text-center rounded-lg mb-8">
          <h1 className="text-6xl font-bold text-white mb-2">
            <span className="text-white">Knight</span>
            <span className="text-amber-500">Mare</span>
          </h1>
          <p className="text-lg font-bold text-gray-200 italic">Master the board. Challenge yourself.</p>
        </div>

        <div className="bg-gray-950/60 p-8 rounded-xl backdrop-blur-sm border border-gray-700 shadow-2xl">
          <div className="mb-6 text-center">
            <p className="text-gray-200 text-lg mb-6">
              Enhance your chess skills by playing against AI opponents and track your progress as you improve.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-amber-500 text-2xl font-bold">Play</div>
                <div className="text-gray-300 text-sm">against AI</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-amber-500 text-2xl font-bold">Learn</div>
                <div className="text-gray-300 text-sm">and improve Skills</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-amber-500 text-2xl font-bold">Track</div>
                <div className="text-gray-300 text-sm">Your Progress</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Link
              to="/login"
              className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition duration-300 text-center"
            >
              Login
            </Link>
            <div className="text-center text-gray-200">
              Don't have an account? <Link to="/register" className="text-amber-500 font-bold hover:text-blue-300 transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-300 text-sm">
          <p>Experience the ultimate chess challenge</p>
        </div>
      </div>
    </div>
  );
};

export default Home;