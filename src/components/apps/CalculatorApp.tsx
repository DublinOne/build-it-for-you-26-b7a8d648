import React, { useState } from 'react';

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const input = (val: string) => {
    if (fresh) { setDisplay(val); setFresh(false); }
    else setDisplay(display === '0' && val !== '.' ? val : display + val);
  };

  const operate = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op) {
      let result = prev;
      if (op === '+') result = prev + current;
      else if (op === '-') result = prev - current;
      else if (op === '×') result = prev * current;
      else if (op === '÷') result = current !== 0 ? prev / current : 0;
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setFresh(true);
  };

  const equals = () => {
    if (prev !== null && op) {
      operate('=');
      setOp(null);
    }
  };

  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setFresh(true); };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handleClick = (btn: string) => {
    if (btn === 'C') clear();
    else if (btn === '±') setDisplay(String(-parseFloat(display)));
    else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
    else if (['+', '-', '×', '÷'].includes(btn)) operate(btn);
    else if (btn === '=') equals();
    else input(btn);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="text-right text-3xl font-light text-foreground p-4 mb-2 bg-secondary/30 rounded-xl min-h-[60px] flex items-end justify-end font-mono-code">
        {display}
      </div>
      <div className="grid gap-2 flex-1">
        {buttons.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map(btn => {
              const isOp = ['+', '-', '×', '÷'].includes(btn);
              const isEquals = btn === '=';
              const isZero = btn === '0';
              return (
                <button
                  key={btn}
                  onClick={() => handleClick(btn)}
                  className={`flex-1 rounded-xl text-lg font-medium transition-all duration-150 active:scale-95
                    ${isOp || isEquals ? 'bg-primary text-primary-foreground hover:bg-primary/80' : 
                      btn === 'C' || btn === '±' || btn === '%' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' :
                      'bg-os-surface text-foreground hover:bg-os-surface/80'}
                    ${isZero ? 'col-span-2' : ''}
                  `}
                  style={{ minHeight: 52 }}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorApp;
