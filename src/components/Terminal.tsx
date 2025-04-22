import React, { useState, useEffect, useRef } from 'react';
import { 
  listDirectory, readFile, writeFile, createFile, createDirectory, 
  deleteEntry, changeDirectory, getWorkingDirectoryPath 
} from '../utils/fileSystem';
import { 
  getProcesses, createProcess, killProcess, suspendProcess, 
  resumeProcess, fork, exec 
} from '../utils/processManager';
import { getSystemInfo, formatUptime } from '../utils/systemInfo';

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
  isError?: boolean;
}

interface SystemDirectory {
  path: string;
  files: {
    name: string;
    size: number;
    type: string;
    lastModified: string;
  }[];
}

const Terminal: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState<boolean>(false);
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [systemDirectory, setSystemDirectory] = useState<SystemDirectory | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const bootSequence = async () => {
      addToHistory({
        command: '',
        output: <div className="text-green font-bold">MINI-OS BOOT SEQUENCE INITIATED</div>
      });
      
      await delay(500);
      setBootProgress(10);
      addToHistory({
        command: '',
        output: <div className="text-cyan">Initializing hardware detection...</div>
      });
      
      await delay(800);
      setBootProgress(25);
      addToHistory({
        command: '',
        output: <div className="text-cyan">Loading kernel modules...</div>
      });
      
      await delay(1000);
      setBootProgress(40);
      addToHistory({
        command: '',
        output: <div className="text-cyan">Mounting file systems...</div>
      });
      
      await delay(700);
      setBootProgress(60);
      addToHistory({
        command: '',
        output: <div className="text-cyan">Starting system services...</div>
      });
      
      await delay(900);
      setBootProgress(80);
      addToHistory({
        command: '',
        output: <div className="text-cyan">Initializing network interfaces...</div>
      });
      
      await delay(600);
      setBootProgress(95);
      addToHistory({
        command: '',
        output: <div className="text-cyan">Loading user environment...</div>
      });
      
      await delay(500);
      setBootProgress(100);
      
      addToHistory({
        command: '',
        output: (
          <div>
            <div className="text-green font-bold">BOOT SEQUENCE COMPLETE</div>
            <div className="text-yellow mt-1">Welcome to MiniOS v1.0.0</div>
            <div className="text-foreground mt-2">Type 'help' to see available commands.</div>
          </div>
        )
      });
      
      setBootComplete(true);
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    bootSequence();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current && bootComplete) {
        inputRef.current.focus();
      }
    };
    
    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick);
    }
    
    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick);
      }
    };
  }, [bootComplete]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const addToHistory = (item: CommandHistoryItem) => {
    setHistory(prev => [...prev, item]);
  };

  const handleLocalFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      addToHistory({
        command: '',
        output: <div className="text-yellow">No files selected</div>
      });
      return;
    }

    const fileList = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type || 'unknown',
      lastModified: new Date(file.lastModified).toLocaleString()
    }));

    addToHistory({
      command: '',
      output: (
        <div>
          <div className="text-yellow font-bold mb-2">Selected local files:</div>
          <div className="grid grid-cols-4 gap-2 font-bold mb-1">
            <div>NAME</div>
            <div>SIZE</div>
            <div>TYPE</div>
            <div>MODIFIED</div>
          </div>
          {fileList.map((file, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <div className="text-cyan">{file.name}</div>
              <div>{formatFileSize(file.size)}</div>
              <div>{file.type}</div>
              <div>{file.lastModified}</div>
            </div>
          ))}
        </div>
      )
    });
  };

  const handleSystemDirectorySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      addToHistory({
        command: '',
        output: <div className="text-yellow">No directory selected or empty directory</div>
      });
      return;
    }

    let commonPath = "";
    try {
      const firstFile = files[0];
      commonPath = firstFile.webkitRelativePath.split('/')[0] || "selected-directory";
    } catch (error) {
      commonPath = "selected-directory";
    }

    const fileList = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type || 'unknown',
      lastModified: new Date(file.lastModified).toLocaleString()
    }));

    setSystemDirectory({
      path: commonPath,
      files: fileList
    });

    addToHistory({
      command: '',
      output: (
        <div>
          <div className="text-green font-bold mb-2">
            Connected to system directory: {commonPath}
          </div>
          <div className="text-yellow font-bold">Files available ({fileList.length}):</div>
          <div className="grid grid-cols-4 gap-2 font-bold mb-1">
            <div>NAME</div>
            <div>SIZE</div>
            <div>TYPE</div>
            <div>MODIFIED</div>
          </div>
          {fileList.slice(0, 10).map((file, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <div className="text-cyan">{file.name}</div>
              <div>{formatFileSize(file.size)}</div>
              <div>{file.type}</div>
              <div>{file.lastModified}</div>
            </div>
          ))}
          {fileList.length > 10 && (
            <div className="mt-2 text-muted-foreground">
              ... and {fileList.length - 10} more files
            </div>
          )}
        </div>
      )
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    
    const cmd = input.trim();
    const output = executeCommand(cmd);
    
    addToHistory({
      command: cmd,
      output,
      isError: false
    });
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  const handleTabCompletion = () => {
    const parts = input.split(' ');
    const lastPart = parts[parts.length - 1];
    
    if (parts.length > 1 || input.endsWith(' ')) {
      const dir = listDirectory();
      if (dir) {
        const possibleMatches = dir.filter(entry => 
          entry.name.startsWith(lastPart) && entry.name !== lastPart
        );
        
        if (possibleMatches.length === 1) {
          if (parts.length === 1 && !input.endsWith(' ')) {
            setInput(possibleMatches[0].name);
          } else {
            parts[parts.length - 1] = possibleMatches[0].name;
            setInput(parts.join(' '));
          }
        } else if (possibleMatches.length > 1) {
          addToHistory({
            command: '',
            output: (
              <div className="flex flex-wrap gap-4">
                {possibleMatches.map((entry, i) => (
                  <span key={i} className={`${entry.type === 'directory' ? 'text-cyan' : ''}`}>
                    {entry.name}{entry.type === 'directory' ? '/' : ''}
                  </span>
                ))}
              </div>
            )
          });
        }
      }
    }
  };

  const executeCommand = (command: string): React.ReactNode => {
    const [cmd, ...args] = command.split(' ').filter(Boolean);
    
    switch (cmd.toLowerCase()) {
      case 'localfiles':
        try {
          if (fileInputRef.current) {
            fileInputRef.current.click();
            return <div>Opening file picker...</div>;
          }
          return <div className="text-red">Could not access file picker</div>;
        } catch (error) {
          return <div className="text-red">Error accessing local files: {String(error)}</div>;
        }

      case 'syncdir':
        try {
          if (dirInputRef.current) {
            dirInputRef.current.click();
            return <div>Select a directory to connect...</div>;
          }
          return <div className="text-red">Could not access directory picker</div>;
        } catch (error) {
          return <div className="text-red">Error accessing system directory: {String(error)}</div>;
        }

      case 'pwdreal':
        if (systemDirectory) {
          return <div className="text-green">{systemDirectory.path}</div>;
        } else {
          return <div className="text-yellow">Not connected to any system directory. Use 'syncdir' to connect.</div>;
        }

      case 'lsreal':
        if (!systemDirectory) {
          return <div className="text-yellow">Not connected to any system directory. Use 'syncdir' to connect.</div>;
        }
        
        return (
          <div>
            <div className="text-green mb-2">Listing files in system directory: {systemDirectory.path}</div>
            <div className="grid grid-cols-4 gap-2 font-bold mb-1">
              <div>NAME</div>
              <div>SIZE</div>
              <div>TYPE</div>
              <div>MODIFIED</div>
            </div>
            {systemDirectory.files.map((file, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                <div className="text-cyan">{file.name}</div>
                <div>{formatFileSize(file.size)}</div>
                <div>{file.type}</div>
                <div>{file.lastModified}</div>
              </div>
            ))}
          </div>
        );

      case 'help':
        return (
          <div className="space-y-1">
            <div className="text-yellow font-bold">Available Commands:</div>
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-cyan">ls</span> - List directory contents</div>
              <div><span className="text-cyan">cd</span> - Change directory</div>
              <div><span className="text-cyan">pwd</span> - Print working directory</div>
              <div><span className="text-cyan">cat</span> - Display file contents</div>
              <div><span className="text-cyan">echo</span> - Display a line of text</div>
              <div><span className="text-cyan">touch</span> - Create an empty file</div>
              <div><span className="text-cyan">mkdir</span> - Create a directory</div>
              <div><span className="text-cyan">rm</span> - Remove files or directories</div>
              <div><span className="text-cyan">ps</span> - Report process status</div>
              <div><span className="text-cyan">kill</span> - Terminate a process</div>
              <div><span className="text-cyan">clear</span> - Clear the terminal screen</div>
              <div><span className="text-cyan">sysinfo</span> - Display system information</div>
              <div><span className="text-cyan">date</span> - Show the current date and time</div>
              <div><span className="text-cyan">localfiles</span> - Access files from your local system</div>
              <div><span className="text-cyan">syncdir</span> - Connect to a system directory</div>
              <div><span className="text-cyan">pwdreal</span> - Show connected system directory</div>
              <div><span className="text-cyan">lsreal</span> - List files in connected system directory</div>
              <div><span className="text-cyan">clearstorage</span> - Reset file system to initial state</div>
              <div><span className="text-cyan">help</span> - Display this help message</div>
            </div>
          </div>
        );

      case 'ls':
        try {
          const path = args[0] || '';
          const entries = listDirectory(path);
          
          if (!entries) {
            return <div className="text-red">ls: cannot access '{path}': No such file or directory</div>;
          }
          
          return (
            <div className="flex flex-wrap gap-4">
              {entries.length === 0 ? (
                <div className="text-muted-foreground italic">Empty directory</div>
              ) : (
                entries.map((entry, i) => (
                  <div key={i} className="flex items-center">
                    <span className={`${entry.type === 'directory' ? 'text-cyan' : 'text-foreground'}`}>
                      {entry.name}{entry.type === 'directory' ? '/' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          );
        } catch (error) {
          return <div className="text-red">ls: An error occurred</div>;
        }

      case 'cd':
        try {
          const path = args[0] || '/home/user';
          const success = changeDirectory(path);
          
          if (!success) {
            return <div className="text-red">cd: {path}: No such directory</div>;
          }
          
          return null;
        } catch (error) {
          return <div className="text-red">cd: An error occurred</div>;
        }

      case 'pwd':
        return <div>{getWorkingDirectoryPath()}</div>;

      case 'cat':
        try {
          if (!args[0]) {
            return <div className="text-red">cat: missing file operand</div>;
          }

          const virtualContent = readFile(args[0]);
          if (virtualContent !== null) {
            return <div className="whitespace-pre-wrap">{virtualContent}</div>;
          }

          if (systemDirectory) {
            const targetFile = systemDirectory.files.find(f => f.name === args[0]);
            if (targetFile) {
              return <div className="text-yellow">
                Cannot display content of local file '{args[0]}'. 
                Browser security restrictions prevent direct file content access.
                Use 'lsreal' to view file metadata instead.
              </div>;
            }
          }
          
          return <div className="text-red">cat: {args[0]}: No such file</div>;
        } catch (error) {
          return <div className="text-red">cat: An error occurred</div>;
        }

      case 'echo':
        if (args.length < 2 || args[0] !== '>' && args[0] !== '>>') {
          return <div>{args.join(' ')}</div>;
        }
        
        try {
          const fileName = args[1];
          const content = args.slice(2).join(' ');
          const append = args[0] === '>>';
          
          const success = writeFile(fileName, content, append);
          
          if (!success) {
            return <div className="text-red">echo: Failed to write to {fileName}</div>;
          }
          
          return null;
        } catch (error) {
          return <div className="text-red">echo: An error occurred</div>;
        }

      case 'touch':
        try {
          if (!args[0]) {
            return <div className="text-red">touch: missing file operand</div>;
          }
          
          const success = createFile(args[0]);
          
          if (!success) {
            return <div className="text-yellow">touch: {args[0]}: File already exists</div>;
          }
          
          return null;
        } catch (error) {
          return <div className="text-red">touch: An error occurred</div>;
        }

      case 'mkdir':
        try {
          if (!args[0]) {
            return <div className="text-red">mkdir: missing operand</div>;
          }
          
          const success = createDirectory(args[0]);
          
          if (!success) {
            return <div className="text-red">mkdir: cannot create directory '{args[0]}': Already exists</div>;
          }
          
          return null;
        } catch (error) {
          return <div className="text-red">mkdir: An error occurred</div>;
        }

      case 'rm':
        try {
          if (!args[0]) {
            return <div className="text-red">rm: missing operand</div>;
          }
          
          const success = deleteEntry(args[0]);
          
          if (!success) {
            return <div className="text-red">rm: cannot remove '{args[0]}': No such file or directory</div>;
          }
          
          return null;
        } catch (error) {
          return <div className="text-red">rm: An error occurred</div>;
        }

      case 'ps':
        try {
          const processes = getProcesses();
          
          return (
            <div>
              <div className="grid grid-cols-6 gap-2 font-bold mb-1">
                <div>PID</div>
                <div>NAME</div>
                <div>STATE</div>
                <div>PRI</div>
                <div>MEM</div>
                <div>CPU%</div>
              </div>
              {processes.map((proc, i) => (
                <div key={i} className="grid grid-cols-6 gap-2">
                  <div>{proc.pid}</div>
                  <div className={proc.state === 'running' ? 'text-green' : ''}>{proc.name}</div>
                  <div>{proc.state}</div>
                  <div>{proc.priority}</div>
                  <div>{proc.memoryUsage} KB</div>
                  <div>{proc.cpuUsage.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          );
        } catch (error) {
          return <div className="text-red">ps: An error occurred</div>;
        }

      case 'kill':
        try {
          if (!args[0]) {
            return <div className="text-red">kill: missing PID</div>;
          }
          
          const pid = parseInt(args[0]);
          
          if (isNaN(pid)) {
            return <div className="text-red">kill: invalid PID: {args[0]}</div>;
          }
          
          const success = killProcess(pid);
          
          if (!success) {
            return <div className="text-red">kill: ({pid}) - No such process or cannot kill system process</div>;
          }
          
          return <div>Process {pid} terminated</div>;
        } catch (error) {
          return <div className="text-red">kill: An error occurred</div>;
        }

      case 'clear':
        setHistory([]);
        return null;

      case 'sysinfo':
        try {
          const info = getSystemInfo();
          
          return (
            <div className="space-y-2">
              <div className="text-yellow font-bold">System Information:</div>
              <div>CPU Usage: {info.cpuUsage.toFixed(1)}%</div>
              <div>Memory Usage: {info.memoryUsage.toFixed(1)}%</div>
              <div>Disk Usage: {info.diskUsage.toFixed(1)}%</div>
              <div>Uptime: {formatUptime(info.uptime)}</div>
              <div>System: MiniOS v1.0.0</div>
              <div>Kernel: 1.0.0</div>
            </div>
          );
        } catch (error) {
          return <div className="text-red">sysinfo: An error occurred</div>;
        }

      case 'date':
        return <div>{new Date().toString()}</div>;

      case 'clearstorage':
        try {
          resetFileSystem();
          return <div className="text-green">File system has been reset to its initial state.</div>;
        } catch (error) {
          return <div className="text-red">Error resetting file system.</div>;
        }

      default:
        if (cmd) {
          createProcess(cmd);
          
          return <div className="text-red">Command not found: {cmd}</div>;
        }
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!bootComplete && (
        <div className="w-full bg-gray-700 h-2 mb-2">
          <div 
            className="bg-green h-full" 
            style={{ width: `${bootProgress}%`, transition: 'width 0.5s ease-in-out' }}
          />
        </div>
      )}
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
      >
        {history.map((item, i) => (
          <div key={i} className="mb-2">
            {item.command && (
              <div className="flex items-center mb-1">
                <span className="text-green mr-1">user@miniOS</span>
                <span className="text-foreground mr-1">:</span>
                <span className="text-cyan mr-1">{getWorkingDirectoryPath()}</span>
                <span className="text-foreground mr-1">$</span>
                <span className="ml-1">{item.command}</span>
              </div>
            )}
            
            <div className={`ml-0 ${item.isError ? 'text-red' : ''}`}>
              {item.output}
            </div>
          </div>
        ))}
        
        {bootComplete && (
          <div className="flex items-center">
            <span className="text-green mr-1">user@miniOS</span>
            <span className="text-foreground mr-1">:</span>
            <span className="text-cyan mr-1">{getWorkingDirectoryPath()}</span>
            <span className="text-foreground mr-1">$</span>
            <form onSubmit={handleSubmit} className="flex-1 ml-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent outline-none border-none w-full cursor-text"
                autoFocus
              />
            </form>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleLocalFileSelect} 
          multiple 
        />
        
        <input 
          type="file" 
          ref={dirInputRef} 
          className="hidden" 
          onChange={handleSystemDirectorySelect} 
          multiple 
          webkitdirectory="true" 
          directory="true"
        />
      </div>
    </div>
  );
};

export default Terminal;
