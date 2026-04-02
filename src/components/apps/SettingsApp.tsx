import React, { useState } from 'react';

const SettingsApp: React.FC = () => {
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('webos-wallpaper') || 'gradient1');

  const wallpapers: { id: string; label: string; style: string }[] = [
    { id: 'gradient1', label: 'Deep Space', style: 'bg-gradient-to-br from-[#0f1729] via-[#1a1040] to-[#0f1729]' },
    { id: 'gradient2', label: 'Ocean', style: 'bg-gradient-to-br from-[#0a192f] via-[#0d3b66] to-[#0a192f]' },
    { id: 'gradient3', label: 'Aurora', style: 'bg-gradient-to-br from-[#0f1729] via-[#1a3a2a] to-[#0f1729]' },
    { id: 'gradient4', label: 'Sunset', style: 'bg-gradient-to-br from-[#1a1040] via-[#2d1b3d] to-[#0f1729]' },
  ];

  const handleSelect = (id: string) => {
    setWallpaper(id);
    localStorage.setItem('webos-wallpaper', id);
    window.dispatchEvent(new CustomEvent('webos-wallpaper-change', { detail: id }));
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Wallpaper</h3>
        <div className="grid grid-cols-2 gap-3">
          {wallpapers.map(wp => (
            <button
              key={wp.id}
              onClick={() => handleSelect(wp.id)}
              className={`h-20 rounded-xl ${wp.style} border-2 transition-all ${wallpaper === wp.id ? 'border-primary' : 'border-transparent hover:border-border'}`}
            >
              <span className="text-xs text-foreground/70">{wp.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>WebOS DeskFlow v1.0</p>
          <p>Built with React + TypeScript + Tailwind</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
