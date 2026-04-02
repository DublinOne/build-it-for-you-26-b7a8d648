import React, { useState } from 'react';

interface FolderItem {
  name: string;
  type: 'folder' | 'file';
  children?: FolderItem[];
  size?: string;
}

const fileSystem: FolderItem[] = [
  {
    name: 'Documents', type: 'folder', children: [
      { name: 'notes.txt', type: 'file', size: '2 KB' },
      { name: 'todo.md', type: 'file', size: '1 KB' },
      { name: 'Work', type: 'folder', children: [
        { name: 'report.pdf', type: 'file', size: '340 KB' },
        { name: 'presentation.pptx', type: 'file', size: '2.1 MB' },
      ]},
    ]
  },
  {
    name: 'Pictures', type: 'folder', children: [
      { name: 'wallpaper.jpg', type: 'file', size: '1.5 MB' },
      { name: 'screenshot.png', type: 'file', size: '890 KB' },
    ]
  },
  {
    name: 'Music', type: 'folder', children: [
      { name: 'track01.mp3', type: 'file', size: '4.2 MB' },
    ]
  },
  { name: 'readme.txt', type: 'file', size: '512 B' },
];

const FileExplorerApp: React.FC = () => {
  const [path, setPath] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const getCurrentItems = (): FolderItem[] => {
    let items = fileSystem;
    for (const p of path) {
      const folder = items.find(i => i.name === p && i.type === 'folder');
      if (folder?.children) items = folder.children;
      else break;
    }
    return items;
  };

  const items = getCurrentItems();

  const navigate = (item: FolderItem) => {
    if (item.type === 'folder') {
      setPath([...path, item.name]);
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30">
        <button
          onClick={() => { setPath(path.slice(0, -1)); setSelected(null); }}
          disabled={path.length === 0}
          className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground hover:bg-secondary disabled:opacity-30"
        >
          ← Back
        </button>
        <div className="flex-1 text-xs text-muted-foreground font-mono-code">
          /{path.join('/')}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {items.map(item => (
            <button
              key={item.name}
              className={`desktop-icon p-3 rounded-lg ${selected === item.name ? 'bg-primary/20 ring-1 ring-primary/40' : ''}`}
              onClick={() => setSelected(item.name)}
              onDoubleClick={() => navigate(item)}
            >
              <span className="text-3xl">{item.type === 'folder' ? '📁' : '📄'}</span>
              <span className="text-xs text-foreground/80 text-center truncate w-full">{item.name}</span>
              {item.size && <span className="text-[10px] text-muted-foreground">{item.size}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorerApp;
