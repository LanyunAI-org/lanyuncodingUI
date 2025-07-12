import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

function ActiveSessionsPanel({ activeSessions, onSelectProject, onClose }) {
  const [minimized, setMinimized] = useState(false);

  // Auto-update time display
  const [, setUpdateTrigger] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Get sorted sessions (active first, then by start time)
  const sortedSessions = Object.entries(activeSessions)
    .sort(([, a], [, b]) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return new Date(b.startTime) - new Date(a.startTime);
    });

  // Don't render if no sessions at all
  if (sortedSessions.length === 0) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all ${minimized ? 'w-64' : 'w-96'} z-50`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Active Sessions ({sortedSessions.filter(([, s]) => s.isActive).length})
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={minimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Session List */}
      {!minimized && (
        <div className="max-h-80 overflow-y-auto">
          {sortedSessions.map(([projectId, session]) => (
            <div
              key={projectId}
              className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              onClick={() => onSelectProject(projectId)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      session.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {session.projectName}
                    </h4>
                  </div>
                  
                  {session.status && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {session.status.text || 'Processing...'}
                      </span>
                      {session.status.tokens > 0 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {session.status.tokens.toLocaleString()} tokens
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    {session.startTime ? (
                      <span>Started {formatDistanceToNow(new Date(session.startTime))} ago</span>
                    ) : (
                      <span>Starting...</span>
                    )}
                    {!session.isActive && session.endTime && (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Indicator */}
                {session.isActive && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 relative">
                      <svg className="w-8 h-8 transform -rotate-90">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 14}`}
                          strokeDashoffset={`${2 * Math.PI * 14 * 0.25}`}
                          className="text-blue-500 animate-spin"
                          style={{ animationDuration: '3s' }}
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary when minimized */}
      {minimized && (
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {sortedSessions.filter(([, s]) => s.isActive).length} active, 
              {' '}{sortedSessions.filter(([, s]) => !s.isActive).length} completed
            </span>
            <div className="flex -space-x-2">
              {sortedSessions.slice(0, 3).map(([projectId, session]) => (
                <div
                  key={projectId}
                  className={`w-2 h-2 rounded-full ${
                    session.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
              ))}
              {sortedSessions.length > 3 && (
                <span className="text-xs text-gray-400 ml-2">+{sortedSessions.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveSessionsPanel;