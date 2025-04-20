
import React, { useState, useEffect } from 'react';
import { getSystemInfo, formatUptime } from '../utils/systemInfo';

const StatusBar: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    uptime: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update system info and current time
  useEffect(() => {
    const systemInfoInterval = setInterval(() => {
      setSystemInfo(getSystemInfo());
    }, 1000);
    
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(systemInfoInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="bg-card h-7 border-t border-border px-4 text-xs flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-cyan">CPU:</span>
          <span className="ml-1">{systemInfo.cpuUsage.toFixed(1)}%</span>
        </div>
        <div className="flex items-center">
          <span className="text-cyan">MEM:</span>
          <span className="ml-1">{systemInfo.memoryUsage.toFixed(1)}%</span>
        </div>
        <div className="flex items-center">
          <span className="text-cyan">DISK:</span>
          <span className="ml-1">{systemInfo.diskUsage.toFixed(1)}%</span>
        </div>
        <div className="flex items-center">
          <span className="text-cyan">UP:</span>
          <span className="ml-1">{formatUptime(systemInfo.uptime)}</span>
        </div>
      </div>
      <div className="flex items-center">
        <span>{currentTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default StatusBar;
