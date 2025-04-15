import React, { useContext, useEffect ,useState} from "react";
import ProfileCompA from "../components/ProfileCompA";
import HeatMap from "../components/HeatMap";
import ProgressGraph from "../components/ProgressGraph";
import ProfileSettings from "../components/ProfileSettings";
import { useSearchParams } from 'react-router';
import { commoncontext } from "../contexts/commoncontext";
import { 
  FaChessKnight, 
  FaChessQueen, 
  FaChessBoard,
  FaChessRook, 
} from "react-icons/fa";
import { GiChessKing, GiChessBishop } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, diffuseremail, setDiffuseremail } = useContext(commoncontext);
  const emailofdiffuser = searchParams.get('email');
  setDiffuseremail(emailofdiffuser);
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
    { Icon: FaChessKnight, position: "top-40 right-20", color: "text-indigo-400", size: "text-4xl" },
    { Icon: GiChessBishop, position: "bottom-40 left-20", color: "text-pink-400", size: "text-5xl" },
  ];
  useEffect(() => {
    return () => {
      setDiffuseremail(null);
    };
  }, []);
  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 min-h-screen text-white font-sans">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[length:80px_80px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]"></div>
        </div>
        {/* Grid overlay */}
       <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[length:50px_50px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]"></div>
      </div>

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
      <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>

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
        <ProfileCompA />
        <HeatMap />
        <h2 className="text-lg mx-4 sm:mx-8 md:mx-14 md:text-xl  font-extrabold text-white mb-6 border-b-2 border-white">
          Rating Progress
        </h2>
        {/* <h2 className=" text-xl ml-8 mr-14 p-4 font-extrabold text-white  border-b-2 border-white"></h2> */}
        <ProgressGraph />
        {(!emailofdiffuser) ? (<ProfileSettings />) : ''}
        {/* Footer */}
      <div className="w-full py-4 bg-gradient-to-t from-blue-900/70 to-transparent mt-8 md:mt-16 flex items-center justify-center">
        <p className="text-gray-400 text-xs md:text-sm">
          © {new Date().getFullYear()} Knightmare Chess - All rights reserved
        </p>
      </div>
      </div>
      
    </>
  );
};

export default Profile;