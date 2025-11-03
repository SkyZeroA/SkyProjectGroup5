import React, { useEffect, useState } from 'react';

const ProgressBar = ({ current, projected }) => {
  const percentCurrent = Math.min((current / projected) * 100, 100);
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [animatedGreen, setAnimatedGreen] = useState(0);
  const [animatedRightLabel, setAnimatedRightLabel] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimatedGreen(100), 200);
    const timer2 = setTimeout(() => setAnimatedCurrent(percentCurrent), 400);
    const timer3 = setTimeout(() => setAnimatedRightLabel(100), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [percentCurrent]);

  // 🔹 Detect label overlap
  const diff = Math.abs(animatedRightLabel - animatedCurrent);
  const isClose = diff < 5; // 5% or less apart on the bar

  return (
    <div className="bg-white p-5 rounded-md w-full flex flex-col gap-3">
      {/* Progress Bar */}
      <div className="relative h-[120px] rounded-md overflow-hidden">
        {/* Green fill (background) */}
        <div
          className="absolute top-0 left-0 h-full bg-[#4BAD31] transition-all duration-[2000ms] ease-in-out"
          style={{ width: `${animatedGreen}%` }}
        ></div>

        {/* Dark fill (current) */}
        <div
          className="absolute top-0 left-0 h-full bg-[#454955] transition-all duration-[1300ms] ease-in-out"
          style={{ width: `${animatedCurrent}%` }}
        ></div>
      </div>

      {/* Labels */}
      <div className="relative h-6 w-full text-gray-600 text-sm font-medium">
        {/* 0 label */}
        <span
          className="absolute"
          style={{ left: '0%', transform: 'translateX(-50%)' }}
        >
          0
        </span>

        {/* Current label */}
        <span
          className="absolute transition-all duration-[1300ms] ease-in-out"
          style={{
            left: `${animatedCurrent}%`,
            transform: 'translateX(-50%)',
            top: isClose ? '-10px' : '0px', // 🔹 Move up if too close
          }}
        >
          {current}
        </span>

        {/* Projected label */}
        <span
          className="absolute transition-all duration-[2000ms] ease-in-out"
          style={{
            left: `${animatedRightLabel}%`,
            transform: 'translateX(-50%)',
            top: isClose ? '10px' : '0px', // 🔹 Move down if too close
          }}
        >
          {projected}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
