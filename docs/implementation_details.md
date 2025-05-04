
# MiniOS - Implementation Details

## Core Components

### File System Implementation

MiniOS implements a virtual file system that mimics Unix-like file systems with the following features:

1. **Hierarchical Structure:** 
   - Root-based directory tree with nested folders and files
   - Path resolution supporting both absolute and relative paths

2. **Persistence Layer:**
   - Uses browser's localStorage API to persist file system state between sessions
   - File system structure is serialized to JSON for storage
   - Automatic loading on application initialization

3. **File Operations:**
   - Create files (`touch`)
   - Read file contents (`cat`)
   - Write to files (`echo > file`)
   - Append to files (`echo >> file`)
   - Delete files (`rm`)
   - Create directories (`mkdir`)
   - Navigate directories (`cd`)
   - List directory contents (`ls`)

4. **Path Management:**
   - Current working directory tracking
   - Path normalization and resolution
   - Support for special paths (`.`, `..`, `/`)

5. **File Attributes:**
   - Size tracking
   - Creation and modification timestamps
   - Simulated permissions

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
```

### Process Management

The process management system simulates operating system process handling with:

1. **Process States:**
   - Running: Currently executed by the CPU
   - Ready: Waiting to be executed
   - Blocked: Waiting for resources or I/O
   - Terminated: Completed execution

2. **Scheduling Algorithms:**
   - **Round Robin:** Rotates execution among processes, giving each a time slice
   - **First-In-First-Out (FIFO):** Executes processes in order of arrival

3. **Process Control:**
   - Process creation with PID assignment
   - Process termination with resource reclamation
   - Process suspension and resumption
   - Process information retrieval

4. **System Calls:**
   - `fork()`: Create a child process
   - `exec()`: Replace process with a new program
   - `kill()`: Terminate a process

5. **Resource Tracking:**
   - CPU usage simulation
   - Memory allocation tracking
   - Process priority levels
   - Process start time and duration

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
```

### System Monitoring

The system monitoring component tracks and updates simulated system resources:

1. **Resource Metrics:**
   - CPU utilization percentage
   - Memory usage percentage
   - Disk space utilization
   - System uptime

2. **Real-time Updates:**
   - Periodic polling for resource updates
   - Gradual randomized changes to simulate workload fluctuations
   - Time-based metric calculations

3. **Status Visualization:**
   - Status bar with current metrics
   - Formatted uptime display
   - Resource utilization history

### Terminal Interface

The Terminal component serves as the user interface to the simulated operating system:

1. **Command Processing:**
   - Command parsing and argument extraction
   - Command execution and output generation
   - Error handling and display

2. **User Experience Features:**
   - Command history navigation
   - Tab completion for commands and paths
   - Error messages with color coding
   - Boot sequence animation

3. **I/O Handling:**
   - Text input handling
   - Formatted output display
   - Support for command output styling

4. **File Integration:**
   - Local file system access
   - Directory synchronization support
   - File metadata display

## Technical Architecture

MiniOS follows a component-based architecture with clear separation of concerns:

1. **Core Components:**
   - `MiniOS.tsx`: Main container component
   - `Terminal.tsx`: Command interface
   - `StatusBar.tsx`: System metrics display

2. **Utility Services:**
   - `fileSystem.ts`: Virtual file system operations
   - `processManager.ts`: Process handling and scheduling
   - `systemInfo.ts`: System resource tracking

3. **Type Definitions:**
   - `types/index.ts`: Shared interfaces and types

4. **Styling:**
   - `index.css`: Global styles and theme variables

5. **Initialization Flow:**
   - System boot sequence simulation
   - Subsystem initialization
   - Command environment setup

This modular approach allows the system to be extended with additional operating system features while maintaining a clean separation between the user interface and the underlying simulated OS functionality.
