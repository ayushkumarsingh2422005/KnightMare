import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chess from "./Chess";
import GameSetup from "./GameSetup";
import { commoncontext } from "../contexts/commoncontext";
import { gamecontext } from "../contexts/gamecontext";
import { FaChessBoard, FaChessKnight, FaChessRook } from "react-icons/fa";
import { GiChessKing, GiChessBishop } from "react-icons/gi";

const Play = () => {
  const { showBoard } = useContext(gamecontext);
  const { setShowNavbar } = useContext(commoncontext);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    setShowNavbar(isMobile);
  }, [isMobile, setShowNavbar]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.6 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

 

  // Chess pieces for decorative background
  const chessPieces = [
    { Icon: FaChessRook, position: "top-20 left-10", color: "text-blue-400", size: "text-5xl" },
    { Icon: GiChessKing, position: "bottom-20 right-10", color: "text-purple-400", size: "text-6xl" },
    { Icon: FaChessKnight, position: "top-40 right-20", color: "text-indigo-400", size: "text-4xl" },
    { Icon: GiChessBishop, position: "bottom-40 left-20", color: "text-pink-400", size: "text-5xl" },
  ];

  return (
    <>
     <div className="bg-gray-950 min-h-screen text-white font-sans">
       <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[length:80px_80px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]"></div>
      </div>
    <motion.div 
      className="bg-gray-950 min-h-screen text-white font-sans "
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
  
      
      {/* Grid overlay
      <div className="absolute   inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[length:50px_50px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]"></div>
      </div> */}

      

      {/* Chess pieces decoration */}
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

      {/* Glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>

      {/* Loading state */}
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

      {/* Main content */}
      <AnimatePresence mode="wait">
        {!showBoard ? (
          <motion.div 
            key="setup"
            className="flex justify-center items-center min-h-screen relative z-10 px-4"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
          >
            <div className="w-full max-w-4xl">
              <div className="text-center mb-8">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center justify-center mb-3 space-x-3"
                >
                  <FaChessKnight className="text-blue-400 text-3xl" />
                  <h2 className="text-lg uppercase tracking-widest text-blue-400 font-light">Game Setup</h2>
                </motion.div>
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl h-15 md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-purple-400"
                >
                  Configure Your Match
                </motion.h1>
                
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="h-0 w-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"
                />
              </div>
              <GameSetup />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="chess"
            className="relative z-10"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <Chess />
          </motion.div>
        )}
      </AnimatePresence>

      

     
    </motion.div>
     <div className="w-full py-4 bg-gradient-to-t from-blue-900/70 to-transparent mt-8 md:mt-16 flex items-center justify-center">
     <p className="text-gray-400 text-xs md:text-sm">
       © {new Date().getFullYear()} Knightmare Chess - All rights reserved
     </p>
   </div>
   </div>
  </>
    
  );
};

export default Play;