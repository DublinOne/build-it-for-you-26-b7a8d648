export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  showOnDesktop: boolean;
}

export const APP_REGISTRY: AppDefinition[] = [
  { id: 'notepad', title: 'Notepad', icon: '📝', defaultWidth: 600, defaultHeight: 450, showOnDesktop: true },
  { id: 'calculator', title: 'Calculator', icon: '🧮', defaultWidth: 320, defaultHeight: 480, showOnDesktop: true },
  { id: 'file-explorer', title: 'Files', icon: '📁', defaultWidth: 700, defaultHeight: 500, showOnDesktop: true },
  { id: 'terminal', title: 'Terminal', icon: '💻', defaultWidth: 650, defaultHeight: 420, showOnDesktop: true },
  { id: 'settings', title: 'Settings', icon: '⚙️', defaultWidth: 550, defaultHeight: 450, showOnDesktop: true },
  { id: 'task-manager', title: 'Task Manager', icon: '📊', defaultWidth: 600, defaultHeight: 400, showOnDesktop: false },
  { id: 'pixel-paint', title: 'PixelPaint', icon: '🎨', defaultWidth: 750, defaultHeight: 550, showOnDesktop: true },
  { id: 'web-browser', title: 'Browser', icon: '🌐', defaultWidth: 900, defaultHeight: 600, showOnDesktop: true },
  { id: 'media-player', title: 'Media Player', icon: '🎵', defaultWidth: 400, defaultHeight: 300, showOnDesktop: true },
];
