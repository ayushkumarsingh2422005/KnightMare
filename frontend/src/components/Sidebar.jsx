import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { commoncontext } from "../contexts/commoncontext";
import { AudioContext } from "../Context/AudioContext";
import { toast } from "react-toastify";

const Sidebar = () => {
  const Navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { setToken, setUser, user, token , showNavbar } = useContext(commoncontext);
  const { isPlaying, playAudio, pauseAudio } = useContext(AudioContext);

  const toggleSound = () => {
    if (isPlaying) pauseAudio();
    else playAudio();
  };

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("You have been logged out successfully!");
    Navigate("/");
  };

  return (
    <div
      className={`hidden md:block bg-black relative z-10 shadow-xl transition-all duration-300 ease-in-out ${
        isExpanded ? "w-56" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* User Profile Section */}
      <div
        onClick={() => Navigate("/profile")}
        className="pb-2 cursor-pointer border-b border-gray-700"
      >
        //{" "}
        <div className="flex items-center pb-2 overflow-hidden">
          //{" "}
          {!isExpanded && (<div
            style={{
              backgroundImage: `url(${user?.profilePicture})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center"
          >
            {user ? "" : "P"}
          </div>)}
          {isExpanded && (
            <div className="text-white">
              <p className="font-medium">
                {user ? user.username : "Sign in to see details"}
              </p>
              <p className="text-xs text-gray-400">{user ? user.email : ""}</p>
            </div>
          )}
        </div>
      </div>
      {/* Navigation Links */}
      <nav className="space-y-1 p-2">
        
        {/* Main Navigation Links */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span
            className={`transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Home
          </span>
        </NavLink>

        <NavLink
          to="/playWithAI"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3l14 9-14 9V3z"
            />
          </svg>
          <span
            className={`transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Play
          </span>
        </NavLink>

        <NavLink
          to="/leaderBoard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16v4M12 12v8M16 8v12M4 20h16"
            />
          </svg>
          <span
            className={`transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            LeaderBoard
          </span>
        </NavLink>

        <NavLink
          to="/analysis"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="4" y="4" width="16" height="16" strokeWidth="1.5" />
            <path
              d="M4 8h16M4 12h16M4 16h16M8 4v16M12 4v16M16 4v16"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <path
              strokeWidth="2"
              strokeLinecap="round"
              d="M9 15l3-3m0 0l3 3m-3-3v6"
            />
            <circle cx="18" cy="6" r="1.5" fill="currentColor" />
          </svg>
          <span
            className={`transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Analysis
          </span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`
          }
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.5V2m4.95 3.05l1.41-1.41M19.5 12h2m-3.05 4.95l1.41 1.41M12 19.5v2m-4.95-3.05l-1.41 1.41M4.5 12h-2m3.05-4.95l-1.41-1.41M12 8a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>
          <span
            className={`transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Settings
          </span>
        </NavLink>
         {/* Sound Toggle Button */}
         {(!showNavbar)?(<div
            onClick={toggleSound}
            className={ "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700"}>
            {isPlaying ? (
              <svg
                className="w-6 h-6 lg:w-6 lg:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            )}
            <span
            className={`transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
           { isPlaying ? "Sound on" : "Sound off"}
          </span>
          </div>):""}
      </nav>
    </div>
  );
};

export default Sidebar;
