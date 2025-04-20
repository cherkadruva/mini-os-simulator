
import React, { useEffect } from 'react';
import Terminal from './Terminal';
import StatusBar from './StatusBar';
import { initProcessManager } from '../utils/processManager';
import { initFileSystem } from '../utils/fileSystem';
import { initSystemMonitoring } from '../utils/systemInfo';

// Main MiniOS component
const MiniOS: React.FC = () => {
  // Initialize OS subsystems
  useEffect(() => {
    initProcessManager();
    initFileSystem();
    initSystemMonitoring();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground font-mono relative">
      {/* Scanlines effect */}
      <div className="scanlines" />
      
      {/* Terminal interface */}
      <div className="flex-1 overflow-hidden">
        <Terminal />
      </div>
      
      {/* Status bar */}
      <StatusBar />
    </div>
  );
};

export default MiniOS;
