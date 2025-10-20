import React from 'react';

const ProgressBar = ({ current, projected, totalProjected}) => {
  const percentCurrent = (current / totalProjected) * 100;
  const percentProjected = (projected / totalProjected) * 100;

  return (
    <div className="bg-white p-5 rounded-md w-full flex flex-col gap-3">
      {/* Progress Bar */}
      <div className="relative bg-gray-200 h-[120px] rounded-md overflow-hidden">
        {/* Projected marker */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-green-500"
          style={{ width: `${percentProjected}%` }}
        />
        
        {/* Current progress fill */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-[#d9ed92]"
          style={{ width: `${percentCurrent}%` }}
        />
      </div>

      {/* Labels below the bar */}
      <div className="relative h-6 w-full text-gray-600 text-sm">
        {/* 0 */}
        <span
          className="absolute"
          style={{ left: '0%', transform: 'translateX(-50%)' }}
        >
          0
        </span>

        {/* Current */}
        <span
          className="absolute"
          style={{ left: `${percentCurrent}%`, transform: 'translateX(-50%)' }}
        >
          {current}
        </span>

        {/* Projected */}
        <span
          className="absolute"
          style={{ left: `${percentProjected}%`, transform: 'translateX(-50%)' }}
        >
          {projected}
        </span>

        {/* Total */}
        <span
          className="absolute"
          style={{ left: '100%', transform: 'translateX(-50%)' }}
        >
          {totalProjected}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
