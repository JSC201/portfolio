'use client';

import type { Step, SortState } from '@/components/interactives/algo-visualizer/lib/types';

const COLORS = {
  sorted:    '#22c55e',
  swapping:  '#ef4444',
  comparing: '#f59e0b',
  pivot:     '#a855f7',
  default:   '#d4d4d4',
};

const TEXT_ON: Record<string, string> = {
  '#22c55e': '#ffffff',
  '#ef4444': '#ffffff',
  '#f59e0b': '#ffffff',
  '#a855f7': '#ffffff',
  '#d4d4d4': '#737373',
};

function blockColor(i: number, { sorted, swapping, comparing, pivot }: SortState): string {
  if (sorted.includes(i))    return COLORS.sorted;
  if (swapping.includes(i))  return COLORS.swapping;
  if (comparing.includes(i)) return COLORS.comparing;
  if (pivot === i)           return COLORS.pivot;
  return COLORS.default;
}

const MIN_H = 28;
const MAX_H = 260;

export function SortingVisualizer({ step }: { step: Step<SortState> | null }) {
  if (!step) return <EmptyState />;

  const { array, subarray } = step.state;
  const [subL, subR] = subarray ?? [-1, -1];

  const maxVal = Math.max(...array);
  const minVal = Math.min(...array);
  const range  = maxVal - minVal || 1;

  const heightOf = (val: number) =>
    Math.round(MIN_H + ((val - minVal) / range) * (MAX_H - MIN_H));

  const showNums = array.length <= 28;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden px-8">
        <div className="flex flex-col w-full" style={{ maxWidth: 900 }}>
          <div className="flex items-end w-full" style={{ height: MAX_H, gap: 3 }}>
            {array.map((val, i) => {
              const h     = heightOf(val);
              const color = blockColor(i, step.state);
              const inSub = subarray !== null && i >= subL && i <= subR;

              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm flex items-center justify-center"
                  style={{
                    height: h,
                    minWidth: 0,
                    backgroundColor: color,
                    boxShadow: inSub ? '0 0 0 1px rgba(59,130,246,0.35)' : 'none',
                    transition: 'background-color 120ms ease, height 160ms ease',
                  }}
                >
                  {showNums && h >= 26 && (
                    <span
                      className="text-[10px] font-mono font-semibold leading-none select-none"
                      style={{ color: TEXT_ON[color] ?? '#737373' }}
                    >
                      {val}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ height: 1, backgroundColor: '#e5e5e5' }} />
        </div>
      </div>

      <div className="flex items-center gap-4 px-6 py-2 shrink-0" style={{ borderTop: '1px solid #e5e5e5' }}>
        {[
          { color: COLORS.comparing, label: 'Comparing' },
          { color: COLORS.swapping,  label: 'Swapping'  },
          { color: COLORS.sorted,    label: 'Sorted'    },
          { color: COLORS.pivot,     label: 'Pivot'     },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-neutral-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm">
      Select an algorithm and press Play
    </div>
  );
}
