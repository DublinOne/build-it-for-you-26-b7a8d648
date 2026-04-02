import React from 'react';
import { useWindowManager } from '@/contexts/WindowManager';

const TaskManagerApp: React.FC = () => {
  const { windows, closeWindow, focusWindow } = useWindowManager();

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/30">
        <h3 className="text-sm font-semibold text-foreground">Running Processes</h3>
      </div>
      <div className="flex-1 overflow-auto">
        {windows.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No processes running
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b border-border/30">
                <th className="text-left px-4 py-2">App</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-right px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {windows.map(win => (
                <tr key={win.id} className="border-b border-border/20 hover:bg-secondary/30 cursor-pointer" onClick={() => focusWindow(win.id)}>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <span>{win.icon}</span>
                    <span className="text-foreground">{win.title}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${win.isMinimized ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                      {win.isMinimized ? 'Minimized' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                      className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30"
                    >
                      End
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TaskManagerApp;
