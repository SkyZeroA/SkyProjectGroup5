import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const PointsBarChart = ({ isFormOpen }) => {
  const currentDate = new Date();

  // Helper: get week number (week 1 starts Jan 1)
  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.floor(days / 7) + 1;
  };

  // Helper: get the start and end date of a given week
  const getWeekDateRange = (weekNumber, year) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const firstMondayOffset = (dayOfWeek === 0 ? 1 : 7 - dayOfWeek + 1);
    const firstMonday = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + firstMondayOffset));
    
    const startDate = new Date(firstMonday);
    startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    };

    return `${formatDate(startDate)}-${formatDate(endDate)}`;
  };

  // Helper: get month name (for monthly view)
  const getMonthName = (monthIndex) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
  };

  const currentWeek = getWeekNumber(currentDate);
  const currentWeekChunk = Math.floor((currentWeek - 1) / 6);
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentMonthChunk = currentMonth < 6 ? 0 : 1;

  const [isWeek, setIsWeek] = useState(false);
  const [year] = useState(currentDate.getFullYear());
  const [monthChunk, setMonthChunk] = useState(currentMonthChunk);
  const [weekChunk, setWeekChunk] = useState(currentWeekChunk);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9099/api/user-points", {
        params: {
          period: isWeek ? "week" : "month",
          year,
          monthChunk,
          weekChunk
        },
        withCredentials: true
      });

      const formattedData = response.data.map((item, index) => {
        if (isWeek) {
          // For weekly view, format week range
          return {
            ...item,
            label: getWeekDateRange(startWeek + index, year)
          };
        } else {
          // For monthly view, show month names
          return {
            ...item,
            label: getMonthName(monthChunk * 6 + index)
          };
        }
      });
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch points data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isWeek, year, monthChunk, weekChunk, isFormOpen]);

  const handlePrevMonthChunk = () => setMonthChunk((prev) => Math.max(prev - 1, 0));
  const handleNextMonthChunk = () => setMonthChunk((prev) => Math.min(prev + 1, currentMonthChunk));
  const handlePrevWeekChunk = () => setWeekChunk((prev) => Math.max(prev - 1, 0));
  const handleNextWeekChunk = () => setWeekChunk((prev) => Math.min(prev + 1, currentWeekChunk));

  const startWeek = weekChunk * 6 + 1;
  const endWeek = Math.min((weekChunk + 1) * 6, 52);

  return (
    <div className="w-full">
      <h2 className="[font-family:'Sky_Text',Helvetica] text-2xl font-bold text-center text-gray-900 mb-2">
        Points Bar Chart
      </h2>

      {/* Week/Month Toggle */}
      <div className="flex justify-center items-center mb-4 space-x-4">
        <span className={isWeek ? "font-semibold text-gray-900" : "text-gray-500"}>
          Weekly
        </span>

        <button
          onClick={() => setIsWeek(!isWeek)}
          className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${
            isWeek ? "justify-start" : "justify-end"
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
        </button>

        <span className={!isWeek ? "font-semibold text-gray-900" : "text-gray-500"}>
          Monthly
        </span>
      </div>

      {/* Year / Month / Week Controls */}
      <div className="flex justify-between items-center mb-2 px-4">
        {isWeek ? (
          <button
            onClick={handlePrevWeekChunk}
            disabled={weekChunk === 0}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
          >
            ◀
          </button>
        ) : (
          <button
            onClick={handlePrevMonthChunk}
            disabled={monthChunk === 0}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
          >
            ◀
          </button>
        )}

        <div className="text-sm font-medium text-gray-500 text-center">
          {year} {isWeek ? `(Weeks ${startWeek}-${endWeek})` : ""}
        </div>

        {isWeek ? (
          <button
            onClick={handleNextWeekChunk}
            disabled={weekChunk === currentWeekChunk}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
          >
            ▶
          </button>
        ) : (
          <button
            onClick={handleNextMonthChunk}
            disabled={monthChunk === currentMonthChunk}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
          >
            ▶
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis label={{ value: "Points", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="userPoints" fill="#8884d8" name="User Points" />
          <Bar dataKey="averagePoints" fill="#82ca9d" name="Average Points" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PointsBarChart;
