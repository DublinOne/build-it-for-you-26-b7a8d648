import React from 'react';
import NotepadApp from '@/components/apps/NotepadApp';
import CalculatorApp from '@/components/apps/CalculatorApp';
import FileExplorerApp from '@/components/apps/FileExplorerApp';
import TerminalApp from '@/components/apps/TerminalApp';
import SettingsApp from '@/components/apps/SettingsApp';
import TaskManagerApp from '@/components/apps/TaskManagerApp';
import PixelPaintApp from '@/components/apps/PixelPaintApp';
import WebBrowserApp from '@/components/apps/WebBrowserApp';
import MediaPlayerApp from '@/components/apps/MediaPlayerApp';

const APP_COMPONENTS: Record<string, React.FC> = {
  'notepad': NotepadApp,
  'calculator': CalculatorApp,
  'file-explorer': FileExplorerApp,
  'terminal': TerminalApp,
  'settings': SettingsApp,
  'task-manager': TaskManagerApp,
  'pixel-paint': PixelPaintApp,
  'web-browser': WebBrowserApp,
  'media-player': MediaPlayerApp,
};

export const getAppComponent = (appId: string): React.FC | null => {
  return APP_COMPONENTS[appId] || null;
};
