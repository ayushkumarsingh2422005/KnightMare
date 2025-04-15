import React, { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { profileContext } from "../contexts/profileContext";

const ProgressGraph = () => {
  const { userProfile } = useContext(profileContext);
  const [profile, setProfile] = useState(userProfile);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    if (!profile?.ratingHistory) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    let startDate, endDate;

    if (selectedYear === currentYear) {
      // For current year: show last 365 days
      const oneYearAgo = new Date(now);
      oneYearAgo.setDate(oneYearAgo.getDate() - 364); // 364 days = 365 days inclusive
      startDate = oneYearAgo;
      endDate = now;
    } else {
      // For past years: show full calendar year
      startDate = new Date(selectedYear, 0, 1); // January 1
      endDate = new Date(selectedYear, 11, 31); // December 31
    }

    const filtered = profile.ratingHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });

    setFilteredData(filtered);
  }, [profile, selectedYear]);

  const getAvailableYears = () => {
    const years = new Set();
    const now = new Date();
    years.add(now.getFullYear());
    
    profile?.ratingHistory?.forEach(entry => {
      const entryYear = new Date(entry.date).getFullYear();
      years.add(entryYear);
    });
    
    return Array.from(years).sort((a, b) => b - a);
  };

  const availableYears = getAvailableYears();
  const minscore = Math.min(...filteredData.map(item => item.score), 0);
  const maxscore = Math.max(...filteredData.map(item => item.score), 0);

  return (
    <div className="mx-4 sm:mx-8 md:mx-14 mt-4 sm:mt-6 my-4 md:mb-6 sm:mb-8">
      {/* Year Selector */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center">
          <label htmlFor="year-select" className="text-gray-300 mr-2 text-sm md:text-base">
            View:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-gray-800 text-white rounded px-2 py-1 text-sm md:text-base border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={new Date().getFullYear()}>Last 365 Days</option>
            {availableYears.filter(year => year !== new Date().getFullYear()).map(year => (
              <option key={year} value={year}>
                {year} (Full Year)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div
        style={{
          backgroundImage: "url('/whitebg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="pt-4 pr-2 rounded-xl"
      >
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={filteredData}
            margin={{ 
              top: 20, 
              right: 10, 
              left: 0, 
              bottom: 5 
            }}
          >
            <XAxis
              dataKey="date"
              stroke="#000"
              strokeWidth={1}
              tick={{ 
                fill: "#000", 
                fontWeight: "bold", 
                fontSize: "10px" 
              }}
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis
              stroke="#000"
              strokeWidth={1}
              tick={{ 
                fill: "#000", 
                fontWeight: "bold", 
                fontSize: "10px" 
              }}
              domain={[minscore > 100 ? minscore - 100 : 0, maxscore + 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#333",
                border: "2px solid #000",
                borderRadius: "5px",
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{
                color: "#000",
                fontWeight: "bold",
                fontSize: "14px",
                paddingTop: "5px",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#000"
              strokeWidth={2}
              dot={{ fill: "#FF6347", r: 3 }}
              activeDot={{ r: 6, stroke: "#FF6347", strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Container */}
      <div className="flex flex-row justify-between text-center bg-gray-900 border border-gray-400 p-2 md:p-2 sm:pl-6 rounded-lg mt-4 sm:mt-6 shadow-[0_4px_6px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_8px_rgba(255,255,255,0.2)] transition-shadow duration-300">
        <div className="flex md:items-center mb-2 sm:mb-0 sm:mr-8">
          <i className="fas fa-trophy text-gray-400 mr-2 text-sm sm:text-base"></i>
          <span className="text-gray-400 mr-2 font-bold text-sm sm:text-base">
            Max score:
          </span>
          <span className="text-white font-bold text-sm sm:text-base">
            {filteredData.length > 0 ? maxscore : "N/A"}
          </span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-trophy text-gray-400 mr-2 text-sm sm:text-base"></i>
          <span className="text-gray-400 mr-2 font-bold text-sm sm:text-base">
            Min score:
          </span>
          <span className="text-white font-bold text-sm sm:text-base">
            {filteredData.length > 0 ? minscore : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressGraph;
