import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const SettingsApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const [wallpaper, setWallpaper] = useState('gradient1');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_settings')
      .select('wallpaper')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.wallpaper) {
          setWallpaper(data.wallpaper);
          window.dispatchEvent(new CustomEvent('webos-wallpaper-change', { detail: data.wallpaper }));
        }
      });
  }, [user]);

  const wallpapers: { id: string; label: string; style: string }[] = [
    { id: 'gradient1', label: 'Deep Space', style: 'bg-gradient-to-br from-[#0f1729] via-[#1a1040] to-[#0f1729]' },
    { id: 'gradient2', label: 'Ocean', style: 'bg-gradient-to-br from-[#0a192f] via-[#0d3b66] to-[#0a192f]' },
    { id: 'gradient3', label: 'Aurora', style: 'bg-gradient-to-br from-[#0f1729] via-[#1a3a2a] to-[#0f1729]' },
    { id: 'gradient4', label: 'Sunset', style: 'bg-gradient-to-br from-[#1a1040] via-[#2d1b3d] to-[#0f1729]' },
  ];

  const handleSelect = async (id: string) => {
    setWallpaper(id);
    window.dispatchEvent(new CustomEvent('webos-wallpaper-change', { detail: id }));
    if (user) {
      await supabase.from('user_settings').update({ wallpaper: id }).eq('user_id', user.id);
    }
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

      {user && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Account</h3>
          <p className="text-xs text-muted-foreground mb-3">{user.email}</p>
          <button
            onClick={signOut}
            className="text-xs px-4 py-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}

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
