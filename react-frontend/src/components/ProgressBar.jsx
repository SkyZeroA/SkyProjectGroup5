import React from 'react';

const ProgressBar = ({ current = 200, mid = 91, projected = 203 }) => {
  const pct = (current / projected) * 100;
  const midPct = (mid / projected) * 100;

  return (
    <div className="bg-white p-5 rounded-md w-2/3">
      <div className="bg-gray-200 h-20 rounded-md relative overflow-hidden">
        <div
          className={`absolute left-0 top-0 bottom-0`}
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #c8f3cf, #7e8d84ff)'
          }}
        />
        <div
          className="absolute top-0 bottom-0 w-1 bg-green-700"
          style={{ left: `${midPct}%` }}
        />
      </div>

      <div className="flex justify-between mt-3 text-gray-600">
        <span>0</span>
        <span>{current}</span>
        <span>{mid}</span>
        <span>{projected}</span>
      </div>

      <p className="mt-3 text-gray-700">
        Currently, you have produced <strong>{current} Tons</strong> of CO2 so far, which is <strong>{projected - current} Tons Less</strong> than projected for this point in the year!
      </p>
    </div>
  );
};

export default ProgressBar;