import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import 'react-calendar-heatmap/dist/styles.css';

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

const UserActivityHeatmap = ({ isFormOpen, colorblind }) => {
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
    }, [currentMonth]);

  useEffect(() => {
    if (!isFormOpen) {
      fetchActivity();
    }
  }, [currentMonth, isFormOpen, fetchActivity]);

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
  <div className="flex flex-col w-full h-full justify-between items-center overflow-hidden p-4">
    {/* Navigation + Title */}
    <div className="flex justify-between items-center w-full mb-2 shrink-0">
      <button
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
      >
        ◀
      </button>

      <div className="text-center">
        <h2 className="[font-family:'Sky_Text',Helvetica] text-xl font-bold text-gray-900">
          Your Activity
        </h2>
        <div className="text-sm font-medium text-gray-500 mt-1">
          {currentMonth.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
      >
        ▶
      </button>
    </div>

    {/* Heatmap Container */}
    {/* Heatmap */}
    <div className="w-full flex justify-center overflow-y-auto md:overflow-y-visible">
      <div className="w-[250px] md:w-[450px] transform translate-x-12 md:translate-x-20 [&_.react-calendar-heatmap-month-label]:hidden">
        <CalendarHeatmap
          startDate={new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)}
          endDate={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)}
          values={activityData}
          classForValue={(value) => {
            if (!value || value.count === 0) return "color-empty";
            const level = Math.min(4, value.count);
            let classes = `color-github-${level}`;
            if (colorblind) classes = `color-gitlab-${level}`;
            if (value.isFirstDay) classes += " first-day";
            if (value.isLastDay) classes += " last-day";
            return classes;
          }}
          tooltipDataAttrs={(value) => ({
            "data-tip": value.date
              ? `${value.date}: ${value.count} activities`
              : "No data",
          })}
          horizontal={false}
          showWeekdayLabels={true}
        />
      </div>
    </div>
  </div>
);

};

export default UserActivityHeatmap;