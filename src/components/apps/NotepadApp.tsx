import React, { useState } from 'react';

const NotepadApp: React.FC = () => {
  const [text, setText] = useState(() => localStorage.getItem('webos-notepad') || '');
  const [saved, setSaved] = useState(true);

  const handleChange = (val: string) => {
    setText(val);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('webos-notepad', text);
    setSaved(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/30">
        <button onClick={handleSave} className="text-xs px-3 py-1 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
          Save
        </button>
        <button onClick={() => { setText(''); setSaved(false); }} className="text-xs px-3 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors">
          Clear
        </button>
        <span className="text-xs text-muted-foreground ml-auto">{saved ? 'Saved' : 'Unsaved'}</span>
      </div>
      <textarea
        value={text}
        onChange={e => handleChange(e.target.value)}
        className="flex-1 w-full bg-transparent p-4 text-sm font-mono-code text-foreground resize-none outline-none"
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
};

export default NotepadApp;
