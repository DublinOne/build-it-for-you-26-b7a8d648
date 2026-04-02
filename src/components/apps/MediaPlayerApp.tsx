import React, { useState, useRef } from 'react';

const MediaPlayerApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-6">
        <span className="text-5xl">🎵</span>
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">No Media Loaded</h3>
      <p className="text-xs text-muted-foreground mb-6">Drop audio or video files to play</p>
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground text-lg">⏮</button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="text-muted-foreground hover:text-foreground text-lg">⏭</button>
      </div>
      <div className="w-full mt-6">
        <div className="h-1 bg-secondary rounded-full">
          <div className="h-1 bg-primary rounded-full w-0" />
        </div>
      </div>
    </div>
  );
};

export default MediaPlayerApp;
