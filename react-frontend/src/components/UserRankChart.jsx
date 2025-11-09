import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// --- Helper functions ---
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7; 
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekDates = (monday) => {
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(formatDate(d));
  }
  return week;
};

const getMonthDates = (monthStart) => {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthDates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    monthDates.push(formatDate(d));
  }
  return monthDates;
};

// --- Custom hook to track window width ---
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const UserRankChart = ({ isOn, setIsOn, isFormOpen, colourblind }) => {
  const windowWidth = useWindowWidth();

  // --- Dynamic sizing ---
  const chartHeight = windowWidth < 640 ? 125 : windowWidth < 1024 ? 290 : 290;
  const xTickFontSize = windowWidth < 640 ? 10 : 12;
  const yTickFontSize = windowWidth < 640 ? 10 : 12;
  const dotRadius = windowWidth < 640 ? 2 : 4;
  const navChartSpacing = windowWidth < 640 ? 5 : 10;

  const [dailyRanks, setDailyRanks] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const today = new Date();
  const MIN_DATE = new Date(2025, 0, 1);

  // --- Fetch data ---
  useEffect(() => {
    const fetchDailyRanks = async () => {
      try {
        // Get all dates for the current week or month
        const allDates = isOn
          ? getWeekDates(currentWeekStart)
          : getMonthDates(currentMonth);

        const apiUrl = process.env.REACT_APP_API_URL;

        // Get today's date at midnight (for comparison)
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);

        // Define start/end for API query
        const startDate = allDates[0];
        const endDate = allDates[allDates.length - 1];

        // Fetch rank data for the full period
        const response = await axios.get(`${apiUrl}/api/daily-rank`, {
          params: { period: isOn ? "week" : "month", startDate, endDate },
          withCredentials: true
        });

        const ranks = response.data.ranks || [];

        // Merge fetched data with allDates
        const merged = allDates.map((date) => {
          const dateObj = new Date(date);
          const found = ranks.find((r) => r.date === date);

          return {
            date,
            rank: dateObj <= todayMidnight ? (found ? found.rank : null) : null
          };
        });

        setDailyRanks(merged);
      } catch (error) {
        console.error("Failed to fetch daily ranks:", error);
      }
    };

    fetchDailyRanks();
  }, [isOn, isFormOpen, currentWeekStart, currentMonth, /* apiUrl used internally */]);

  // --- Navigation handlers ---
  const handlePrev = () => {
    if (isOn) {
      setCurrentWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 7);
        return d < getMonday(MIN_DATE) ? prev : d;
      });
    } else {
      setCurrentMonth((prev) => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() - 1);
        return d < new Date(MIN_DATE.getFullYear(), MIN_DATE.getMonth(), 1)
          ? prev
          : d;
      });
    }
  };

  const handleNext = () => {
    if (isOn) {
      setCurrentWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 7);
        return d;
      });
    } else {
      setCurrentMonth((prev) => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() + 1);
        return d;
      });
    }
  };

  const isNextDisabled = (() => {
    if (isOn) {
      const nextMonday = new Date(currentWeekStart);
      nextMonday.setDate(nextMonday.getDate() + 7);
      return nextMonday > getMonday(today);
    } else {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return (
        nextMonth.getFullYear() > today.getFullYear() ||
        (nextMonth.getFullYear() === today.getFullYear() &&
          nextMonth.getMonth() > today.getMonth())
      );
    }
  })();

  const isPrevDisabled = (() => {
    if (isOn) {
      const prevMonday = new Date(currentWeekStart);
      prevMonday.setDate(prevMonday.getDate() - 7);
      return prevMonday < getMonday(MIN_DATE);
    } else {
      const prevMonth = new Date(currentMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth < new Date(MIN_DATE.getFullYear(), MIN_DATE.getMonth(), 1);
    }
  })();

  const formatPeriodLabel = () => {
    if (isOn) {
      const end = new Date(currentWeekStart);
      end.setDate(end.getDate() + 6);
      return `${currentWeekStart.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      })} - ${end.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      })}`;
    } else {
      return currentMonth.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric"
      });
    }
  };

  return (
    <div className="w-full">
      <h2 className={`[font-family:'Sky_Text',Helvetica] text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2`}>
        Leaderboard Position
      </h2>

      {/* Toggle */}
      <div className="flex justify-center items-center mb-2 space-x-2">
        <span className={isOn ? "[font-family:'Sky_Text',Helvetica] font-semibold text-gray-900 sm:text-md text-sm" : "[font-family:'Sky_Text',Helvetica] text-gray-500 sm:text-md text-sm"}>
          Weekly
        </span>
        <button
          data-testid="toggle-view"
          onClick={() => setIsOn(!isOn)}
          className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${
            isOn ? "justify-start" : "justify-end"
          }`}
        >
          <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
        </button>
        <span className={!isOn ? "[font-family:'Sky_Text',Helvetica] font-semibold text-gray-900 sm:text-md text-sm" : "[font-family:'Sky_Text',Helvetica] text-gray-500 sm:text-md text-sm"}>
          Monthly
        </span>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-1 px-2">
        <button
          data-testid="prev-button"
          onClick={handlePrev}
          disabled={isPrevDisabled}
          className="px-2 py-0.5 text-gray-600 hover:text-gray-900 disabled:opacity-40 text-sm"
        >
          ◀
        </button>
        <div className="text-xs font-medium text-gray-500 text-center">
          {formatPeriodLabel()}
        </div>
        <button
          data-testid="next-button"
          onClick={handleNext}
          disabled={isNextDisabled}
          className="px-2 py-0.5 text-gray-600 hover:text-gray-900 disabled:opacity-40 text-sm"
        >
          ▶
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={dailyRanks}
          margin={{ top: navChartSpacing, right: 20, left: 10, bottom: navChartSpacing }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            interval={isOn ? 0 : 5}
            tick={{ fontSize: xTickFontSize }}
            tickFormatter={(dateStr) => {
              const date = new Date(dateStr);
              return isOn
                ? date.toLocaleDateString(undefined, { weekday: "short" })
                : date.getDate();
            }}
          />
          <YAxis
            label={{ value: "Rank", angle: -90, position: "insideLeft", fontSize: yTickFontSize }}
            tick={{ fontSize: yTickFontSize }}
            allowDecimals={false}
            domain={[
              1,
              Math.max(
                5,
                Math.ceil(Math.max(...dailyRanks.map((r) => r.rank || 0)) / 5) * 5
              )
            ]}
            reversed={true}
            interval={0}
          />
          <Tooltip
            labelFormatter={(dateStr) => {
              const date = new Date(dateStr);
              return date.toLocaleDateString(undefined, {
                weekday: isOn ? "long" : undefined,
                month: "short",
                day: "numeric"
              });
            }}
          />
          <Line
            type="linear"
            dataKey="rank"
            stroke={colourblind ? "#2b8cbe" : "#4CAF50"}
            connectNulls={false}
            dot={{ r: dotRadius }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserRankChart;
