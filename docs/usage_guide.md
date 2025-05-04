
# MiniOS - Usage Guide

## Getting Started

When you first launch MiniOS, you'll see a boot sequence that initializes the virtual operating system. After the boot completes, you'll be presented with a terminal interface where you can interact with the system.

The default working directory is `/home/user`, where you'll find some initial files to explore.

## Command Reference

MiniOS supports the following commands:

### File System Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ls` | List directory contents | `ls` or `ls /etc` |
| `cd` | Change directory | `cd /var/log` or `cd ..` |
| `pwd` | Print working directory | `pwd` |
| `cat` | Display file contents | `cat readme.txt` |
| `echo` | Display text or write to file | `echo Hello World` or `echo > file.txt content` |
| `touch` | Create an empty file | `touch newfile.txt` |
| `mkdir` | Create a directory | `mkdir projects` |
| `rm` | Remove files or directories | `rm oldfile.txt` |

### Process Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ps` | Report process status | `ps` |
| `kill` | Terminate a process | `kill 5` |

### System Commands

| Command | Description | Example |
|---------|-------------|---------|
| `sysinfo` | Display system information | `sysinfo` |
| `date` | Show current date and time | `date` |
| `clear` | Clear the terminal screen | `clear` |
| `help` | Display available commands | `help` |
| `clearstorage` | Reset file system to initial state | `clearstorage` |

### File Access Commands

| Command | Description | Example |
|---------|-------------|---------|
| `localfiles` | Access files from your local system | `localfiles` |
| `syncdir` | Connect to a system directory | `syncdir` |
| `pwdreal` | Show connected system directory | `pwdreal` |
| `lsreal` | List files in connected system directory | `lsreal` |

## Example Usage Scenarios

### Basic File Management

```
$ pwd
/home/user

$ ls
notes.txt  readme.txt

$ cat readme.txt
Welcome to miniOS!

This is a simulated mini operating system with a functional CLI.

Available commands:
- ls: List directory contents
...

$ mkdir projects
$ cd projects
$ touch app.js
$ ls
app.js
$ cd ..
$ pwd
/home/user
```

### Process Management

```
$ ps
PID  NAME      STATE    PRI  MEM     CPU%
1    init      running  0    1024 KB 0.5%
2    kernel    running  0    4096 KB 1.2%
3    systemd   running  1    2048 KB 0.3%
...

$ kill 5
Process 5 terminated

$ ps
PID  NAME      STATE    PRI  MEM     CPU%
1    init      running  0    1024 KB 0.5%
2    kernel    running  0    4096 KB 1.2%
3    systemd   running  1    2048 KB 0.3%
...
```

### System Information

```
$ sysinfo
System Information:
CPU Usage: 5.2%
Memory Usage: 28.4%
Disk Usage: 15.7%
Uptime: 2m 15s
System: MiniOS v1.0.0
Kernel: 1.0.0

$ date
Mon May 04 2025 14:30:45 GMT+0000 (Coordinated Universal Time)
```

### Local File Access

```
$ localfiles
Opening file picker...
[Browser file picker opens]

$ lsreal
Listing files in system directory: my-project
NAME          SIZE     TYPE       MODIFIED
index.html    2.5 KB   text/html  5/4/2025, 2:15:30 PM
script.js     1.2 KB   text/javascript  5/4/2025, 2:10:15 PM
styles.css    850 B    text/css   5/4/2025, 1:45:22 PM
...
```

## Tips and Tricks

1. **Command History:** Use the up and down arrow keys to navigate through previously entered commands.

2. **Tab Completion:** Press the Tab key to autocomplete commands and file/directory names.

3. **File System Reset:** If you make mistakes or want to start fresh, use the `clearstorage` command to reset the file system to its initial state.

4. **System Directory Connection:** The `syncdir` command allows you to connect to a directory on your local system, making its files visible within MiniOS.

5. **Console Output:** Commands produce color-coded output to help distinguish between different types of information:
   - Green: Success messages and prompts
   - Cyan: Directory names and paths
   - Yellow: Warnings and informational messages
   - Red: Error messages
