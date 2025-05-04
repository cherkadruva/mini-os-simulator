
# MiniOS - Technical Specifications

## Technology Stack

MiniOS is built using the following technologies:

### Frontend Framework
- **React 18.3.1**: A JavaScript library for building user interfaces
- **TypeScript**: Adds static typing to JavaScript, enhancing code quality and developer experience

### Styling
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces
- **CSS Animations**: Custom animations for terminal effects and system visualization

### State Management
- **React Hooks**: For component-local state management
- **Context API**: For sharing state between components
- **localStorage API**: For persisting system state between sessions

### UI Components
- **shadcn/ui**: A collection of reusable UI components
- **Lucide React**: SVG icon library
- **Fira Code**: Monospaced font for terminal text

### Routing
- **React Router**: For navigation between different views of the application

### Development Tools
- **Vite**: Next-generation frontend tooling for faster development and optimized builds
- **ESLint**: For code quality and consistency

## System Requirements

### For Users
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions recommended)
- **JavaScript Enabled**: Must have JavaScript enabled in the browser
- **Local Storage Access**: Browser must allow access to localStorage for persistence features
- **Minimum Screen Size**: 800x600 pixels (responsive design supports various screen sizes)

### For Developers
- **Node.js**: v18+ recommended
- **npm** or **yarn**: For package management
- **Git**: For version control

## Project Structure

```
minios/
├── docs/
│   ├── documentation.md
│   ├── implementation_details.md
│   ├── usage_guide.md
│   └── technical_specifications.md
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── placeholder.svg
├── src/
│   ├── components/
│   │   ├── MiniOS.tsx           # Main OS component
│   │   ├── Terminal.tsx         # Terminal interface
│   │   ├── StatusBar.tsx        # System status display
│   │   └── ui/                  # UI components
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── utils/
│   │   ├── fileSystem.ts        # File system implementation
│   │   ├── processManager.ts    # Process management system
│   │   └── systemInfo.ts        # System monitoring utilities
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   ├── pages/                   # Page components
│   ├── App.tsx                  # Main application component
│   ├── index.css                # Global styles
│   └── main.tsx                 # Application entry point
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project overview
```

## Performance Considerations

MiniOS is designed with the following performance optimizations:

1. **Memory Management:**
   - Virtual file system stores only metadata in memory until files are accessed
   - Process simulation uses minimal resources for idle processes
   - Resource cleanup on component unmount

2. **Rendering Optimization:**
   - Terminal output uses virtualized rendering for large outputs
   - Non-visible components use lazy loading
   - Status updates batched to reduce re-renders

3. **Storage Efficiency:**
   - LocalStorage compression for large file systems
   - Incremental updates to persist only changed data
   - Automatic cleanup of old/unused data

## Security Considerations

1. **Data Isolation:**
   - All data is stored locally in the browser
   - No server-side processing or data storage
   - No cross-origin data sharing

2. **File System Limitations:**
   - Browser security prevents direct access to actual file system content
   - Virtual file system is sandboxed within browser storage
   - File operations cannot affect the host system

3. **Input Validation:**
   - All command inputs are validated and sanitized
   - Restricted command execution prevents harmful operations
   - Error boundaries capture and handle unexpected errors

## API Reference

While MiniOS primarily operates as a standalone application, it exposes several internal APIs for extension and customization:

### File System API

```typescript
interface FileSystemAPI {
  listDirectory(path?: string): FileSystemEntry[] | null;
  readFile(name: string): string | null;
  writeFile(name: string, content: string, append?: boolean): boolean;
  createFile(name: string, content?: string): boolean;
  createDirectory(name: string): boolean;
  deleteEntry(name: string): boolean;
  changeDirectory(path: string): boolean;
  getWorkingDirectoryPath(): string;
  resetFileSystem(): void;
}
```

### Process Management API

```typescript
interface ProcessAPI {
  getProcesses(): Process[];
  createProcess(name: string, priority?: number): Process;
  killProcess(pid: number): boolean;
  suspendProcess(pid: number): boolean;
  resumeProcess(pid: number): boolean;
  runProcess(pid: number): boolean;
  fork(parentPid: number): number | null;
  exec(pid: number, programName: string): boolean;
}
```

### System Monitoring API

```typescript
interface SystemInfoAPI {
  getSystemInfo(): SystemInfo;
  formatUptime(seconds: number): string;
}
```

## Browser Compatibility

MiniOS has been tested and confirmed to work on:

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

Mobile browsers are supported, but the terminal experience is optimized for desktop use.

## Core Algorithms

### File System
- **Path Resolution Algorithm**: Converts relative paths to absolute paths
- **Directory Traversal**: Efficiently navigates the file system tree structure
- **Persistence Strategy**: Serializes and deserializes file system to localStorage

### Process Management
- **Round Robin Scheduling**: Allocates CPU time slices to processes in a circular manner
- **Priority-based Scheduling**: Prioritizes higher-priority processes
- **Resource Allocation**: Simulates memory and CPU allocation to processes

### System Monitoring
- **Resource Usage Simulation**: Generates realistic usage patterns
- **Anomaly Detection**: Identifies unusual system behavior
- **Auto-scaling**: Adjusts resource allocation based on system load
