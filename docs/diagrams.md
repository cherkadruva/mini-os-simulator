
# MiniOS - System Diagrams

## Block Diagram

```
+-------------------------------------------------------------+
|                    EDUCATIONAL CHALLENGES                    |
|                                                             |
|  +-------------------+    +-------------------+             |
|  |  Accessibility    |    |    Learning       |             |
|  |    Barriers       |    | Curve Complexity  |             |
|  +-------------------+    +-------------------+             |
|                                                             |
|  +-------------------+    +-------------------+             |
|  |   Visualization   |    | Risk of System    |             |
|  |   Difficulties    |    |     Damage        |             |
|  +-------------------+    +-------------------+             |
|                                                             |
|  +-------------------+    +-------------------+             |
|  |    Limited        |    | Immediate         |             |
|  |   Interactivity   |    | Feedback Gap      |             |
|  +-------------------+    +-------------------+             |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                         MiniOS                              |
|                                                             |
|  +-------------------+    +-------------------+             |
|  |  Browser-Based    |    |    Interactive    |             |
|  |  Accessibility    |    |    User Interface |             |
|  +-------------------+    +-------------------+             |
|                                                             |
|  +---------------------------------------------------+      |
|  |                  Core Subsystems                  |      |
|  |                                                   |      |
|  |  +-----------+  +-----------+  +-------------+   |      |
|  |  |   File    |  |  Process  |  |   System    |   |      |
|  |  |  System   |  | Management|  |  Monitoring |   |      |
|  |  +-----------+  +-----------+  +-------------+   |      |
|  |                                                   |      |
|  +---------------------------------------------------+      |
|                                                             |
|  +-------------------+    +-------------------+             |
|  |   Educational     |    |     Safe          |             |
|  |    Scaffolding    |    |  Experimentation  |             |
|  +-------------------+    +-------------------+             |
+-------------------------------------------------------------+
```

This block diagram illustrates the problem statement of traditional operating systems education challenges and how MiniOS addresses them through its browser-based interface, core subsystems, and educational features.

The top section represents the challenges in traditional OS education, while the bottom section shows how MiniOS solves these problems through its various components and features.

## Flow Diagram

```
+----------------+     +----------------+     +----------------+
| User Loads     |     | MiniOS Boot    |     | Terminal       |
| Webpage        | --> | Sequence       | --> | Interface      |
|                |     | Initializes    |     | Appears        |
+----------------+     +----------------+     +----------------+
                                                     |
                                                     v
+----------------+     +----------------+     +----------------+
| Command        |     | Command Parser |     | User Enters    |
| Output         | <-- | Processes      | <-- | Command        |
| Displayed      |     | Input          |     |                |
+----------------+     +----------------+     +----------------+
        |                     ^                     ^
        |                     |                     |
        v                     v                     v
+---------------------------------------------------------------+
|                    Subsystem Processing                        |
|                                                               |
| +------------+    +---------------+    +----------------+     |
| | File System |    | Process       |    | System         |    |
| | Operations  |    | Management    |    | Monitoring     |    |
| +------------+    +---------------+    +----------------+     |
|                                                               |
+---------------------------------------------------------------+
```

This flow diagram outlines the user interaction flow with MiniOS, from loading the webpage to executing commands and receiving output. The diagram shows how user inputs are processed by the command parser, which then leverages various subsystems to execute the requested operations before displaying the output back to the user.

## Data Flow Diagram

```
+----------------+     +----------------+     +----------------+
| User Input     |     | Command        |     | Command        |
| (Terminal      | --> | Parser         | --> | Executor       |
| Interface)     |     |                |     |                |
+----------------+     +----------------+     +----------------+
                                |
                                v
              +--------------------------------+
              |     Subsystem Selection        |
              +--------------------------------+
                  |            |            |
                  v            v            v
  +----------------+  +----------------+  +----------------+
  | File System    |  | Process        |  | System         |
  | Manager        |  | Manager        |  | Monitor        |
  |                |  |                |  |                |
  +----------------+  +----------------+  +----------------+
        |                   |                   |
        v                   v                   v
  +----------------+  +----------------+  +----------------+
  | Local Storage  |  | Process Table  |  | Resource       |
  | (Persistence)  |  | (Memory)       |  | Metrics        |
  |                |  |                |  |                |
  +----------------+  +----------------+  +----------------+
                  \           |           /
                   \          |          /
                    v         v         v
               +---------------------------+
               | Terminal Output Generator |
               +---------------------------+
                           |
                           v
               +---------------------------+
               | User Display              |
               | (Terminal Interface)      |
               +---------------------------+
```

This data flow diagram illustrates how data moves through the MiniOS system, from user input to subsystem processing and back to the user display. It shows the relationships between different components and how they interact to process commands and produce output.
