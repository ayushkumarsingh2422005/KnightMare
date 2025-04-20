import { useContext, useState, useEffect } from "react";
import { 
  FaChessKnight, 
  FaChessBoard,
  FaChessRook, 
  FaChessPawn,
  FaChessQueen,
  FaChessKing,
  FaChessBishop
} from "react-icons/fa";
import { GiChessKing, GiChessBishop, GiChessKnight } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { commoncontext } from "../contexts/commoncontext";
import { useNavigate } from 'react-router-dom';

export default function HomeUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { setShowNavbar, user } = useContext(commoncontext);
  const navigate = useNavigate();
  
  useEffect(() => {
    setShowNavbar(true);
  }, [setShowNavbar]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      clearTimeout(timer);
    };
  }, []);

  const chessPieces = [
    { Icon: FaChessRook, position: "top-20 left-10", color: "text-blue-400", size: "text-5xl" },
    { Icon: GiChessKing, position: "bottom-20 right-10", color: "text-purple-400", size: "text-6xl" },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  // Chess-themed navigation options
  const navOptions = [
    {
      title: "Play Now",
      description: "Start a new game against AI",
      icon: FaChessKnight,
      color: "from-gray-950/60 to-blue-800/70 via-purple-900",
      path: "/playWithAI",
      piece: "♞"
    },
    {
      title: "Analyze Game",
      description: "Review your past games or famous matches",
      icon: FaChessBishop,
      color: "from-purple-500/70 to-blue-900/40 via-gray-950/70",
      path: "/analysis",
      piece: "♝"
    },
    {
      title: "Leaderboard",
      description: "See How well you are competing",
      icon: FaChessRook,
      color: "from-gray-950/80 to-pink-800/60 via-purple-800/80",
      path: "/leaderboard",
      piece: "♜"
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 text-white py-16 px-4 sm:px-0 pb-0 overflow-hidden relative">
        {/* Background elements (unchanged) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[length:80px_80px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]"></div>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[length:50px_50px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]"></div>
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-50 bg-gray-950"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <FaChessBoard className="text-6xl text-blue-500" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chess pieces decoration (unchanged) */}
        {chessPieces.map((piece, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.1,
              y: [0, -15, 0],
              transition: {
                y: {
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 1,
                  delay: index * 0.2
                }
              }
            }}
            className={`absolute ${piece.position} ${piece.color} ${piece.size} hidden md:block`}
          >
            <piece.Icon />
          </motion.div>
        ))}

        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/2 left-1/2 w-96 h-96 bg-pink-600 rounded-full opacity-8 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1 w-96 h-96 bg-purple-700 rounded-full opacity-8 blur-3xl"></div>

        {/* Floating chess pieces (unchanged) */}
        <div className="hidden md:block">
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-10 text-4xl opacity-20 text-blue-300"
          >
            ♜
          </motion.div>
          <motion.div 
            animate={{ 
              y: [0, 50, 0],
              rotate: [0, -15, 15, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 7,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute bottom-1/3 right-20 text-4xl opacity-20 text-blue-300"
          >
            ♛
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl h-20 md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {user ? `Welcome, ${user.username}` : "Welcome to Knightmare Chess"}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Your ultimate chess experience. Play, learn, and master the game of kings.
            </p>
          </motion.div>

          {/* Chessboard Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {navOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => handleCardClick(option.path)}
                className={`bg-gradient-to-br ${option.color} rounded-xl p-6 shadow-xl border border-gray-700/50 relative overflow-hidden group`}
              >
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  {option.piece}
                </div>
                <div className="relative z-10">
                  <option.icon className="text-3xl mb-4" />
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-gray-200 mb-4">{option.description}</p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition"
                  >
                    Explore
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chess Move Path Visualization */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16  lg:block"
          >
            <div className="relative h-64">
              {/* Chess move path lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Main path */}
                <path 
                  d="M10,50 Q25,20 40,50 T70,50 T90,30" 
                  stroke="rgba(99, 102, 241, 0.3)" 
                  strokeWidth="1" 
                  fill="none"
                  strokeDasharray="5,5"
                />
                
                {/* Connect options to path */}
                {[15, 35, 55, 75, 85].map((x, i) => (
                  <path 
                    key={i}
                    d={`M${x},50 L${x},${i % 2 === 0 ? 30 : 70}`}
                    stroke="rgba(168, 85, 247, 0.3)"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                ))}
              </svg>

              {/* Animated knight moving along path */}
              <motion.div
                animate={{
                  x: ["0%", "30%", "60%", "90%"],
                  y: ["0%", "-20%", "0%", "-10%"]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute left-0 top-1/2 text-2xl text-yellow-400"
              >
                <GiChessKnight />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer (unchanged) */}
        <div className="w-full py-4 bg-gradient-to-t from-blue-900/70 to-transparent mt-8 md:mt-16 flex items-center justify-center">
          <p className="text-gray-400 text-xs md:text-sm">
            © {new Date().getFullYear()} Knightmare Chess - All rights reserved
          </p>
        </div> 
      </div>
    </>
  );
};
