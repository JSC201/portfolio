'use client';

interface PseudocodeProps {
  lines: string[];
  activeLines: number[];
}

export function Pseudocode({ lines, activeLines }: PseudocodeProps) {
  const activeSet = new Set(activeLines);

  return (
    <div className="flex flex-col border-b border-neutral-200 overflow-hidden" style={{ maxHeight: '45%' }}>
      <div className="overflow-y-auto flex-1">
        <pre className="text-xs font-mono leading-relaxed p-3 select-none">
          <div className="text-[10px] font-medium uppercase tracking-widest text-neutral-500 mb-2 px-2">
            Pseudocode
          </div>
          {lines.map((line, i) => {
            const isActive = activeSet.has(i);
            const isEmpty = line.trim() === '';
            if (isEmpty) return <div key={i} className="h-3" />;
            return (
              <div
                key={i}
                className={`flex items-start rounded px-2 py-0.5 transition-colors duration-150 ${
                  isActive ? 'bg-blue-100 text-neutral-900 border-l-2 border-blue-400' : 'text-neutral-600'
                }`}
              >
                <span className="w-5 shrink-0 text-neutral-400 select-none text-right mr-3">
                  {i + 1}
                </span>
                <span className={isActive ? 'text-neutral-900' : ''}>{line}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
