
# MiniOS - Educational Operating System Simulator

## Introduction

MiniOS is an interactive web-based operating system simulator designed for educational purposes. It provides a realistic terminal interface and simulates core operating system components including a file system, process management, and system resource monitoring. The project serves as a hands-on learning tool for students studying operating systems concepts, allowing them to interact with and visualize abstract OS principles through a familiar command-line interface.

Built with modern web technologies like React and TypeScript, MiniOS bridges the gap between theoretical knowledge and practical application by offering a safe, accessible environment for exploring operating system functionality without the complexities of setting up actual operating systems or virtual machines. The simulator runs entirely in a web browser, making it accessible across different platforms and devices without installation requirements.

## Problem Statement

Traditional operating systems education faces several challenges:

1. **Accessibility Barriers:** Setting up real operating system environments or virtual machines requires significant technical knowledge and resources that may not be available to all students.

2. **Learning Curve Complexity:** The steep learning curve associated with actual operating system internals can overwhelm beginners and detract from the core concepts being taught.

3. **Visualization Difficulties:** Many operating system concepts are abstract and difficult to visualize, making comprehension challenging for visual learners.

4. **Risk of System Damage:** Experimenting with actual operating system components carries the risk of system instability or data loss, discouraging exploration.

5. **Limited Interactivity:** Traditional textbook learning lacks the interactivity needed to fully engage with operating system concepts.

6. **Immediate Feedback Gap:** Students often lack immediate feedback on their understanding of operating system operations and commands.

MiniOS addresses these challenges by providing a sandbox environment that simulates operating system functionality in an accessible, risk-free manner while maintaining educational fidelity to real operating system principles.

## Overview

MiniOS is architected around three core components that simulate fundamental operating system functionalities:

### 1. File System Simulation
- Implements a hierarchical directory structure with files and folders
- Supports standard file operations (create, read, write, delete)
- Persists data using browser localStorage for session continuity
- Demonstrates file system traversal and path resolution concepts

### 2. Process Management
- Simulates process creation, termination, and state transitions
- Implements simplified scheduling algorithms (Round Robin, FIFO)
- Displays process statistics including memory and CPU usage
- Demonstrates process control commands and system calls

### 3. System Monitoring
- Tracks simulated system resources (CPU, memory, disk usage)
- Provides real-time updates of system metrics
- Implements an uptime counter and system information display
- Visualizes resource utilization over time

The user interacts with these components through a terminal interface that accepts Unix-like commands, parses them, and produces appropriate responses. The terminal also includes features like command history, tab completion, and boot sequence simulation to enhance the realism of the experience.

MiniOS has been developed with educational scaffolding in mind, gradually introducing complexity and providing clear feedback to reinforce learning objectives.

## Goals

MiniOS was developed with the following primary goals:

1. **Educational Value:** Create an intuitive tool that effectively demonstrates core operating system concepts including process management, file systems, and resource allocation in a way that reinforces classroom learning.

2. **Accessibility:** Provide a platform-independent, browser-based environment that requires no special hardware, software installation, or configuration, making it accessible to students with varying technical resources.

3. **Hands-on Experience:** Offer practical, interactive experience with operating system commands and concepts without the risks associated with experimenting on actual systems.

4. **Concept Visualization:** Transform abstract operating system principles into visible, interactive elements that help students visualize complex concepts like process scheduling and file system hierarchies.

5. **Extensibility:** Design a modular system that can be extended with additional operating system features and concepts as educational needs evolve.

6. **Persistence:** Implement data persistence mechanisms that allow users to save their work across sessions, enabling longer-term projects and experimentation.

7. **Algorithm Demonstration:** Showcase practical implementations of common operating system algorithms like Round Robin scheduling to connect theoretical knowledge with practical application.

Through these goals, MiniOS aims to serve as a complementary tool to traditional operating systems education, bridging the gap between theory and practice by providing a safe space for experimentation and learning.
