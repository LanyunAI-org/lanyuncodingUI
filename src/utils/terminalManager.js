// Global terminal state management
class TerminalManager {
  constructor() {
    this.activeTerminals = new Map();
    this.listeners = new Set();
  }

  // Register a terminal connection
  registerTerminal(projectName, projectPath, isConnected = false) {
    const terminalInfo = {
      projectName,
      projectPath,
      isConnected,
      connectedAt: isConnected ? new Date() : null,
      lastActivity: new Date()
    };
    
    this.activeTerminals.set(projectName, terminalInfo);
    this.notifyListeners();
    
    console.log(`Terminal registered for project: ${projectName}, connected: ${isConnected}`);
  }

  // Update terminal connection status
  updateTerminalStatus(projectName, isConnected) {
    const terminal = this.activeTerminals.get(projectName);
    if (terminal) {
      terminal.isConnected = isConnected;
      terminal.connectedAt = isConnected ? new Date() : terminal.connectedAt;
      terminal.lastActivity = new Date();
      this.notifyListeners();
      
      console.log(`Terminal status updated for ${projectName}: ${isConnected ? 'connected' : 'disconnected'}`);
    }
  }

  // Remove a terminal
  removeTerminal(projectName) {
    this.activeTerminals.delete(projectName);
    this.notifyListeners();
    
    console.log(`Terminal removed for project: ${projectName}`);
  }

  // Get all active terminals
  getActiveTerminals() {
    return Array.from(this.activeTerminals.entries()).map(([name, info]) => ({
      name,
      ...info
    }));
  }

  // Get connected terminals only
  getConnectedTerminals() {
    return this.getActiveTerminals().filter(terminal => terminal.isConnected);
  }

  // Subscribe to terminal changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getActiveTerminals()));
  }
}

// Create singleton instance
const terminalManager = new TerminalManager();

export default terminalManager;