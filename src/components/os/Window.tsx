import React, { useCallback, useRef, useState } from 'react';
import { useWindowManager, type WindowState } from '@/contexts/WindowManager';

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ window: win, children }) => {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, restoreWindow, updateWindowPosition, updateWindowSize, activeWindowId } = useWindowManager();
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; winW: number; winH: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isActive = activeWindowId === win.id;

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    e.preventDefault();
    focusWindow(win.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };
    setIsDragging(true);

    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      updateWindowPosition(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy);
    };
    const onUp = () => {
      dragRef.current = null;
      setIsDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [win.id, win.x, win.y, win.isMaximized, focusWindow, updateWindowPosition]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, winW: win.width, winH: win.height };

    const onMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const dw = e.clientX - resizeRef.current.startX;
      const dh = e.clientY - resizeRef.current.startY;
      const newW = Math.max(win.minWidth, resizeRef.current.winW + dw);
      const newH = Math.max(win.minHeight, resizeRef.current.winH + dh);
      updateWindowSize(win.id, newW, newH);
    };
    const onUp = () => {
      resizeRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [win.id, win.width, win.height, win.minWidth, win.minHeight, win.isMaximized, focusWindow, updateWindowSize]);

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 48, zIndex: win.zIndex }
    : { position: 'absolute', top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      style={style}
      className={`flex flex-col rounded-xl overflow-hidden glass-heavy shadow-2xl animate-window-open ${isActive ? 'ring-1 ring-primary/30' : ''}`}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        className={`flex items-center h-10 px-3 shrink-0 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleDragStart}
        onDoubleClick={() => win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-2 mr-3">
          <button onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
            className="traffic-light bg-[#FF5F57] hover:bg-[#FF5F57]" />
          <button onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
            className="traffic-light bg-[#FEBC2E] hover:bg-[#FEBC2E]" />
          <button onClick={(e) => { e.stopPropagation(); win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id); }}
            className="traffic-light bg-[#28C840] hover:bg-[#28C840]" />
        </div>
        <div className="flex-1 text-center text-sm font-medium text-muted-foreground truncate">
          {win.title}
        </div>
        <div className="w-16" /> {/* Spacer to balance traffic lights */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-os-bg/80">
        {children}
      </div>

      {/* Resize handle */}
      {!win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default Window;
