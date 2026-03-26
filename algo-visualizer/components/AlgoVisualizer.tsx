'use client';

import { useState, useMemo } from 'react';
import { algorithms } from '@/algo-visualizer/lib/algorithms/registry';
import { useRunner } from '@/algo-visualizer/hooks/useRunner';
import { Sidebar } from '@/algo-visualizer/components/ui/Sidebar';
import { ControlPanel } from '@/algo-visualizer/components/ui/ControlPanel';
import { Pseudocode } from '@/algo-visualizer/components/ui/Pseudocode';
import { MetricsPanel } from '@/algo-visualizer/components/ui/MetricsPanel';
import { SortingVisualizer } from '@/algo-visualizer/components/visualizers/SortingVisualizer';
import { GraphVisualizer } from '@/algo-visualizer/components/visualizers/GraphVisualizer';

export function AlgoVisualizer() {
  const [selectedId, setSelectedId] = useState('bubble');
  const [arraySize, setArraySize]   = useState(12);
  const [inputSeed, setInputSeed]   = useState(0); // bump to regenerate

  const algo = algorithms.find(a => a.id === selectedId)!;

  // Pure input — only recalculates when algo, size, or seed changes
  const input = useMemo(
    () => algo.getDefaultInput(arraySize),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedId, arraySize, inputSeed]
  );

  // Pure steps — only recalculates when input changes
  const steps = useMemo(() => algo.getSteps(input), [algo, input]);

  const runner = useRunner(steps);

  const handleSelectAlgo = (id: string) => {
    setSelectedId(id);
    // runner resets automatically via useEffect in useRunner watching steps
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200" style={{ height: '92vh', backgroundColor: '#faf8f4', color: '#171717' }}>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          algorithms={algorithms}
          selectedId={selectedId}
          onSelect={handleSelectAlgo}
        />

        {/* Main column */}
        <main className="flex flex-col flex-1 overflow-hidden">

          {/* Step description bar */}
          <div
            className="h-10 flex items-center px-5 shrink-0 gap-4"
            style={{ borderBottom: '1px solid #e5e5e5' }}
          >
            <span className="text-sm text-neutral-700 truncate">
              {runner.step?.description ?? 'Press Play or Step Forward to begin'}
            </span>
            <a
              href="https://github.com/justinjchang/algo-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto shrink-0 text-xs text-neutral-400 hover:text-neutral-700 transition-colors duration-100"
            >
              View source →
            </a>
          </div>

          {/* Visualization + right panel */}
          <div className="flex flex-1 overflow-hidden">

            {/* Visualization */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {algo.viewType === 'array' ? (
                <SortingVisualizer step={runner.step} />
              ) : (
                <GraphVisualizer step={runner.step} algoId={selectedId} />
              )}
            </div>

            {/* Right panel — about + pseudocode + metrics */}
            <div
              className="w-72 flex flex-col overflow-hidden shrink-0"
              style={{ borderLeft: '1px solid #e5e5e5' }}
            >
              {/* About */}
              <div className="px-4 py-3 border-b border-neutral-200 shrink-0">
                {algo.about.map((sentence, i) => (
                  <p key={i} className="text-[11px] leading-relaxed text-neutral-600 mb-1 last:mb-0">
                    {sentence}
                  </p>
                ))}
              </div>
              <Pseudocode
                lines={algo.pseudocode}
                activeLines={runner.step?.codeLines ?? []}
              />
              <MetricsPanel
                metrics={runner.step?.metrics ?? {}}
                complexity={algo.complexity}
              />
            </div>
          </div>

          {/* Controls */}
          <ControlPanel
            runner={runner}
            viewType={algo.viewType}
            arraySize={arraySize}
            onArraySizeChange={size => { setArraySize(size); }}
            onNewInput={() => setInputSeed(s => s + 1)}
          />
        </main>
      </div>
    </div>
  );
}
