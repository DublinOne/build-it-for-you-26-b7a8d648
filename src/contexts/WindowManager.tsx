import React, { createContext, useContext, useState, useCallback } from 'react';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

interface WindowManagerContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (appId: string, title: string, icon: string, opts?: Partial<WindowState>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

let nextZIndex = 10;
let windowCounter = 0;

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = useCallback((appId: string, title: string, icon: string, opts?: Partial<WindowState>) => {
    const id = `window-${windowCounter++}`;
    const offset = (windows.length % 8) * 30;
    const newWindow: WindowState = {
      id,
      appId,
      title,
      icon,
      x: 100 + offset,
      y: 60 + offset,
      width: opts?.width || 700,
      height: opts?.height || 500,
      minWidth: opts?.minWidth || 300,
      minHeight: opts?.minHeight || 200,
      zIndex: nextZIndex++,
      isMinimized: false,
      isMaximized: false,
      ...opts,
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
  }, [windows.length]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex++, isMinimized: false } : w));
    setActiveWindowId(id);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: true, zIndex: nextZIndex++ } : w));
    setActiveWindowId(id);
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: false, zIndex: nextZIndex++ } : w));
    setActiveWindowId(id);
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  }, []);

  return (
    <WindowManagerContext.Provider value={{
      windows, activeWindowId, openWindow, closeWindow, focusWindow,
      minimizeWindow, maximizeWindow, restoreWindow, updateWindowPosition, updateWindowSize,
    }}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return ctx;
};
