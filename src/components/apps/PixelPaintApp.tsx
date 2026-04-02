import React, { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = ['#FFFFFF', '#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#00FFFF', '#0088FF', '#CC66FF', '#FF00FF', '#000000'];

const PixelPaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [isDrawing, color, brushSize]);

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-border/30">
        <div className="flex gap-1">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${color === c ? 'border-foreground scale-125' : 'border-transparent'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
        <input type="range" min="1" max="20" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))}
          className="w-20 accent-primary" />
        <span className="text-xs text-muted-foreground">{brushSize}px</span>
        <button onClick={clearCanvas} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 ml-auto">
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#111]">
        <canvas
          ref={canvasRef}
          width={700}
          height={450}
          className="cursor-crosshair"
          onMouseDown={(e) => { setIsDrawing(true); draw(e); }}
          onMouseMove={draw}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
        />
      </div>
    </div>
  );
};

export default PixelPaintApp;
