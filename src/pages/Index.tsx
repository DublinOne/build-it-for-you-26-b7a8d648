import React, { useState, useEffect } from 'react';
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManager';
import Window from '@/components/os/Window';
import Desktop from '@/components/os/Desktop';
import Taskbar from '@/components/os/Taskbar';
import StartMenu from '@/components/os/StartMenu';
import { getAppComponent } from '@/components/apps/AppRegistry';

const WALLPAPERS: Record<string, string> = {
  gradient1: 'bg-gradient-to-br from-[#0f1729] via-[#1a1040] to-[#0f1729]',
  gradient2: 'bg-gradient-to-br from-[#0a192f] via-[#0d3b66] to-[#0a192f]',
  gradient3: 'bg-gradient-to-br from-[#0f1729] via-[#1a3a2a] to-[#0f1729]',
  gradient4: 'bg-gradient-to-br from-[#1a1040] via-[#2d1b3d] to-[#0f1729]',
};

const OSContent: React.FC = () => {
  const { windows } = useWindowManager();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('webos-wallpaper') || 'gradient1');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setWallpaper(detail);
    };
    window.addEventListener('webos-wallpaper-change', handler);
    return () => window.removeEventListener('webos-wallpaper-change', handler);
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden select-none ${WALLPAPERS[wallpaper] || WALLPAPERS.gradient1}`}>
      <Desktop />

      {windows.map(win => {
        const AppComponent = getAppComponent(win.appId);
        if (!AppComponent) return null;
        return (
          <Window key={win.id} window={win}>
            <AppComponent />
          </Window>
        );
      })}

      <StartMenu isOpen={startMenuOpen} onClose={() => setStartMenuOpen(false)} />
      <Taskbar onStartMenuToggle={() => setStartMenuOpen(!startMenuOpen)} startMenuOpen={startMenuOpen} />
    </div>
  );
};

const Index: React.FC = () => (
  <WindowManagerProvider>
    <OSContent />
  </WindowManagerProvider>
);

export default Index;
