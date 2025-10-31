import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

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

const UserRankChart = ({ isWeekly, isFormOpen }) => {
  const [dailyRanks, setDailyRanks] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const today = new Date();

  const MIN_DATE = new Date(2025, 0, 1);

  const fetchDailyRanks = useCallback(async () => {
    try {
      const allDates = isWeekly
        ? getWeekDates(currentWeekStart)
        : getMonthDates(currentMonth);
        
      const apiUrl = process.env.REACT_APP_API_URL;
      const startDate = allDates[0];
      const endDate = allDates[allDates.length - 1];

      const response = await axios.get(`${apiUrl}/api/daily-rank`, {
        params: {
          period: isWeekly ? "week" : "month",
          startDate,
          endDate
        },
        withCredentials: true
      });

      const ranks = response.data.ranks || [];

      const merged = allDates.map((date) => {
        const found = ranks.find((r) => r.date === date);
        return { date, rank: found ? found.rank : null };
      });

      setDailyRanks(merged);
    } catch (error) {
      console.error("Failed to fetch daily ranks:", error);
    }
  }, [currentWeekStart, currentMonth, isWeekly]);

  useEffect(() => {
    fetchDailyRanks();
  }, [isWeekly, isFormOpen, currentWeekStart, currentMonth, fetchDailyRanks]);

  const handlePrev = () => {
    if (isWeekly) {
      setCurrentWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 7);
        if (d < getMonday(MIN_DATE)) return prev;
        return d;
      });
    } else {
      setCurrentMonth((prev) => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() - 1);
        if (d < new Date(MIN_DATE.getFullYear(), MIN_DATE.getMonth(), 1)) return prev;
        return d;
      });
    }
  };

  const handleNext = () => {
    if (isWeekly) {
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
    if (isWeekly) {
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
    if (isWeekly) {
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
    if (isWeekly) {
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
    <Card className="flex-1 min-w-0 bg-white border rounded-lg overflow-auto">
      <CardContent className="p-6 w-full">
        {/* Navigation + Title */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrev}
            disabled={isPrevDisabled}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
          >
            ◀
          </button>

          <h2 className="[font-family:'Sky_Text',Helvetica] text-2xl font-bold text-center text-gray-900">
            {isWeekly ? "Weekly" : "Monthly"} Leaderboard Position
            <div className="text-sm font-medium text-gray-500 mt-1">
              {formatPeriodLabel()}
            </div>
          </h2>

          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
          >
            ▶
          </button>
        </div>

        <ResponsiveContainer width="100%" height={290}>
          <LineChart
            data={dailyRanks}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              interval={isWeekly ? 0 : 5}
              tickFormatter={(dateStr) => {
                const date = new Date(dateStr);
                return isWeekly
                  ? date.toLocaleDateString(undefined, { weekday: "short" })
                  : date.getDate();
              }}
            />
            <YAxis
              label={{
                value: "Rank",
                angle: -90,
                position: "insideLeft"
              }}
              allowDecimals={false}
              domain={[
                1,
                Math.max(
                  5,
                  Math.ceil(Math.max(...dailyRanks.map((r) => r.rank || 0)) / 5) *
                    5
                )
              ]}
              reversed={true}
              interval={0}
            />
            <Tooltip
              labelFormatter={(dateStr) => {
                const date = new Date(dateStr);
                return date.toLocaleDateString(undefined, {
                  weekday: isWeekly ? "long" : undefined,
                  month: "short",
                  day: "numeric"
                });
              }}
            />
            <Line
              type="linear"
              dataKey="rank"
              stroke="#4CAF50"
              connectNulls={false}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserRankChart;
