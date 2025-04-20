
export interface Process {
  pid: number;
  name: string;
  state: 'running' | 'ready' | 'blocked' | 'terminated';
  priority: number;
  memoryUsage: number;
  cpuUsage: number;
  startTime: number;
}

export interface FileSystemEntry {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  content?: string;
  children?: FileSystemEntry[];
  created: number;
  modified: number;
  permissions: string;
}

export interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
}
