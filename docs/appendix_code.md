# MiniOS - Appendix: Code

This appendix contains key code snippets from the MiniOS implementation, highlighting the core functionality of each major component.

## 1. File System Implementation

### 1.1 File System Data Structures

```typescript
// File system entry structure
interface FileSystemEntry {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  content?: string;
  children?: FileSystemEntry[];
  created: number;
  modified: number;
  permissions: string;
}

// Root file system structure
const initialFileSystem: FileSystemEntry = {
  name: '/',
  type: 'directory',
  children: [
    {
      name: 'home',
      type: 'directory',
      children: [
        {
          name: 'user',
          type: 'directory',
          children: [
            {
              name: 'readme.txt',
              type: 'file',
              content: 'Welcome to MiniOS!\n\nThis is a simulated mini operating system...',
              size: 1024,
              created: Date.now(),
              modified: Date.now(),
              permissions: 'rwxr--r--'
            }
          ],
          created: Date.now(),
          modified: Date.now(),
          permissions: 'rwxr-xr-x'
        }
      ],
      created: Date.now(),
      modified: Date.now(),
      permissions: 'rwxr-xr-x'
    },
    {
      name: 'etc',
      type: 'directory',
      children: [],
      created: Date.now(),
      modified: Date.now(),
      permissions: 'rwxr-xr-x'
    },
    {
      name: 'bin',
      type: 'directory',
      children: [],
      created: Date.now(),
      modified: Date.now(),
      permissions: 'rwxr-xr-x'
    },
    {
      name: 'var',
      type: 'directory',
      children: [],
      created: Date.now(),
      modified: Date.now(),
      permissions: 'rwxr-xr-x'
    }
  ],
  created: Date.now(),
  modified: Date.now(),
  permissions: 'rwxr-xr-x'
};
```

### 1.2 Path Resolution

```typescript
/**
 * Resolves a path (absolute or relative) to an absolute path
 */
export const resolvePath = (currentPath: string, targetPath: string): string => {
  // Handle absolute paths
  if (targetPath.startsWith('/')) {
    return normalizePath(targetPath);
  }
  
  // Handle relative paths
  let resolvedPath = currentPath;
  
  // Split the path into components
  const components = targetPath.split('/').filter(c => c !== '');
  
  for (const component of components) {
    if (component === '.') {
      // Current directory - do nothing
      continue;
    } else if (component === '..') {
      // Parent directory - go up one level
      resolvedPath = resolvedPath.split('/').slice(0, -1).join('/') || '/';
    } else {
      // Regular directory or file - append to path
      resolvedPath = resolvedPath === '/' ? `/${component}` : `${resolvedPath}/${component}`;
    }
  }
  
  return normalizePath(resolvedPath);
};

/**
 * Normalizes a path by removing redundant slashes and dots
 */
export const normalizePath = (path: string): string => {
  // Replace multiple slashes with a single slash
  path = path.replace(/\/\/+/g, '/');
  
  // Handle . and .. path components
  const components = path.split('/');
  const normalizedComponents: string[] = [];
  
  for (const component of components) {
    if (component === '.' || component === '') {
      continue;
    } else if (component === '..') {
      normalizedComponents.pop();
    } else {
      normalizedComponents.push(component);
    }
  }
  
  // Ensure path starts with /
  let normalizedPath = '/' + normalizedComponents.join('/');
  normalizedPath = normalizedPath === '//' ? '/' : normalizedPath;
  
  return normalizedPath;
};
```

### 1.3 File System Operations

```typescript
/**
 * Finds a file system entry by path
 */
export const findEntry = (
  fs: FileSystemEntry,
  path: string
): { entry: FileSystemEntry; parent: FileSystemEntry | null } | null => {
  // Handle root path
  if (path === '/') {
    return { entry: fs, parent: null };
  }
  
  const pathComponents = path.split('/').filter(p => p !== '');
  let current = fs;
  let parent: FileSystemEntry | null = null;
  
  // Traverse the file system tree
  for (let i = 0; i < pathComponents.length; i++) {
    const component = pathComponents[i];
    parent = current;
    
    // Find the child with the matching name
    const child = current.children?.find(c => c.name === component);
    
    if (!child) {
      return null; // Path component not found
    }
    
    current = child;
  }
  
  return { entry: current, parent };
};

/**
 * Creates a new directory at the specified path
 */
export const createDirectory = (
  fs: FileSystemEntry,
  path: string,
  directoryName: string
): boolean => {
  const parentPath = resolvePath(path, '.');
  const result = findEntry(fs, parentPath);
  
  if (!result || result.entry.type !== 'directory') {
    return false; // Parent path doesn't exist or isn't a directory
  }
  
  // Check if directory already exists
  if (result.entry.children?.some(c => c.name === directoryName)) {
    return false; // Directory already exists
  }
  
  // Create the new directory
  const newDir: FileSystemEntry = {
    name: directoryName,
    type: 'directory',
    children: [],
    created: Date.now(),
    modified: Date.now(),
    permissions: 'rwxr-xr-x'
  };
  
  // Add the new directory to the parent's children
  if (!result.entry.children) {
    result.entry.children = [];
  }
  
  result.entry.children.push(newDir);
  result.entry.modified = Date.now();
  
  return true;
};

/**
 * Creates a new file at the specified path
 */
export const createFile = (
  fs: FileSystemEntry,
  path: string,
  fileName: string,
  content: string = ''
): boolean => {
  const parentPath = resolvePath(path, '.');
  const result = findEntry(fs, parentPath);
  
  if (!result || result.entry.type !== 'directory') {
    return false; // Parent path doesn't exist or isn't a directory
  }
  
  // Check if file already exists
  if (result.entry.children?.some(c => c.name === fileName)) {
    return false; // File already exists
  }
  
  // Create the new file
  const newFile: FileSystemEntry = {
    name: fileName,
    type: 'file',
    content: content,
    size: content.length,
    created: Date.now(),
    modified: Date.now(),
    permissions: 'rw-r--r--'
  };
  
  // Add the new file to the parent's children
  if (!result.entry.children) {
    result.entry.children = [];
  }
  
  result.entry.children.push(newFile);
  result.entry.modified = Date.now();
  
  return true;
};

/**
 * Reads the content of a file
 */
export const readFile = (fs: FileSystemEntry, path: string): string | null => {
  const result = findEntry(fs, path);
  
  if (!result || result.entry.type !== 'file') {
    return null; // File not found or not a file
  }
  
  return result.entry.content || '';
};

/**
 * Writes content to a file, optionally appending
 */
export const writeFile = (
  fs: FileSystemEntry,
  path: string,
  content: string,
  append: boolean = false
): boolean => {
  const result = findEntry(fs, path);
  
  if (!result || result.entry.type !== 'file') {
    return false; // File not found or not a file
  }
  
  // Write or append to the file content
  result.entry.content = append ? (result.entry.content || '') + content : content;
  result.entry.size = result.entry.content.length;
  result.entry.modified = Date.now();
  
  return true;
};

/**
 * Deletes a file or directory
 */
export const deleteEntry = (fs: FileSystemEntry, path: string): boolean => {
  const result = findEntry(fs, path);
  
  if (!result || path === '/') {
    return false; // Entry not found or cannot delete root directory
  }
  
  if (!result.parent || !result.parent.children) {
    return false; // Parent not found or has no children
  }
  
  // Remove the entry from the parent's children
  result.parent.children = result.parent.children.filter(c => c.name !== result.entry.name);
  result.parent.modified = Date.now();
  
  return true;
};

/**
 * Changes the current directory
 */
export const changeDirectory = (fs: FileSystemEntry, path: string, newPath: string): string | null => {
  const targetPath = resolvePath(path, newPath);
  const result = findEntry(fs, targetPath);
  
  if (!result || result.entry.type !== 'directory') {
    return null; // Directory not found or not a directory
  }
  
  return targetPath;
};

/**
 * Lists the contents of a directory
 */
export const listDirectory = (fs: FileSystemEntry, path: string): FileSystemEntry[] | null => {
  const result = findEntry(fs, path);
  
  if (!result || result.entry.type !== 'directory') {
    return null; // Directory not found or not a directory
  }
  
  return result.entry.children || [];
};
```

### 1.4 File System Persistence

```typescript
/**
 * Saves the file system state to localStorage
 */
export const saveFileSystem = (fs: FileSystemEntry): void => {
  try {
    localStorage.setItem('minios-filesystem', JSON.stringify(fs));
  } catch (error) {
    console.error('Error saving file system:', error);
  }
};

/**
 * Loads the file system state from localStorage
 */
export const loadFileSystem = (): FileSystemEntry => {
  try {
    const stored = localStorage.getItem('minios-filesystem');
    
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading file system:', error);
  }
  
  return initialFileSystem;
};

/**
 * Resets the file system to its initial state
 */
export const resetFileSystem = (): FileSystemEntry => {
  localStorage.removeItem('minios-filesystem');
  return initialFileSystem;
};
```

## 2. Process Management

### 2.1 Process Data Structures

```typescript
// Process structure
interface Process {
  pid: number;
  name: string;
  state: 'running' | 'ready' | 'blocked' | 'terminated';
  priority: number;
  memoryUsage: number;
  cpuUsage: number;
  startTime: number;
}

// Initial system processes
const initialProcesses: Process[] = [
  {
    pid: 1,
    name: 'init',
    state: 'running',
    priority: 0,
    memoryUsage: 1024,
    cpuUsage: 0.5,
    startTime: Date.now()
  },
  {
    pid: 2,
    name: 'kernel',
    state: 'running',
    priority: 0,
    memoryUsage: 4096,
    cpuUsage: 1.2,
    startTime: Date.now()
  },
  {
    pid: 3,
    name: 'systemd',
    state: 'running',
    priority: 1,
    memoryUsage: 2048,
    cpuUsage: 0.3,
    startTime: Date.now()
  },
  // Other system processes...
];
```

### 2.2 Process Management Operations

```typescript
let nextPid = 10; // Starting PID for user processes
let processes = [...initialProcesses];

/**
 * Gets all current processes
 */
export const getProcesses = (): Process[] => {
  return [...processes];
};

/**
 * Creates a new process
 */
export const createProcess = (name: string, priority: number = 5): Process => {
  const newProcess: Process = {
    pid: nextPid++,
    name,
    state: 'ready',
    priority,
    memoryUsage: Math.floor(Math.random() * 1000) + 500,
    cpuUsage: Math.random() * 2,
    startTime: Date.now()
  };
  
  processes.push(newProcess);
  return newProcess;
};

/**
 * Terminates a process by PID
 */
export const killProcess = (pid: number): boolean => {
  // Can't kill system processes (PID < 10)
  if (pid < 10) {
    return false;
  }
  
  const index = processes.findIndex(p => p.pid === pid);
  if (index === -1) {
    return false;
  }
  
  // Remove the process
  processes.splice(index, 1);
  return true;
};

/**
 * Suspends a process by PID
 */
export const suspendProcess = (pid: number): boolean => {
  const process = processes.find(p => p.pid === pid);
  if (!process || process.state !== 'running') {
    return false;
  }
  
  process.state = 'blocked';
  return true;
};

/**
 * Resumes a process by PID
 */
export const resumeProcess = (pid: number): boolean => {
  const process = processes.find(p => p.pid === pid);
  if (!process || process.state !== 'blocked') {
    return false;
  }
  
  process.state = 'ready';
  return true;
};

/**
 * Runs a process by PID (simulated)
 */
export const runProcess = (pid: number): boolean => {
  const process = processes.find(p => p.pid === pid);
  if (!process || process.state !== 'ready') {
    return false;
  }
  
  process.state = 'running';
  return true;
};

/**
 * Forks a process (creates a child process)
 */
export const fork = (parentPid: number): number | null => {
  const parentProcess = processes.find(p => p.pid === parentPid);
  if (!parentProcess) {
    return null;
  }
  
  const newProcess: Process = {
    pid: nextPid++,
    name: `${parentProcess.name}-child`,
    state: 'ready',
    priority: parentProcess.priority,
    memoryUsage: parentProcess.memoryUsage,
    cpuUsage: 0.1,
    startTime: Date.now()
  };
  
  processes.push(newProcess);
  return newProcess.pid;
};

/**
 * Executes a new program in a process (simulated)
 */
export const exec = (pid: number, programName: string): boolean => {
  const process = processes.find(p => p.pid === pid);
  if (!process) {
    return false;
  }
  
  process.name = programName;
  return true;
};

/**
 * Updates process states based on scheduling algorithm
 */
export const updateProcesses = (): void => {
  // Simulate process behavior
  processes = processes.map(process => {
    // Skip terminated processes
    if (process.state === 'terminated') {
      return process;
    }
    
    // Randomly update CPU usage
    const cpuDelta = (Math.random() - 0.5) * 0.3;
    let newCpuUsage = process.cpuUsage + cpuDelta;
    newCpuUsage = Math.max(0.1, Math.min(newCpuUsage, 10));
    
    // Randomly update memory usage
    const memDelta = Math.floor((Math.random() - 0.5) * 200);
    let newMemoryUsage = process.memoryUsage + memDelta;
    newMemoryUsage = Math.max(100, newMemoryUsage);
    
    return {
      ...process,
      cpuUsage: newCpuUsage,
      memoryUsage: newMemoryUsage
    };
  });
};
```

