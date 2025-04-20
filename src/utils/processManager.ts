
import { Process } from '../types';

// Initial process list
const initialProcesses: Process[] = [
  { 
    pid: 1, 
    name: 'init', 
    state: 'running', 
    priority: 0, 
    memoryUsage: 1024, 
    cpuUsage: 0.5,
    startTime: Date.now() - 120000
  },
  { 
    pid: 2, 
    name: 'kernel', 
    state: 'running', 
    priority: 0, 
    memoryUsage: 4096, 
    cpuUsage: 1.2,
    startTime: Date.now() - 120000
  },
  { 
    pid: 3, 
    name: 'systemd', 
    state: 'running', 
    priority: 1, 
    memoryUsage: 2048, 
    cpuUsage: 0.3,
    startTime: Date.now() - 115000
  }
];

let processes = [...initialProcesses];
let nextPid = 4;

// Process scheduling algorithms
const scheduleRoundRobin = () => {
  // Simulate round-robin scheduling by rotating the "running" processes
  const runningProcesses = processes.filter(p => p.state === 'running');
  const otherProcesses = processes.filter(p => p.state !== 'running');
  
  if (runningProcesses.length > 1) {
    // Move the first running process to the end
    const first = runningProcesses.shift();
    if (first) {
      runningProcesses.push(first);
    }
  }
  
  return [...runningProcesses, ...otherProcesses];
};

const scheduleFIFO = () => {
  // FIFO doesn't reorder processes, it just executes them in order of arrival
  return [...processes];
};

// Process management functions
export const getProcesses = (): Process[] => {
  return processes;
};

export const createProcess = (name: string, priority: number = 5): Process => {
  const newProcess: Process = {
    pid: nextPid++,
    name,
    state: 'ready',
    priority,
    memoryUsage: Math.floor(Math.random() * 1024) + 512,
    cpuUsage: Math.random() * 5,
    startTime: Date.now()
  };
  
  processes = [...processes, newProcess];
  return newProcess;
};

export const killProcess = (pid: number): boolean => {
  const processIndex = processes.findIndex(p => p.pid === pid);
  if (processIndex >= 0) {
    // Don't kill init or kernel
    if (pid === 1 || pid === 2) {
      return false;
    }
    
    processes = processes.filter(p => p.pid !== pid);
    return true;
  }
  return false;
};

export const suspendProcess = (pid: number): boolean => {
  const process = processes.find(p => p.pid === pid);
  if (process && process.state === 'running') {
    process.state = 'blocked';
    return true;
  }
  return false;
};

export const resumeProcess = (pid: number): boolean => {
  const process = processes.find(p => p.pid === pid);
  if (process && process.state === 'blocked') {
    process.state = 'ready';
    return true;
  }
  return false;
};

export const runProcess = (pid: number): boolean => {
  const process = processes.find(p => p.pid === pid);
  if (process && process.state === 'ready') {
    process.state = 'running';
    return true;
  }
  return false;
};

export const updateProcesses = (): void => {
  // Update process states based on scheduling
  processes = scheduleRoundRobin();
  
  // Update CPU usage randomly for running processes
  processes.forEach(process => {
    if (process.state === 'running') {
      process.cpuUsage = Math.min(100, Math.max(0.1, process.cpuUsage + (Math.random() * 2 - 1)));
    } else {
      process.cpuUsage = Math.max(0, process.cpuUsage * 0.9);
    }
  });
};

// System calls simulation
export const fork = (parentPid: number): number | null => {
  const parent = processes.find(p => p.pid === parentPid);
  if (!parent) return null;
  
  const child = createProcess(`${parent.name}-fork`);
  child.state = parent.state;
  child.priority = parent.priority;
  child.memoryUsage = parent.memoryUsage * 0.8;
  
  return child.pid;
};

export const exec = (pid: number, programName: string): boolean => {
  const process = processes.find(p => p.pid === pid);
  if (!process) return false;
  
  process.name = programName;
  process.state = 'ready';
  
  return true;
};

// Initialize the process manager
export const initProcessManager = (): void => {
  // Start with initial processes
  processes = [...initialProcesses];
  nextPid = processes.length + 1;
  
  // Update processes every second to simulate activity
  setInterval(updateProcesses, 1000);
};
