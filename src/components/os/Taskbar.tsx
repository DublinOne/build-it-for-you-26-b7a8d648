import React, { useState } from 'react';
import { useWindowManager } from '@/contexts/WindowManager';
import { APP_REGISTRY } from '@/config/apps';

interface TaskbarProps {
  onStartMenuToggle: () => void;
  startMenuOpen: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({ onStartMenuToggle, startMenuOpen }) => {
  const { windows, focusWindow, activeWindowId } = useWindowManager();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 glass-heavy flex items-center px-4 z-[9999]">
      {/* Start button */}
      <button
        onClick={onStartMenuToggle}
        className={`dock-icon bg-primary/20 hover:bg-primary/30 text-primary mr-2 ${startMenuOpen ? 'bg-primary/30' : ''}`}
        style={{ transform: 'none' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="1" y="1" width="8" height="8" rx="1.5" />
          <rect x="11" y="1" width="8" height="8" rx="1.5" />
          <rect x="1" y="11" width="8" height="8" rx="1.5" />
          <rect x="11" y="11" width="8" height="8" rx="1.5" />
        </svg>
      </button>

      {/* Open windows in dock */}
      <div className="flex-1 flex items-center justify-center gap-1">
        {windows.map(win => {
          const app = APP_REGISTRY.find(a => a.id === win.appId);
          const isActive = activeWindowId === win.id;
          return (
            <button
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className={`dock-icon text-lg ${isActive ? 'bg-primary/20' : 'bg-secondary/50 hover:bg-secondary/80'}`}
              title={win.title}
              style={{ transform: 'none' }}
            >
              <span className="text-xl">{win.icon}</span>
              {isActive && <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      {/* Clock */}
      <div className="text-xs text-muted-foreground text-right leading-tight">
        <div>{timeStr}</div>
        <div>{dateStr}</div>
      </div>
    </div>
  );
};

export default Taskbar;