## 3. System Monitoring

### 3.1 System Information Data Structure

```typescript
interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
  systemVersion: string;
  kernelVersion: string;
}

// Initial system information
const initialSystemInfo: SystemInfo = {
  cpuUsage: 5.2,
  memoryUsage: 28.4,
  diskUsage: 15.7,
  uptime: 0,
  systemVersion: 'MiniOS v1.0.0',
  kernelVersion: '1.0.0'
};
```

### 3.2 System Information Operations

```typescript
let systemInfo = { ...initialSystemInfo };
let startTime = Date.now();

/**
 * Gets current system information
 */
export const getSystemInfo = (): SystemInfo => {
  const currentTime = Date.now();
  systemInfo.uptime = Math.floor((currentTime - startTime) / 1000);
  
  return { ...systemInfo };
};

/**
 * Updates system resource metrics
 */
export const updateSystemInfo = (): void => {
  // Simulate fluctuations in system metrics
  const cpuDelta = (Math.random() - 0.5) * 2;
  systemInfo.cpuUsage = Math.max(0.5, Math.min(systemInfo.cpuUsage + cpuDelta, 100));
  
  const memDelta = (Math.random() - 0.5) * 1.5;
  systemInfo.memoryUsage = Math.max(10, Math.min(systemInfo.memoryUsage + memDelta, 95));
  
  const diskDelta = (Math.random() - 0.5) * 0.2;
  systemInfo.diskUsage = Math.max(10, Math.min(systemInfo.diskUsage + diskDelta, 95));
};

/**
 * Formats uptime in a human-readable format
 */
export const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  let result = '';
  
  if (days > 0) {
    result += `${days}d `;
  }
  
  if (hours > 0 || days > 0) {
    result += `${hours}h `;
  }
  
  if (minutes > 0 || hours > 0 || days > 0) {
    result += `${minutes}m `;
  }
  
  result += `${remainingSeconds}s`;
  
  return result;
};
```

## 4. Terminal Interface

### 4.1 Command Processing

```typescript
/**
 * Parses a command string into command and arguments
 */
const parseCommand = (input: string) => {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return { command: '', args: [] };
  }
  
  const parts = trimmedInput.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).filter(arg => arg !== '');
  
  return { command, args };
};

/**
 * Executes a command and returns the output
 */
const executeCommand = async (
  input: string,
  currentDirectory: string
): Promise<{
  output: string;
  newDirectory?: string;
  error?: boolean;
}> => {
  const { command, args } = parseCommand(input);
  
  switch (command) {
    case 'ls':
      return handleLsCommand(args, currentDirectory);
    case 'cd':
      return handleCdCommand(args, currentDirectory);
    case 'pwd':
      return handlePwdCommand(currentDirectory);
    case 'cat':
      return handleCatCommand(args, currentDirectory);
    case 'touch':
      return handleTouchCommand(args, currentDirectory);
    case 'mkdir':
      return handleMkdirCommand(args, currentDirectory);
    case 'rm':
      return handleRmCommand(args, currentDirectory);
    case 'echo':
      return handleEchoCommand(args);
    case 'ps':
      return handlePsCommand();
    case 'kill':
      return handleKillCommand(args);
    case 'sysinfo':
      return handleSysinfoCommand();
    case 'date':
      return handleDateCommand();
    case 'clear':
      return { output: 'clear' }; // Special output to clear the terminal
    case 'help':
      return handleHelpCommand();
    case 'clearstorage':
      return handleClearStorageCommand();
    case 'localfiles':
      return handleLocalFilesCommand();
    case 'syncdir':
      return handleSyncDirCommand();
    case 'pwdreal':
      return handlePwdRealCommand();
    case 'lsreal':
      return handleLsRealCommand();
    default:
      return {
        output: `Command not found: ${command}. Type 'help' for available commands.`,
        error: true
      };
  }
};
```

### 4.2 Command Handlers

```typescript
/**
 * Handles the ls command
 */
const handleLsCommand = (
  args: string[],
  currentDirectory: string
): { output: string; error?: boolean } => {
  const targetPath = args.length > 0 ? args[0] : '.';
  const fullPath = resolvePath(currentDirectory, targetPath);
  
  const entry = findEntry(fileSystem, fullPath);
  
  if (!entry || entry.entry.type !== 'directory') {
    return {
      output: `ls: cannot access '${targetPath}': No such directory`,
      error: true
    };
  }
  
  if (!entry.entry.children || entry.entry.children.length === 0) {
    return { output: '' }; // Empty directory
  }
  
  // Format directory contents
  const formatted = entry.entry.children
    .sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    })
    .map(child => {
      if (child.type === 'directory') {
        return `<span class="text-blue-400">${child.name}/</span>`;
      }
      return `<span class="text-green-300">${child.name}</span>`;
    })
    .join('  ');
  
  return { output: formatted };
};

/**
 * Handles the cd command
 */
const handleCdCommand = (
  args: string[],
  currentDirectory: string
): { output: string; newDirectory?: string; error?: boolean } => {
  if (args.length === 0) {
    return { output: '', newDirectory: '/home/user' };
  }
  
  const targetPath = args[0];
  const newDirectory = changeDirectory(fileSystem, currentDirectory, targetPath);
  
  if (!newDirectory) {
    return {
      output: `cd: no such file or directory: ${targetPath}`,
      error: true
    };
  }
  
  return { output: '', newDirectory };
};

/**
 * Handles the pwd command
 */
const handlePwdCommand = (
  currentDirectory: string
): { output: string; error?: boolean } => {
  return { output: currentDirectory };
};

/**
 * Handles the cat command
 */
const handleCatCommand = (
  args: string[],
  currentDirectory: string
): { output: string; error?: boolean } => {
  if (args.length === 0) {
    return { output: 'cat: missing operand', error: true };
  }
  
  const targetPath = args[0];
  const fullPath = resolvePath(currentDirectory, targetPath);
  const content = readFile(fileSystem, fullPath);
  
  if (content === null) {
    return { output: `cat: ${targetPath}: No such file or directory`, error: true };
  }
  
  return { output: content };
};

/**
 * Handles the touch command
 */
const handleTouchCommand = (
  args: string[],
  currentDirectory: string
): { output: string; error?: boolean } => {
  if (args.length === 0) {
    return { output: 'touch: missing file operand', error: true };
  }
  
  const fileName = args[0];
  const success = createFile(fileSystem, currentDirectory, fileName);
  
  if (!success) {
    return { output: `touch: cannot create file '${fileName}': File exists`, error: true };
  }
  
  return { output: '' };
};

/**
 * Handles the mkdir command
 */
const handleMkdirCommand = (
  args: string[],
  currentDirectory: string
): { output: string; error?: boolean } => {
  if (args.length === 0) {
    return { output: 'mkdir: missing operand', error: true };
  }
  
  const directoryName = args[0];
  const success = createDirectory(fileSystem, currentDirectory, directoryName);
  
  if (!success) {
    return {
      output: `mkdir: cannot create directory '${directoryName}': File exists`,
      error: true
    };
  }
  
  return { output: '' };
};

/**
 * Handles the rm command
 */
const handleRmCommand = (
  args: string[],
  currentDirectory: string
): { output: string; error?: boolean } => {
  if (args.length === 0) {
    return { output: 'rm: missing operand', error: true };
  }
  
  const targetPath = args[0];
  const fullPath = resolvePath(currentDirectory, targetPath);
  const success = deleteEntry(fileSystem, fullPath);
  
  if (!success) {
    return { output: `rm: cannot remove '${targetPath}': No such file or directory`, error: true };
  }
  
  return { output: '' };
};

/**
 * Handles the echo command
 */
const handleEchoCommand = (args: string[]): { output: string; error?: boolean } => {
  if (args.length === 0) {
    return { output: '' };
  }
  
  // Check for redirection
  const redirectIndex = args.findIndex(arg => arg === '>');
  const appendIndex = args.findIndex(arg => arg === '>>');
  
  if (redirectIndex !== -1) {
    // Redirection to file
    const fileName = args[redirectIndex + 1];
    const content = args.slice(0, redirectIndex).join(' ');
    
    if (!fileName) {
      return { output: 'echo: missing file operand', error: true };
    }
    
    const success = writeFile(fileSystem, '/home/user/' + fileName, content);
    
    if (!success) {
      return { output: `echo: cannot write to file '${fileName}'`, error: true };
    }
    
    return { output: '' };
  } else if (appendIndex !== -1) {
    // Appending to file
    const fileName = args[appendIndex + 1];
    const content = args.slice(0, appendIndex).join(' ');
    
    if (!fileName) {
      return { output: 'echo: missing file operand', error: true };
    }
    
    const success = writeFile(fileSystem, '/home/user/' + fileName, content, true);
    
    if (!success) {
      return { output: `echo: cannot append to file '${fileName}'`, error: true };
    }
    
    return { output: '' };
  } else {
    // Regular echo
    return { output: args.join(' ') };
  }
};

/**
 * Handles the ps command
 */
const handlePsCommand = (): { output: string; error?: boolean } => {
  const processes = getProcesses();
  
  // Format process list
  const formatted = [
    'PID  NAME      STATE    PRI  MEM     CPU%',
    ...processes.map(
      p =>
        `${p.pid.toString().padEnd(5)} ${p.name.padEnd(10)} ${p.state.padEnd(7)} ${p.priority
          .toString()
          .padEnd(4)} ${p.memoryUsage.toString().padEnd(7)} ${p.cpuUsage.toFixed(1)}%`
    )
  ].join('\n');
  
  return { output: formatted };
};

/**
 * Handles the kill command
 */
const handleKillCommand = (args: string[]): { output: string; error?: boolean } => {
  if (args.length === 0) {
    return { output: 'kill: usage: kill pid', error: true };
  }
  
  const pid = parseInt(args[0]);
  
  if (isNaN(pid)) {
    return { output: 'kill: pid must be a number', error: true };
  }
  
  const success = killProcess(pid);
  
  if (!success) {
    return { output: `kill: (${pid}) - No such process`, error: true };
  }
  
  return { output: '' };
};

/**
 * Handles the sysinfo command
 */
const handleSysinfoCommand = (): { output: string; error?: boolean } => {
  const info = getSystemInfo();
  const uptimeFormatted = formatUptime(info.uptime);
  
  const formatted = `System Information:
CPU Usage: ${info.cpuUsage.toFixed(1)}%
Memory Usage: ${info.memoryUsage.toFixed(1)}%
Disk Usage: ${info.diskUsage.toFixed(1)}%
Uptime: ${uptimeFormatted}
System: ${info.systemVersion}
Kernel: ${info.kernelVersion}`;
  
  return { output: formatted };
};

/**
 * Handles the date command
 */
const handleDateCommand = (): { output: string; error?: boolean } => {
  const now = new Date();
  return { output: now.toString() };
};

/**
 * Handles the help command
 */
const handleHelpCommand = (): { output: string; error?: boolean } => {
  const helpText = `Available commands:
- ls: List directory contents
- cd: Change directory
- pwd: Print working directory
- cat: Display file contents
- echo: Display text or write to file
- touch: Create an empty file
- mkdir: Create a directory
- rm: Remove files or directories
- ps: Report process status
- kill: Terminate a process
- sysinfo: Display system information
- date: Show current date and time
- clear: Clear the terminal screen
- help: Display available commands
- clearstorage: Reset file system to initial state
- localfiles: Access files from your local system
- syncdir: Connect to a system directory
- pwdreal: Show connected system directory
- lsreal: List files in connected system directory`;
  
  return { output: helpText };
};

/**
 * Handles the clearstorage command
 */
const handleClearStorageCommand = (): { output: string; error?: boolean } => {
  resetFileSystem();
  fileSystem = loadFileSystem(); // Reload initial file system
  return { output: 'File system cleared and reset to initial state.' };
};

/**
 * Handles the localfiles command
 */
const handleLocalFilesCommand = (): { output: string; error?: boolean } => {
  // Implement local file access logic here
  return { output: 'Opening file picker...\n[Browser file picker opens]' };
};

/**
 * Handles the syncdir command
 */
const handleSyncDirCommand = (): { output: string; error?: boolean } => {
  // Implement directory synchronization logic here
  return { output: 'Connecting to a system directory...' };
};

/**
 * Handles the pwdreal command
 */
const handlePwdRealCommand = (): { output: string; error?: boolean } => {
  // Implement show connected system directory logic here
  return { output: 'Showing connected system directory...' };
};

/**
 * Handles the lsreal command
 */
const handleLsRealCommand = (): { output: string; error?: boolean } => {
  // Implement list files in connected system directory logic here
  return { output: 'Listing files in connected system directory...' };
};
```

### 4.3 Terminal Component

```jsx
const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState('/home/user');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [booting, setBooting] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Simulate boot sequence
  useEffect(() => {
