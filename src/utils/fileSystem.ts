
import { FileSystemEntry } from '../types';

// Initial file system structure
const initialFileSystem: FileSystemEntry = {
  name: '/',
  type: 'directory',
  permissions: 'drwxr-xr-x',
  created: Date.now() - 3600000,
  modified: Date.now() - 3600000,
  children: [
    {
      name: 'bin',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      created: Date.now() - 3600000,
      modified: Date.now() - 3600000,
      children: [
        {
          name: 'ls',
          type: 'file',
          size: 45056,
          permissions: '-rwxr-xr-x',
          created: Date.now() - 3600000,
          modified: Date.now() - 3600000,
        },
        {
          name: 'cat',
          type: 'file',
          size: 35840,
          permissions: '-rwxr-xr-x',
          created: Date.now() - 3600000,
          modified: Date.now() - 3600000,
        },
        {
          name: 'echo',
          type: 'file',
          size: 30720,
          permissions: '-rwxr-xr-x',
          created: Date.now() - 3600000,
          modified: Date.now() - 3600000,
        },
        {
          name: 'mkdir',
          type: 'file',
          size: 38912,
          permissions: '-rwxr-xr-x',
          created: Date.now() - 3600000,
          modified: Date.now() - 3600000,
        }
      ]
    },
    {
      name: 'etc',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      created: Date.now() - 3600000,
      modified: Date.now() - 3600000,
      children: [
        {
          name: 'passwd',
          type: 'file',
          size: 2048,
          content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User:/home/user:/bin/bash',
          permissions: '-rw-r--r--',
          created: Date.now() - 3600000,
          modified: Date.now() - 3600000,
        },
        {
          name: 'hostname',
          type: 'file',
          size: 24,
          content: 'miniOS',
          permissions: '-rw-r--r--',
          created: Date.now() - 3600000,
          modified: Date.now() - 3600000,
        }
      ]
    },
    {
      name: 'home',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      created: Date.now() - 3600000,
      modified: Date.now() - 3600000,
      children: [
        {
          name: 'user',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          created: Date.now() - 3600000,
          modified: Date.now() - 3600000,
          children: [
            {
              name: 'readme.txt',
              type: 'file',
              size: 1024,
              content: 'Welcome to miniOS!\n\nThis is a simulated mini operating system with a functional CLI.\n\nAvailable commands:\n- ls: List directory contents\n- cat: Display file contents\n- echo: Display a message\n- mkdir: Create a directory\n- touch: Create a file\n- rm: Remove a file or directory\n- cd: Change directory\n- pwd: Print current directory\n- ps: List processes\n- kill: Terminate a process\n- help: Show available commands',
              permissions: '-rw-r--r--',
              created: Date.now() - 3600000,
              modified: Date.now() - 3600000,
            },
            {
              name: 'notes.txt',
              type: 'file',
              size: 512,
              content: 'TODO: Learn more about operating systems\nCheck out resources on:\n- Process management\n- Memory allocation\n- File systems\n- I/O handling',
              permissions: '-rw-r--r--',
              created: Date.now() - 3600000,
              modified: Date.now() - 3600000,
            }
          ]
        }
      ]
    },
    {
      name: 'var',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      created: Date.now() - 3600000,
      modified: Date.now() - 3600000,
      children: [
        {
          name: 'log',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          created: Date.now() - 3600000,
          modified: Date.now() - 3600000,
          children: [
            {
              name: 'system.log',
              type: 'file',
              size: 4096,
              content: 'System boot completed successfully\nKernel initialized\nFile system mounted\nNetwork interfaces configured\nServices started',
              permissions: '-rw-r--r--',
              created: Date.now() - 3600000,
              modified: Date.now() - 3600000,
            }
          ]
        }
      ]
    }
  ]
};

// Storage keys
const FILE_SYSTEM_KEY = 'miniOS_fileSystem';
const CURRENT_PATH_KEY = 'miniOS_currentPath';

// Get file system from localStorage or use the initial structure
const getStoredFileSystem = (): FileSystemEntry => {
  try {
    const storedFs = localStorage.getItem(FILE_SYSTEM_KEY);
    if (storedFs) {
      return JSON.parse(storedFs);
    }
  } catch (error) {
    console.error('Error loading file system from storage:', error);
  }
  return JSON.parse(JSON.stringify(initialFileSystem));
};

// Get current path from localStorage or use the default
const getStoredCurrentPath = (): string[] => {
  try {
    const storedPath = localStorage.getItem(CURRENT_PATH_KEY);
    if (storedPath) {
      return JSON.parse(storedPath);
    }
  } catch (error) {
    console.error('Error loading current path from storage:', error);
  }
  return ['home', 'user'];
};

// Initialize file system from localStorage or default
let fileSystem = getStoredFileSystem();
let currentPath = getStoredCurrentPath();

// Save file system to localStorage
const saveFileSystem = () => {
  try {
    localStorage.setItem(FILE_SYSTEM_KEY, JSON.stringify(fileSystem));
  } catch (error) {
    console.error('Error saving file system to storage:', error);
  }
};

// Save current path to localStorage
const saveCurrentPath = () => {
  try {
    localStorage.setItem(CURRENT_PATH_KEY, JSON.stringify(currentPath));
  } catch (error) {
    console.error('Error saving current path to storage:', error);
  }
};

