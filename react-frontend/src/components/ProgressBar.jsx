import React, { useEffect, useState } from 'react';

const ProgressBar = ({ current, projected }) => {
  const percentCurrent = Math.min((current / projected) * 100, 100);
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [animatedGreen, setAnimatedGreen] = useState(0);
  const [animatedRightLabel, setAnimatedRightLabel] = useState(0);

  useEffect(() => {
    // Animate background (green)
    const timer1 = setTimeout(() => {
      setAnimatedGreen(100);
    }, 200);

    // Animate dark bar (current progress)
    const timer2 = setTimeout(() => {
      setAnimatedCurrent(percentCurrent);
    }, 400);

    // Animate projected label sliding to the end
    const timer3 = setTimeout(() => {
      setAnimatedRightLabel(100);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [percentCurrent]);

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
      <div className="relative h-6 w-full text-gray-600 text-sm">
        {/* 0 label */}
        <span
          className="absolute"
          style={{ left: '0%', transform: 'translateX(-50%)' }}
        >
          0
        </span>

        {/* Current label (moves with dark bar) */}
        <span
          className="absolute transition-all duration-[1300ms] ease-in-out"
          style={{ left: `${animatedCurrent}%`, transform: 'translateX(-50%)' }}
        >
          {current}
        </span>

        {/* Projected label (slides to the end) */}
        <span
          className="absolute transition-all duration-[2000ms] ease-in-out"
          style={{
            left: `${animatedRightLabel}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {projected}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
