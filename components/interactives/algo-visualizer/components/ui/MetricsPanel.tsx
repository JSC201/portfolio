'use client';

import type { ComplexityInfo } from '@/components/interactives/algo-visualizer/lib/types';

interface MetricsPanelProps {
  metrics: Record<string, number | string>;
  complexity: ComplexityInfo;
}

export function MetricsPanel({ metrics, complexity }: MetricsPanelProps) {
  const entries = Object.entries(metrics);

  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ minHeight: 120 }}>
      <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">
          Metrics
        </p>
        {entries.map(([key, val]) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <span className="text-neutral-600">{key}</span>
            <span className="font-mono text-neutral-900 font-medium">{val}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200 p-3 space-y-1 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">
          Complexity
        </p>
        <Row label="Time"  val={complexity.time} />
        <Row label="Space" val={complexity.space} />
        {complexity.best    && <Row label="Best"    val={complexity.best}    dim />}
        {complexity.average && <Row label="Average" val={complexity.average} dim />}
        {complexity.worst   && <Row label="Worst"   val={complexity.worst}   dim />}
      </div>
    </div>
  );
}

function Row({ label, val, dim }: { label: string; val: string; dim?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className={dim ? 'text-neutral-400' : 'text-neutral-500'}>{label}</span>
      <span className={`font-mono font-medium ${dim ? 'text-neutral-400' : 'text-blue-500'}`}>{val}</span>
    </div>
  );
}
