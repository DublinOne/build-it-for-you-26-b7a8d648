import React from 'react';
import { APP_REGISTRY, type AppDefinition } from '@/config/apps';
import { useWindowManager } from '@/contexts/WindowManager';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useWindowManager();

  if (!isOpen) return null;

  const handleLaunch = (app: AppDefinition) => {
    openWindow(app.id, app.title, app.icon, { width: app.defaultWidth, height: app.defaultHeight });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9990]" onClick={onClose} />
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[480px] max-h-[500px] glass-heavy rounded-2xl p-6 z-[9995] animate-slide-up shadow-2xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">All Apps</h2>
        <div className="grid grid-cols-4 gap-3">
          {APP_REGISTRY.map(app => (
            <button
              key={app.id}
              onClick={() => handleLaunch(app)}
              className="desktop-icon hover:bg-secondary/60 rounded-xl p-3"
            >
              <span className="text-3xl">{app.icon}</span>
              <span className="text-xs text-muted-foreground mt-1">{app.title}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default StartMenu;
