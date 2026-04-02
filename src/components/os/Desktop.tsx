import React from 'react';
import { APP_REGISTRY, type AppDefinition } from '@/config/apps';
import { useWindowManager } from '@/contexts/WindowManager';

const Desktop: React.FC = () => {
  const { openWindow } = useWindowManager();

  const desktopApps = APP_REGISTRY.filter(a => a.showOnDesktop);

  const handleLaunch = (app: AppDefinition) => {
    openWindow(app.id, app.title, app.icon, { width: app.defaultWidth, height: app.defaultHeight });
  };

  return (
    <div className="absolute inset-0 p-4 pt-6 pb-16 overflow-hidden">
      <div className="grid grid-cols-1 gap-1 w-fit">
        {desktopApps.map(app => (
          <button
            key={app.id}
            className="desktop-icon w-20"
            onDoubleClick={() => handleLaunch(app)}
          >
            <span className="text-4xl drop-shadow-lg">{app.icon}</span>
            <span className="text-[11px] text-foreground/80 text-center leading-tight drop-shadow">{app.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Desktop;
