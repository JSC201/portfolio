'use client';

import type { AlgorithmDef, AlgorithmCategory } from '@/algo-visualizer/lib/types';

interface SidebarProps {
  algorithms: AlgorithmDef[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CATEGORIES: AlgorithmCategory[] = ['Sorting', 'Graphs'];

export function Sidebar({ algorithms, selectedId, onSelect }: SidebarProps) {
  return (
    <aside className="w-52 border-r border-neutral-200 flex flex-col overflow-y-auto shrink-0 bg-[#faf8f4]">
      <div className="p-4 space-y-6">
        {CATEGORIES.map(category => {
          const algos = algorithms.filter(a => a.category === category);
          return (
            <div key={category}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2 px-2">
                {category}
              </p>
              <ul className="space-y-0.5">
                {algos.map(algo => {
                  const active = algo.id === selectedId;
                  return (
                    <li key={algo.id}>
                      <button
                        onClick={() => onSelect(algo.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-100 ${
                          active
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="block font-medium">{algo.name}</span>
                        <span className={`text-[11px] font-mono ${active ? 'text-blue-400' : 'text-neutral-400'}`}>
                          {algo.complexity.time}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
