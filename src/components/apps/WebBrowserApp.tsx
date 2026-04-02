import React, { useState } from 'react';

const WebBrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://en.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://en.wikipedia.org');
  const [history, setHistory] = useState<string[]>(['https://en.wikipedia.org']);
  const [histIndex, setHistIndex] = useState(0);

  const navigate = (newUrl: string) => {
    let finalUrl = newUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    const newHistory = [...history.slice(0, histIndex + 1), finalUrl];
    setHistory(newHistory);
    setHistIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (histIndex > 0) {
      const i = histIndex - 1;
      setHistIndex(i);
      setUrl(history[i]);
      setInputUrl(history[i]);
    }
  };

  const goForward = () => {
    if (histIndex < history.length - 1) {
      const i = histIndex + 1;
      setHistIndex(i);
      setUrl(history[i]);
      setInputUrl(history[i]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30">
        <button onClick={goBack} disabled={histIndex <= 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-sm">←</button>
        <button onClick={goForward} disabled={histIndex >= history.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-sm">→</button>
        <button onClick={() => navigate(url)} className="text-muted-foreground hover:text-foreground text-sm">↻</button>
        <form onSubmit={e => { e.preventDefault(); navigate(inputUrl); }} className="flex-1">
          <input
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            className="w-full bg-secondary/50 rounded-md px-3 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary/50"
          />
        </form>
      </div>
      <div className="flex-1">
        <iframe src={url} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin allow-forms" title="browser" />
      </div>
    </div>
  );
};

export default WebBrowserApp;
