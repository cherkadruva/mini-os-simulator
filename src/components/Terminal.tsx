
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

// Define command history type
interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
  isError?: boolean;
}

// Terminal component
const Terminal: React.FC = () => {
  // State
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState<boolean>(false);
  const [bootProgress, setBootProgress] = useState<number>(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot sequence effect
  useEffect(() => {
    const bootSequence = async () => {
      // Initial boot messages
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
      
      // Boot complete
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
      
      // Focus input field after boot
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    bootSequence();
  }, []);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Auto-focus input when clicking on terminal
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

  // Helper utility for boot sequence
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Add command and output to history
  const addToHistory = (item: CommandHistoryItem) => {
    setHistory(prev => [...prev, item]);
  };

  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add command to history arrays
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    
    // Process the command
    const cmd = input.trim();
    const output = executeCommand(cmd);
    
    // Add to display history
    addToHistory({
      command: cmd,
      output,
      isError: false
    });
    
    // Clear input
    setInput('');
  };

  // Handle keyboard navigation for command history
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

  // Handle tab completion
  const handleTabCompletion = () => {
    const parts = input.split(' ');
    const lastPart = parts[parts.length - 1];
    
    // Only auto-complete file/directory names
    if (parts.length > 1 || input.endsWith(' ')) {
      const dir = listDirectory();
      if (dir) {
        const possibleMatches = dir.filter(entry => 
          entry.name.startsWith(lastPart) && entry.name !== lastPart
        );
        
        if (possibleMatches.length === 1) {
          // Complete with the single match
          if (parts.length === 1 && !input.endsWith(' ')) {
            setInput(possibleMatches[0].name);
          } else {
            parts[parts.length - 1] = possibleMatches[0].name;
            setInput(parts.join(' '));
          }
        } else if (possibleMatches.length > 1) {
          // Show all possible completions
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

  // Execute command and return output
  const executeCommand = (command: string): React.ReactNode => {
    const [cmd, ...args] = command.split(' ').filter(Boolean);
    
    switch (cmd.toLowerCase()) {
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
          
          return null; // No output on success
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
          
          const content = readFile(args[0]);
          
          if (content === null) {
            return <div className="text-red">cat: {args[0]}: No such file</div>;
          }
          
          return <div className="whitespace-pre-wrap">{content}</div>;
        } catch (error) {
          return <div className="text-red">cat: An error occurred</div>;
        }

      case 'echo':
        return <div>{args.join(' ')}</div>;

      case 'touch':
        try {
          if (!args[0]) {
            return <div className="text-red">touch: missing file operand</div>;
          }
          
          const success = createFile(args[0], '');
          
          if (!success) {
            return <div className="text-yellow">touch: {args[0]}: File already exists</div>;
          }
          
          return null; // No output on success
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
          
          return null; // No output on success
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
          
          return null; // No output on success
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

      // Handle program execution with arguments
      default:
        if (cmd) {
          // Create a new process for the command
          createProcess(cmd);
          
          return <div className="text-red">Command not found: {cmd}</div>;
        }
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Boot progress bar (only shown during boot) */}
      {!bootComplete && (
        <div className="w-full bg-gray-700 h-2 mb-2">
          <div 
            className="bg-green h-full" 
            style={{ width: `${bootProgress}%`, transition: 'width 0.5s ease-in-out' }}
          />
        </div>
      )}
      
      {/* Terminal output area */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
      >
        {history.map((item, i) => (
          <div key={i} className="mb-2">
            {/* Command prompt */}
            {item.command && (
              <div className="flex items-center mb-1">
                <span className="text-green mr-1">user@miniOS</span>
                <span className="text-foreground mr-1">:</span>
                <span className="text-cyan mr-1">{getWorkingDirectoryPath()}</span>
                <span className="text-foreground mr-1">$</span>
                <span className="ml-1">{item.command}</span>
              </div>
            )}
            
            {/* Command output */}
            <div className={`ml-0 ${item.isError ? 'text-red' : ''}`}>
              {item.output}
            </div>
          </div>
        ))}
        
        {/* Current command prompt */}
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
      </div>
    </div>
  );
};

export default Terminal;
