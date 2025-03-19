import React, { useState } from "react";
import SelectTimeFormat from "./SelectTimeFormat";
import SelectLevel from "./SelectLevel";
import PlayWith from "./PlayWith";

function GameSetup({ onStartGame }) {
  const [timeFormat, setTimeFormat] = useState(300); // Default: 5+0
  const [level, setLevel] = useState(0); // Default: Level 0 (Easiest)
  const [side, setSide] = useState("white"); // Default: White

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the selected values to the parent component
    const settings = {
      level,          // AI difficulty level
      timeFormat,     // Game time control
      side,           // User's side (white or black)
  };

  // Pass settings to the parent component (Play)
  onStartGame(settings);
  };

  return (
    <div    > 
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mt-10 space-y-4 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-3xl  font-bold  text-white mb-4">Game Setup</h2>

      {/* Time Format Selector */}
      <div className="flex flex-col space-y-2">
        <label className="text-white">Select Time Format:</label>
        <SelectTimeFormat onSelect={setTimeFormat} />
      </div>

      {/* Level Selector */}
      <div className="flex flex-col space-y-2">
        <label className="text-white">Select Level:</label>
        <SelectLevel onSelect={setLevel} />
      </div>

      {/* Play With Selector */}
      <div className="flex flex-col space-y-2">
        <label className="text-white">Play As:</label>
        <PlayWith onSelect={setSide} />
      </div>

      {/* Start Button */}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Game
      </button>
    </form>
    </div>
  );
}

export default GameSetup;