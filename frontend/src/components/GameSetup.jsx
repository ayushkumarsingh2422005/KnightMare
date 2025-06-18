import React, { useContext, useEffect, useState } from "react";
import SelectTimeFormat from "./SelectTimeFormat";
import SelectLevel from "./SelectLevel";
import PlayWith from "./PlayWith";
import { gamecontext } from "../contexts/gamecontext";
import start from "../assets/gamestart.mp3";


//no backend interaction needed here.

function GameSetup() {


  const playstart = () => {
    const audio = new Audio(start);
    audio
      .play()
      .catch((error) => console.error("Failed to play sound:", error));
  };

  const {
    setSide, timeFormat, setTimeFormat, setLevel, setShowBoard
  } = useContext(gamecontext);
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowBoard(true);
    playstart();
  };

  return (
  
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-gray-800  mt-8 space-y-4  p-6 rounded-lg shadow-lg shadow-black"
      >
        <h2 className="text-3xl  font-bold  text-white mb-4">Game Setup</h2>
        <div className="flex flex-col space-y-2">
          <label className="text-white">Select Time Format:</label>
          <SelectTimeFormat onSelect={setTimeFormat} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-white">Select Level:</label>
          <SelectLevel onSelect={setLevel} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-white">Play As:</label>
          <PlayWith onSelect={setSide} />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Game
        </button>
      </form>
       {/* Footer */}
   
    </div>
    
   
  );
}

export default GameSetup;