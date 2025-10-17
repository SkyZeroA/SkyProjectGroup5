import React from 'react';

const ProgressBar = ({ current = 200, mid = 91, projected = 203 }) => {
  const pct = (current / projected) * 100;
  const midPct = (mid / projected) * 100;

//  const pct = 0
//  const midPct =0

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 6, width: '65%' }}>
      <h2>Projected Carbon Footprint</h2>
      <p style={{ color: '#666' }}><small>In 2025, you are projected to be responsible for <strong>{projected} Tons</strong> of CO2</small></p>

      <div style={{
        background: '#f3f6f4',
        height: 40,
        borderRadius: 6,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #c8f3cf, #7e8d84ff)'
        }} />
        <div style={{
          position: 'absolute',
          left: `${midPct}%`,
          top: 0,
          bottom: 0,
          width: 6,
          background: '#2f8f3f'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, color: '#666' }}>
        <span>0</span>
        <span>{current}</span>
        <span>{mid}</span>
        <span>{projected}</span>
      </div>

      <p style={{ marginTop: 12, color: '#444' }}>
        Currently, you have produced <strong>{current} Tons</strong> of CO2 so far, which is <strong>{projected - current} Tons Less</strong> than projected for this point in the year!
      </p>
    </div>
  );
};

export default ProgressBar;
