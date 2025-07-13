import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ClipboardAddon } from '@xterm/addon-clipboard';
import { WebglAddon } from '@xterm/addon-webgl';
import 'xterm/css/xterm.css';
import terminalManager from '../utils/terminalManager';

// Global store for terminal sessions to persist across tab/project switches
const terminalSessions = new Map();

function DevTerminal({ selectedProject, isActive }) {
  const terminalRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Use refs to store current session without triggering re-renders
  const currentSessionRef = useRef(null);
  const lastProjectNameRef = useRef(null);

  // Get session key for current project
  const getSessionKey = useCallback(() => {
    return selectedProject ? `dev-terminal-${selectedProject.name}` : null;
  }, [selectedProject]);

  // Save current session to storage
  const saveCurrentSession = useCallback(() => {
    const sessionKey = getSessionKey();
    if (!sessionKey || !currentSessionRef.current) return;
    
    console.log(`Saving terminal session for: ${sessionKey}`);
    terminalSessions.set(sessionKey, {
      ...currentSessionRef.current,
      isConnected: isConnected
    });
  }, [getSessionKey, isConnected]);

  // Load session from storage
  const loadSession = useCallback((sessionKey) => {
    const session = terminalSessions.get(sessionKey);
    if (!session) return null;
    
    console.log(`Loading terminal session for: ${sessionKey}`);
    return session;
  }, []);

  // Initialize or restore terminal
  const initializeTerminal = useCallback(() => {
    if (!terminalRef.current || !selectedProject) return;
    
    const sessionKey = getSessionKey();
    console.log(`Initializing terminal for: ${sessionKey}`);
    
    // Clear any existing terminal in DOM first
    if (terminalRef.current.firstChild) {
      terminalRef.current.innerHTML = '';
    }
    
    const existingSession = loadSession(sessionKey);
    
    // Try to restore existing session
    if (existingSession && existingSession.terminal && !existingSession.terminal._disposed) {
      try {
        console.log(`Restoring existing terminal for: ${sessionKey}`);
        
        // Remove from previous parent if needed
        if (existingSession.terminal.element && existingSession.terminal.element.parentNode) {
          existingSession.terminal.element.parentNode.removeChild(existingSession.terminal.element);
        }
        
        // Reattach to current DOM
        existingSession.terminal.open(terminalRef.current);
        
        // Restore session reference
        currentSessionRef.current = existingSession;
        
        // Restore connection state
        setIsConnected(existingSession.isConnected || false);
        setIsInitialized(true);
        
        // Register with terminal manager
        terminalManager.registerTerminal(
          selectedProject.name,
          selectedProject.fullPath || selectedProject.path,
          existingSession.isConnected || false
        );
        
        // Fit terminal after restore
        setTimeout(() => {
          if (existingSession.fitAddon) {
            existingSession.fitAddon.fit();
          }
        }, 100);
        
        return;
      } catch (error) {
        console.error('Failed to restore terminal:', error);
        terminalSessions.delete(sessionKey);
      }
    }
    
    // Create new terminal
    console.log(`Creating new terminal for: ${sessionKey}`);
    
    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      allowProposedApi: true,
      allowTransparency: false,
      convertEol: true,
      scrollback: 10000,
      tabStopWidth: 4,
      windowsMode: false,
      macOptionIsMeta: true,
      macOptionClickForcesSelection: false,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#ffffff',
        cursorAccent: '#1e1e1e',
        selection: '#264f78',
        selectionForeground: '#ffffff',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#ffffff'
      }
    });
    
    const fitAddon = new FitAddon();
    const clipboardAddon = new ClipboardAddon();
    const webglAddon = new WebglAddon();
    
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(clipboardAddon);
    
    try {
      terminal.loadAddon(webglAddon);
    } catch (error) {
      console.log('WebGL addon not supported');
    }
    
    terminal.open(terminalRef.current);
    
    // Handle terminal input
    terminal.onData((data) => {
      if (currentSessionRef.current?.ws?.readyState === WebSocket.OPEN) {
        currentSessionRef.current.ws.send(JSON.stringify({
          type: 'input',
          data: data
        }));
      }
    });
    
    // Handle keyboard shortcuts
    terminal.attachCustomKeyEventHandler((event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && terminal.hasSelection()) {
        document.execCommand('copy');
        return false;
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        navigator.clipboard.readText().then(text => {
          if (currentSessionRef.current?.ws?.readyState === WebSocket.OPEN) {
            currentSessionRef.current.ws.send(JSON.stringify({
              type: 'input',
              data: text
            }));
          }
        }).catch(err => {
          console.error('Failed to read clipboard:', err);
        });
        return false;
      }
      
      return true;
    });
    
    // Store new session
    currentSessionRef.current = {
      terminal,
      fitAddon,
      ws: null
    };
    
    // Save to storage
    terminalSessions.set(sessionKey, currentSessionRef.current);
    
    // Register with terminal manager
    terminalManager.registerTerminal(
      selectedProject.name,
      selectedProject.fullPath || selectedProject.path,
      false
    );
    
    // Fit terminal
    setTimeout(() => fitAddon.fit(), 100);
    
    setIsInitialized(true);
  }, [selectedProject, getSessionKey, loadSession]);

  // Connect WebSocket
  const connectWebSocket = useCallback(async () => {
    if (!currentSessionRef.current || !selectedProject || isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        console.error('No authentication token found');
        setIsConnecting(false);
        return;
      }
      
      // Get WebSocket URL
      let wsBaseUrl;
      try {
        const configResponse = await fetch('/api/config', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const config = await configResponse.json();
        wsBaseUrl = config.wsUrl;
        
        if (wsBaseUrl.includes('localhost') && !window.location.hostname.includes('localhost')) {
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const apiPort = window.location.port === '3001' ? '3002' : window.location.port;
          wsBaseUrl = `${protocol}//${window.location.hostname}:${apiPort}`;
        }
      } catch (error) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const apiPort = window.location.port === '3001' ? '3002' : window.location.port;
        wsBaseUrl = `${protocol}//${window.location.hostname}:${apiPort}`;
      }
      
      const wsUrl = `${wsBaseUrl}/terminal?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log(`WebSocket connected for project: ${selectedProject.name}`);
        setIsConnected(true);
        setIsConnecting(false);
        
        // Store WebSocket in session
        if (currentSessionRef.current) {
          currentSessionRef.current.ws = ws;
        }
        
        // Send init message
        ws.send(JSON.stringify({
          type: 'init',
          projectPath: selectedProject.fullPath || selectedProject.path
        }));
        
        // Update stored session
        saveCurrentSession();
        
        // Update terminal manager
        terminalManager.updateTerminalStatus(selectedProject.name, true);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'output' && currentSessionRef.current?.terminal) {
            currentSessionRef.current.terminal.write(data.data);
          } else if (data.type === 'exit') {
            if (currentSessionRef.current?.terminal) {
              currentSessionRef.current.terminal.write(
                `\r\n\x1b[33mTerminal exited with code ${data.exitCode}\x1b[0m\r\n`
              );
            }
            disconnectFromTerminal();
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };
      
      ws.onclose = () => {
        console.log(`WebSocket closed for project: ${selectedProject.name}`);
        setIsConnected(false);
        setIsConnecting(false);
        
        // Clear WebSocket from session
        if (currentSessionRef.current) {
          currentSessionRef.current.ws = null;
        }
        
        // Clear terminal
        if (currentSessionRef.current?.terminal) {
          currentSessionRef.current.terminal.clear();
          currentSessionRef.current.terminal.write('\x1b[2J\x1b[H');
        }
        
        // Update stored session
        saveCurrentSession();
        
        // Update terminal manager
        terminalManager.updateTerminalStatus(selectedProject.name, false);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setIsConnecting(false);
      };
      
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, [selectedProject, isConnecting, saveCurrentSession]);

  // Connect to terminal
  const connectToTerminal = useCallback(() => {
    if (!isInitialized || isConnected || isConnecting) return;
    connectWebSocket();
  }, [isInitialized, isConnected, isConnecting, connectWebSocket]);

  // Disconnect from terminal
  const disconnectFromTerminal = useCallback(() => {
    console.log(`Disconnecting terminal for project: ${selectedProject?.name}`);
    
    if (currentSessionRef.current?.ws) {
      currentSessionRef.current.ws.close();
      currentSessionRef.current.ws = null;
    }
    
    if (currentSessionRef.current?.terminal) {
      currentSessionRef.current.terminal.clear();
      currentSessionRef.current.terminal.write('\x1b[2J\x1b[H');
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    
    // Update stored session
    saveCurrentSession();
    
    // Update terminal manager
    if (selectedProject) {
      terminalManager.updateTerminalStatus(selectedProject.name, false);
    }
  }, [selectedProject, saveCurrentSession]);

  // Restart terminal
  const restartTerminal = useCallback(() => {
    const sessionKey = getSessionKey();
    if (!sessionKey) return;
    
    console.log(`Restarting terminal for: ${sessionKey}`);
    
    // Disconnect current session
    disconnectFromTerminal();
    
    // Remove from storage
    terminalSessions.delete(sessionKey);
    
    // Clear current session
    if (currentSessionRef.current?.terminal) {
      currentSessionRef.current.terminal.dispose();
    }
    currentSessionRef.current = null;
    
    // Reset states
    setIsInitialized(false);
    
    // Re-initialize after a short delay
    setTimeout(() => {
      initializeTerminal();
    }, 100);
  }, [getSessionKey, disconnectFromTerminal, initializeTerminal]);

  // Handle project changes
  useEffect(() => {
    if (!selectedProject) return;
    
    const currentProjectName = selectedProject.name;
    const lastProjectName = lastProjectNameRef.current;
    
    // If project changed
    if (lastProjectName !== currentProjectName) {
      console.log(`Project changed from ${lastProjectName} to ${currentProjectName}`);
      
      // Save current session before switching
      if (lastProjectName && currentSessionRef.current) {
        const oldSessionKey = `dev-terminal-${lastProjectName}`;
        console.log(`Saving session for old project: ${oldSessionKey}`);
        terminalSessions.set(oldSessionKey, {
          ...currentSessionRef.current,
          isConnected: isConnected
        });
        
        // Update terminal manager for old project
        terminalManager.updateTerminalStatus(lastProjectName, isConnected);
      }
      
      // Clear current session reference
      currentSessionRef.current = null;
      
      // Update last project name
      lastProjectNameRef.current = currentProjectName;
      
      // Reset states for new project
      setIsInitialized(false);
      setIsConnected(false);
      
      // Initialize terminal for new project after a short delay
      setTimeout(() => {
        initializeTerminal();
      }, 100);
    }
  }, [selectedProject?.name]); // Only depend on project name

  // Handle tab visibility
  useEffect(() => {
    if (!isActive || !isInitialized || !currentSessionRef.current?.fitAddon) return;
    
    // Fit terminal when tab becomes active
    setTimeout(() => {
      if (currentSessionRef.current?.fitAddon) {
        currentSessionRef.current.fitAddon.fit();
      }
    }, 100);
  }, [isActive, isInitialized]);

  // Handle window resize
  useEffect(() => {
    if (!isConnected || !currentSessionRef.current) return;
    
    const handleResize = () => {
      if (currentSessionRef.current?.fitAddon && currentSessionRef.current?.ws?.readyState === WebSocket.OPEN) {
        currentSessionRef.current.fitAddon.fit();
        const dimensions = currentSessionRef.current.fitAddon.proposeDimensions();
        if (dimensions) {
          currentSessionRef.current.ws.send(JSON.stringify({
            type: 'resize',
            cols: dimensions.cols,
            rows: dimensions.rows
          }));
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isConnected]);

  // Handle resize observer
  useEffect(() => {
    if (!terminalRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (currentSessionRef.current?.fitAddon) {
        setTimeout(() => {
          currentSessionRef.current.fitAddon.fit();
        }, 50);
      }
    });
    
    resizeObserver.observe(terminalRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // If we have a current session, update its status before unmounting
      if (selectedProject && currentSessionRef.current) {
        terminalManager.updateTerminalStatus(selectedProject.name, isConnected);
      }
    };
  }, [selectedProject, isConnected]);

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Select a Project</h3>
          <p>Choose a project to open a development terminal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-300">
              Development Terminal - {selectedProject.displayName}
            </span>
            {!isInitialized && (
              <span className="text-xs text-yellow-400">(Initializing...)</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {isConnected && (
              <button
                onClick={disconnectFromTerminal}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 flex items-center space-x-1"
                title="Disconnect from terminal"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Disconnect</span>
              </button>
            )}
            
            <button
              onClick={restartTerminal}
              disabled={isConnected}
              className="text-xs text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              title="Restart Terminal (disconnect first)"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Restart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 p-2 overflow-hidden relative">
        <div ref={terminalRef} className="h-full w-full" />
        
        {/* Loading state */}
        {!isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
            <div className="text-white">Loading terminal...</div>
          </div>
        )}
        
        {/* Connect button when not connected */}
        {isInitialized && !isConnected && !isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 p-4">
            <div className="text-center max-w-sm w-full">
              <button
                onClick={connectToTerminal}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-base font-medium w-full sm:w-auto"
                title="Connect to terminal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Start Terminal</span>
              </button>
              <p className="text-gray-400 text-sm mt-3 px-2">
                Launch a terminal in {selectedProject.displayName}
              </p>
            </div>
          </div>
        )}
        
        {/* Connecting state */}
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 p-4">
            <div className="text-center max-w-sm w-full">
              <div className="flex items-center justify-center space-x-3 text-yellow-400">
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
                <span className="text-base font-medium">Connecting to terminal...</span>
              </div>
              <p className="text-gray-400 text-sm mt-3 px-2">
                Starting terminal in {selectedProject.displayName}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DevTerminal;