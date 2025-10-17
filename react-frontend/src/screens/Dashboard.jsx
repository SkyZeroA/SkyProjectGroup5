import React from 'react';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  return (
    <div style={{
      display: 'flex',
      gap: 24,
      padding: 24,
      alignItems: 'flex-start'
    }}>
      <div style={{ flex: 1 }}>
        <ProgressBar />
      </div>
    </div>
  );
};

export default Dashboard;