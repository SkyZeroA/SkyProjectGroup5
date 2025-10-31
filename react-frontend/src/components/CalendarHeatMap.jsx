import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import 'react-calendar-heatmap/dist/styles.css';
import { Card, CardContent } from "../components/Card";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

const UserActivityHeatmap = ({ isFormOpen }) => {
  const [activityData, setActivityData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const today = new Date();
  const MIN_DATE = new Date(2025, 0, 1);

  const fetchActivity = useCallback(async () => {
  try {
    const allDates = getMonthDates(currentMonth);
    const startDate = allDates[0];
    const endDate = allDates[allDates.length - 1];

    const response = await axios.get(
      "http://localhost:9099/api/calendar-activity-counts",
      {
        params: { startDate, endDate },
        withCredentials: true,
      }
    );

    // Map counts object to array
    const counts = response.data.counts || {};
    const merged = allDates.map((date, index) => ({
      date,
      count: counts[date] || 0,
      isFirstDay: index === 0,
      isLastDay: index === allDates.length - 1,
    }));

    setActivityData(merged);
  } catch (error) {
    console.error("Failed to fetch activity data:", error);
  }
}, [currentMonth, isFormOpen]);

  useEffect(() => {
  if (!isFormOpen) fetchActivity();
}, [isFormOpen, fetchActivity]);

useEffect(() => {
  fetchActivity(); // for month changes
}, [currentMonth, fetchActivity]);

  const handlePrev = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      if (d < MIN_DATE) return prev;
      return d;
    });
  };

  const handleNext = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      const nextMonth =
        d.getFullYear() > today.getFullYear() ||
        (d.getFullYear() === today.getFullYear() && d.getMonth() > today.getMonth());
      if (nextMonth) return prev;
      return d;
    });
  };

  const isPrevDisabled = new Date(currentMonth) <= MIN_DATE;
  const isNextDisabled =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

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
            Monthly Activity
            <div className="text-sm font-medium text-gray-500 mt-1">
              {currentMonth.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
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

        {/* Heatmap */}
        <div className="w-full flex justify-center">
        <div className="w-[500px] [&_.react-calendar-heatmap-month-label]:hidden transform translate-x-12">
            <CalendarHeatmap
            startDate={new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)}
            endDate={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)}
            values={activityData}
            classForValue={(value) => {
                if (!value || value.count === 0) return "color-empty";
                const level = Math.min(4, value.count);
                let classes = `color-github-${level}`;
                if (value.isFirstDay) classes += " first-day";
                if (value.isLastDay) classes += " last-day";
                return classes;
            }}
            tooltipDataAttrs={(value) => ({
                "data-tip": value.date
                ? `${value.date}: ${value.count} activities`
                : "No data",
            })}
            showWeekdayLabels={false}
            horizontal={false}
            />
        </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityHeatmap;
