import React, { useState, useEffect } from 'react';
import terminalManager from '../utils/terminalManager';

function ActiveTerminalsPanel({ onSelectProject, onClose }) {
  const [activeTerminals, setActiveTerminals] = useState([]);

  useEffect(() => {
    // Load initial terminals
    setActiveTerminals(terminalManager.getActiveTerminals());

    // Subscribe to updates
    const unsubscribe = terminalManager.subscribe((terminals) => {
      setActiveTerminals(terminals);
    });

    return unsubscribe;
  }, []);

  const connectedCount = activeTerminals.filter(t => t.isConnected).length;
  const totalCount = activeTerminals.length;

  const formatTime = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - new Date(date);
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(date).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Active Terminals
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {connectedCount} connected, {totalCount} total
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Terminal List */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTerminals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">No active terminals</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Open a terminal in any project to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTerminals.map((terminal) => (
                <div
                  key={terminal.name}
                  onClick={() => onSelectProject(terminal.name)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${terminal.isConnected 
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          terminal.isConnected ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {terminal.projectName}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {terminal.projectPath}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                        <span>
                          Status: {terminal.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                        {terminal.connectedAt && (
                          <span>
                            Connected: {formatTime(terminal.connectedAt)}
                          </span>
                        )}
                        <span>
                          Active: {formatTime(terminal.lastActivity)}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        {activeTerminals.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Connected</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span>Disconnected</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveTerminalsPanel;