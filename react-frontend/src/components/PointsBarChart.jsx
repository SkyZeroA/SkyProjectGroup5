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

// Custom hook to track window width
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

const PointsBarChart = ({ isFormOpen }) => {
  const windowWidth = useWindowWidth(); // 👈 Track screen width
  const currentDate = new Date();

  const apiUrl = process.env.REACT_APP_API_URL;


  // Dynamically adjust chart appearance
  const chartHeight = windowWidth < 640 ? 125 : windowWidth < 1024 ? 290 : 290;
  const xTickFontSize = windowWidth < 640 ? 10 : 12;
  const yTickFontSize = windowWidth < 640 ? 10 : 12;
  const legendFontSize = windowWidth < 640 ? 10 : 12;
  const barSize = windowWidth < 640 ? 20 : 30;
  const navChartSpacing = windowWidth < 640 ? 0 : 10;


  // --- Your existing date helpers, state, and fetchData logic remain unchanged ---
  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.floor(days / 7) + 1;
  };

  const getWeekDateRange = (weekNumber, year) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const firstMondayOffset = dayOfWeek === 0 ? 1 : 7 - dayOfWeek + 1;
    const firstMonday = new Date(
      firstDayOfYear.setDate(firstDayOfYear.getDate() + firstMondayOffset)
    );

    const startDate = new Date(firstMonday);
    startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    };

    return `${formatDate(startDate)}-${formatDate(endDate)}`;
  };

  const getMonthName = (monthIndex) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
  };

  const currentWeek = getWeekNumber(currentDate);
  const currentWeekChunk = Math.floor((currentWeek - 1) / 6);
  const currentMonth = currentDate.getMonth();
  const currentMonthChunk = currentMonth < 6 ? 0 : 1;

  const [isWeek, setIsWeek] = useState(false);
  const [year] = useState(currentDate.getFullYear());
  const [monthChunk, setMonthChunk] = useState(currentMonthChunk);
  const [weekChunk, setWeekChunk] = useState(currentWeekChunk);
  const [data, setData] = useState([]);

  const startWeek = weekChunk * 6 + 1;
  const endWeek = Math.min((weekChunk + 1) * 6, 52);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user-points`, {
        params: { period: isWeek ? "week" : "month", year, monthChunk, weekChunk },
        withCredentials: true,
      });

      const formattedData = response.data.map((item, index) =>
        isWeek
          ? { ...item, label: getWeekDateRange(startWeek + index, year) }
          : { ...item, label: getMonthName(monthChunk * 6 + index) }
      );

      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch points data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isWeek, year, monthChunk, weekChunk, isFormOpen]);

  // --- Render ---
  return (
    <div className="w-full">
      <h2 className="[font-family:'Sky_Text',Helvetica] text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2">
        Points Bar Chart
      </h2>

      <div className="flex justify-center items-center mb-2 space-x-2">
      <span className={isWeek ? "[font-family:'Sky_Text',Helvetica] font-semibold text-gray-900 sm:text-md text-sm" : "[font-family:'Sky_Text',Helvetica] text-gray-500 sm:text-md text-sm"}>
        Weekly
      </span>
      <button
        onClick={() => setIsWeek(!isWeek)}
        className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${
          isWeek ? "justify-start" : "justify-end"
        }`}
      >
      <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
      </button>
      <span className={!isWeek ? "[font-family:'Sky_Text',Helvetica] font-semibold text-gray-900 sm:text-md text-sm" : "[font-family:'Sky_Text',Helvetica] text-gray-500 sm:text-md text-sm"}>
        Monthly
      </span>
    </div>

    {/* Navigation */}
    <div className="flex justify-between items-center mb-1 px-2">
      <button
        onClick={isWeek ? () => setWeekChunk((p) => Math.max(p - 1, 0)) : () => setMonthChunk((p) => Math.max(p - 1, 0))}
        disabled={isWeek ? weekChunk === 0 : monthChunk === 0}
        className="px-2 py-0.5 text-gray-600 hover:text-gray-900 disabled:opacity-40 text-sm"
      >
        ◀
      </button>

      <div className="text-xs font-medium text-gray-500 text-center">
        {year} {isWeek ? `(Weeks ${startWeek}-${endWeek})` : ""}
      </div>

      <button
        onClick={isWeek ? () => setWeekChunk((p) => Math.min(p + 1, currentWeekChunk)) : () => setMonthChunk((p) => Math.min(p + 1, currentMonthChunk))}
        disabled={isWeek ? weekChunk === currentWeekChunk : monthChunk === currentMonthChunk}
        className="px-2 py-0.5 text-gray-600 hover:text-gray-900 disabled:opacity-40 text-sm"
      >
        ▶
      </button>
    </div>

      {/* Responsive Bar Chart */}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          margin={{ top: navChartSpacing, right: 20, left: 10, bottom: navChartSpacing }}
          barSize={barSize}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: xTickFontSize }} />
          <YAxis
            label={{
              value: "Points",
              angle: -90,
              position: "insideLeft",
              fontSize: yTickFontSize,
            }}
            tick={{ fontSize: yTickFontSize }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: legendFontSize }} />
          <Bar dataKey="userPoints" fill="#8884d8" name="User Points" />
          <Bar dataKey="averagePoints" fill="#82ca9d" name="Average Points" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PointsBarChart;
