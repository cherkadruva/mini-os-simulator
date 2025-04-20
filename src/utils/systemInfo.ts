
import { SystemInfo } from '../types';

// Initial system information
let systemInfo: SystemInfo = {
  cpuUsage: 5.2,
  memoryUsage: 28.4,
  diskUsage: 15.7,
  uptime: 0
};

// Boot time (when the system started)
const bootTime = Date.now();

// Update system information
export const updateSystemInfo = (): void => {
  // Update uptime (seconds since boot)
  systemInfo.uptime = Math.floor((Date.now() - bootTime) / 1000);
  
  // Randomize system usage metrics slightly to simulate real-time changes
  systemInfo.cpuUsage = Math.min(100, Math.max(2, systemInfo.cpuUsage + (Math.random() * 6 - 3)));
  systemInfo.memoryUsage = Math.min(100, Math.max(10, systemInfo.memoryUsage + (Math.random() * 2 - 1)));
  systemInfo.diskUsage = Math.min(100, Math.max(10, systemInfo.diskUsage + (Math.random() * 0.2 - 0.1)));
};

// Get current system information
export const getSystemInfo = (): SystemInfo => {
  return { ...systemInfo };
};

// Format uptime for display
export const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// Initialize system monitoring
export const initSystemMonitoring = (): void => {
  // Update system information every second
  setInterval(updateSystemInfo, 1000);
};
