import React, { useState, useRef, useEffect } from 'react';

interface TermLine {
  type: 'input' | 'output';
  text: string;
}

const COMMANDS: Record<string, (args: string[]) => string> = {
  help: () => 'Available commands: help, echo, date, whoami, clear, ls, pwd, uname, neofetch',
  echo: (args) => args.join(' '),
  date: () => new Date().toString(),
  whoami: () => 'user@webos',
  pwd: () => '/home/user',
  uname: () => 'WebOS 1.0.0 (browser)',
  ls: () => 'Documents  Pictures  Music  readme.txt',
  neofetch: () => `
  ██╗    ██╗███████╗██████╗  ██████╗ ███████╗
  ██║    ██║██╔════╝██╔══██╗██╔═══██╗██╔════╝
  ██║ █╗ ██║█████╗  ██████╔╝██║   ██║███████╗
  ██║███╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║
  ╚███╔███╔╝███████╗██████╔╝╚██████╔╝███████║
   ╚══╝╚══╝ ╚══════╝╚═════╝  ╚═════╝ ╚══════╝
  OS: WebOS 1.0 | Shell: websh | Theme: Dark Glass`,
};

const TerminalApp: React.FC = () => {
  const [lines, setLines] = useState<TermLine[]>([
    { type: 'output', text: 'WebOS Terminal v1.0 — Type "help" for commands.' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLines: TermLine[] = [{ type: 'input', text: `$ ${cmd}` }];

    if (cmd === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    const [command, ...args] = cmd.split(' ');
    const handler = COMMANDS[command];
    if (handler) {
      newLines.push({ type: 'output', text: handler(args) });
    } else {
      newLines.push({ type: 'output', text: `websh: command not found: ${command}` });
    }

    setLines(prev => [...prev, ...newLines]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a] p-3 font-mono-code text-sm">
      <div className="flex-1 overflow-auto space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className={line.type === 'input' ? 'text-primary' : 'text-foreground/80'}>
            <pre className="whitespace-pre-wrap">{line.text}</pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
        <span className="text-primary">$</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-foreground"
          autoFocus
        />
      </form>
    </div>
  );
};

export default TerminalApp;
