import React, { useEffect, useState } from 'react';

const ProgressBar = ({ current, projected }) => {
  const percentCurrent = Math.min((current / projected) * 100, 100);

  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [animatedGreen, setAnimatedGreen] = useState(0);
  const [animatedRightLabel, setAnimatedRightLabel] = useState(0);

  useEffect(() => {
    // Animate everything at once
    const timer = setTimeout(() => {
      setAnimatedCurrent(percentCurrent);
      setAnimatedGreen(100);
      setAnimatedRightLabel(100);
    }, 100); // small delay to trigger CSS transitions

    return () => clearTimeout(timer);
  }, [percentCurrent]);

  const diff = Math.abs(animatedRightLabel - animatedCurrent);
  const isClose = diff < 5;

  return (
    <div className="bg-white p-5 rounded-md w-full flex flex-col gap-3">
      {/* Progress Bar */}
      <div className="relative h-[120px] rounded-md overflow-hidden">
        {/* Green bar (background) */}
        <div
          data-testid="progress-bar-background"
          className="absolute top-0 left-0 h-full bg-[var(--progress-bar-color)] transition-all duration-[1300ms] ease-in-out"
          style={{ width: `${animatedGreen}%` }}
        ></div>

        {/* Grey bar (current) */}
        <div
          data-testid="progress-bar-current"
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
            top: isClose ? '-10px' : '0px',
          }}
        >
          {current}
        </span>

        {/* Projected label */}
        <span
          className="absolute transition-all duration-[1300ms] ease-in-out"
          style={{
            left: `${animatedRightLabel}%`,
            transform: 'translateX(-50%)',
            top: isClose ? '10px' : '0px',
          }}
        >
          {projected}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