// File system utilities
export const getCurrentDirectory = (): FileSystemEntry => {
  let current = fileSystem;
  
  for (const dir of currentPath) {
    const found = current.children?.find(entry => entry.name === dir && entry.type === 'directory');
    if (found) {
      current = found;
    } else {
      // If path segment not found, return to root
      return fileSystem;
    }
  }
  
  return current;
};

export const getWorkingDirectoryPath = (): string => {
  if (currentPath.length === 0) {
    return '/';
  }
  return '/' + currentPath.join('/');
};

export const changeDirectory = (path: string): boolean => {
  if (path === '/') {
    currentPath = [];
    saveCurrentPath(); // Save after changing directory
    return true;
  }
  
  if (path === '..') {
    if (currentPath.length > 0) {
      currentPath.pop();
      saveCurrentPath(); // Save after changing directory
      return true;
    }
    return false;
  }
  
  if (path === '.') {
    return true;
  }
  
  if (path.startsWith('/')) {
    // Absolute path
    const segments = path.split('/').filter(Boolean);
    
    // Verify each segment exists
    let current = fileSystem;
    for (const segment of segments) {
      const found = current.children?.find(entry => entry.name === segment && entry.type === 'directory');
      if (!found) {
        return false;
      }
      current = found;
    }
    
    currentPath = segments;
    saveCurrentPath(); // Save after changing directory
    return true;
  } else {
    // Relative path
    const segments = path.split('/').filter(Boolean);
    const newPath = [...currentPath];
    
    for (const segment of segments) {
      if (segment === '..') {
        if (newPath.length > 0) {
          newPath.pop();
        }
      } else if (segment !== '.') {
        let current = getCurrentDirectory();
        const found = current.children?.find(entry => entry.name === segment && entry.type === 'directory');
        if (!found) {
          return false;
        }
        newPath.push(segment);
      }
    }
    
    currentPath = newPath;
    saveCurrentPath(); // Save after changing directory
    return true;
  }
};

export const listDirectory = (path?: string): FileSystemEntry[] | null => {
  if (!path) {
    return getCurrentDirectory().children || [];
  }
  
  // Handle absolute and relative paths
  const targetPath = path.startsWith('/') ? 
    path.split('/').filter(Boolean) : 
    [...currentPath, ...path.split('/').filter(Boolean)];
  
  let current = fileSystem;
  for (const segment of targetPath) {
    if (segment === '..') {
      targetPath.pop();
      continue;
    }
    if (segment === '.') {
      continue;
    }
    
    const found = current.children?.find(entry => entry.name === segment && entry.type === 'directory');
    if (!found) {
      return null;
    }
    current = found;
  }
  
  return current.children || [];
};

export const createFile = (name: string, content: string = ''): boolean => {
  const current = getCurrentDirectory();
  
  if (!current.children) {
    current.children = [];
  }
  
  if (current.children.some(entry => entry.name === name)) {
    // File already exists
    return false;
  }
  
  current.children.push({
    name,
    type: 'file',
    size: content.length,
    content,
    permissions: '-rw-r--r--',
    created: Date.now(),
    modified: Date.now()
  });
  
  saveFileSystem(); // Save after creating file
  return true;
};

export const createDirectory = (name: string): boolean => {
  const current = getCurrentDirectory();
  
  if (!current.children) {
    current.children = [];
  }
  
  if (current.children.some(entry => entry.name === name)) {
    // Directory already exists
    return false;
  }
  
  current.children.push({
    name,
    type: 'directory',
    children: [],
    permissions: 'drwxr-xr-x',
    created: Date.now(),
    modified: Date.now()
  });
  
  saveFileSystem(); // Save after creating directory
  return true;
};

export const readFile = (name: string): string | null => {
  const current = getCurrentDirectory();
  
  const file = current.children?.find(entry => entry.name === name && entry.type === 'file');
  
  if (!file || !file.content) {
    return null;
  }
  
  return file.content;
};

export const writeFile = (name: string, content: string = '', append: boolean = false): boolean => {
  const current = getCurrentDirectory();
  
  if (!current.children) {
    current.children = [];
  }
  
  const existingFile = current.children.find(entry => entry.name === name && entry.type === 'file');
  
  if (existingFile) {
    if (append && existingFile.content) {
      existingFile.content += '\n' + content;
    } else {
      existingFile.content = content;
    }
    existingFile.size = existingFile.content.length;
    existingFile.modified = Date.now();
    saveFileSystem(); // Save after modifying file
    return true;
  }
  
  return createFile(name, content);
};

export const deleteEntry = (name: string): boolean => {
  const current = getCurrentDirectory();
  
  if (!current.children) {
    return false;
  }
  
  const index = current.children.findIndex(entry => entry.name === name);
  
  if (index === -1) {
    return false;
  }
  
  current.children.splice(index, 1);
  current.modified = Date.now();
  saveFileSystem(); // Save after deleting entry
  
  return true;
};

// Reset the file system to its initial state
export const resetFileSystem = (): void => {
  fileSystem = JSON.parse(JSON.stringify(initialFileSystem));
  currentPath = ['home', 'user'];
  saveFileSystem(); // Save after reset
  saveCurrentPath(); // Save current path after reset
};

// Initialize the file system
export const initFileSystem = (): void => {
  // Load from localStorage or use defaults if not available
  fileSystem = getStoredFileSystem();
  currentPath = getStoredCurrentPath();
};

