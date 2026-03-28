'use client';

import type { Step, GraphState, NodeStatus } from '@/components/interactives/algo-visualizer/lib/types';

interface GraphVisualizerProps {
  step: Step<GraphState> | null;
  algoId: string;
}

const NODE_COLORS: Record<NodeStatus, string> = {
  unvisited: '#f5f5f5',
  frontier:  '#f59e0b',
  visited:   '#22c55e',
  current:   '#ef4444',
};

const NODE_BORDER: Record<NodeStatus, string> = {
  unvisited: '#d4d4d4',
  frontier:  '#d97706',
  visited:   '#16a34a',
  current:   '#dc2626',
};

const NODE_TEXT: Record<NodeStatus, string> = {
  unvisited: '#737373',
  frontier:  '#ffffff',
  visited:   '#ffffff',
  current:   '#ffffff',
};

const NODE_R = 22;
const SVG_W = 880;
const SVG_H = 440;

function formatDist(d: number): string {
  return d === Infinity ? '∞' : String(d);
}

export function GraphVisualizer({ step, algoId }: GraphVisualizerProps) {
  if (!step) return <EmptyState />;

  const { graph, nodeStatus, activeEdgeId, parentMap, distances, visitOrder } = step.state;
  const isDijkstra = algoId === 'dijkstra';
  const showWeights = isDijkstra;

  const treeEdgeIds = new Set<string>();
  for (const [node, parent] of Object.entries(parentMap)) {
    if (parent !== null) {
      const e = graph.edges.find(
        e => (e.from === parent && e.to === node) || (e.to === parent && e.from === node)
      );
      if (e) treeEdgeIds.add(e.id);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center min-h-0 px-4">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-full"
          style={{ maxHeight: '100%', maxWidth: '100%' }}
        >
          {/* Edges */}
          {graph.edges.map(edge => {
            const from = graph.nodes.find(n => n.id === edge.from)!;
            const to   = graph.nodes.find(n => n.id === edge.to)!;
            const isActive = edge.id === activeEdgeId;
            const isTree   = treeEdgeIds.has(edge.id);

            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;

            return (
              <g key={edge.id}>
                <line
                  x1={from.x} y1={from.y}
                  x2={to.x}   y2={to.y}
                  stroke={
                    isActive ? '#f59e0b'
                    : isTree  ? '#3b82f6'
                    : '#d4d4d4'
                  }
                  strokeWidth={isActive ? 2.5 : isTree ? 2 : 1.5}
                  style={{ transition: 'stroke 200ms ease, stroke-width 200ms ease' }}
                />
                {showWeights && (
                  <>
                    <rect
                      x={mx - 9} y={my - 8}
                      width={18} height={16}
                      rx={3}
                      fill="#faf8f4"
                    />
                    <text
                      x={mx} y={my + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fontFamily="monospace"
                      fill={isActive ? '#f59e0b' : '#a3a3a3'}
                      style={{ transition: 'fill 200ms ease' }}
                    >
                      {edge.weight}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {graph.nodes.map(node => {
            const status = nodeStatus[node.id] ?? 'unvisited';
            const isCurrent = status === 'current';

            return (
              <g key={node.id}>
                {isCurrent && (
                  <circle
                    cx={node.x} cy={node.y}
                    r={NODE_R + 6}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    opacity={0.4}
                    className="animate-ping"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                )}
                <circle
                  cx={node.x} cy={node.y} r={NODE_R}
                  fill={NODE_COLORS[status]}
                  stroke={NODE_BORDER[status]}
                  strokeWidth={2}
                  style={{ transition: 'fill 200ms ease, stroke 200ms ease' }}
                />
                <text
                  x={node.x}
                  y={isDijkstra ? node.y - 4 : node.y + 5}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight="600"
                  fontFamily="monospace"
                  fill={NODE_TEXT[status]}
                  style={{ transition: 'fill 200ms ease' }}
                >
                  {node.id}
                </text>
                {isDijkstra && (
                  <text
                    x={node.x}
                    y={node.y + 11}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily="monospace"
                    fill={status === 'unvisited' ? '#a3a3a3' : NODE_TEXT[status]}
                    style={{ transition: 'fill 200ms ease' }}
                  >
                    {formatDist(distances[node.id])}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-6 py-2 border-t border-neutral-200 shrink-0">
        {(Object.entries(NODE_COLORS) as [NodeStatus, string][]).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-neutral-500 capitalize">{status}</span>
          </div>
        ))}
        {isDijkstra && (
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-6 h-0.5 shrink-0 bg-blue-500" />
            <span className="text-[11px] text-neutral-500">Shortest path tree</span>
          </div>
        )}
      </div>

      {/* Result strip */}
      {visitOrder.length > 0 && (
        <div className="px-6 py-2 border-t border-neutral-200 shrink-0 bg-[#f0ede8]">
          <span className="text-[11px] font-mono text-neutral-400">
            {isDijkstra ? 'Shortest dist: ' : 'Visit order: '}
          </span>
          <span className="text-[11px] font-mono text-neutral-900">
            {isDijkstra
              ? visitOrder.map(n => `${n}=${formatDist(distances[n])}`).join('  ')
              : visitOrder.join(' → ')}
          </span>
        </div>
      )}
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
