import type { GraphData } from './types';

// ─── BFS / DFS ────────────────────────────────────────────────────────────────
// 12-node near-complete binary tree — 4 levels
// BFS from A: A, B, C, D, E, F, G, H, I, J, K, L  (level by level)
// DFS from A: A, B, D, H, I, E, J, K, C, F, L, G  (left subtree first)
export const TREE_GRAPH: GraphData = {
  nodes: [
    { id: 'A', x: 440, y:  50 },  // root
    { id: 'B', x: 220, y: 155 },  // level 1
    { id: 'C', x: 660, y: 155 },
    { id: 'D', x: 110, y: 265 },  // level 2
    { id: 'E', x: 330, y: 265 },
    { id: 'F', x: 550, y: 265 },
    { id: 'G', x: 770, y: 265 },
    { id: 'H', x:  55, y: 375 },  // level 3 (G has no children)
    { id: 'I', x: 165, y: 375 },
    { id: 'J', x: 275, y: 375 },
    { id: 'K', x: 385, y: 375 },
    { id: 'L', x: 495, y: 375 },
  ],
  edges: [
    { id: 'AB', from: 'A', to: 'B', weight: 1 },
    { id: 'AC', from: 'A', to: 'C', weight: 1 },
    { id: 'BD', from: 'B', to: 'D', weight: 1 },
    { id: 'BE', from: 'B', to: 'E', weight: 1 },
    { id: 'CF', from: 'C', to: 'F', weight: 1 },
    { id: 'CG', from: 'C', to: 'G', weight: 1 },
    { id: 'DH', from: 'D', to: 'H', weight: 1 },
    { id: 'DI', from: 'D', to: 'I', weight: 1 },
    { id: 'EJ', from: 'E', to: 'J', weight: 1 },
    { id: 'EK', from: 'E', to: 'K', weight: 1 },
    { id: 'FL', from: 'F', to: 'L', weight: 1 },
    // G has no children — asymmetric tree intentional
  ],
};

// ─── Dijkstra ─────────────────────────────────────────────────────────────────
// 9-node weighted graph
// Key insight: A→C→B costs 3 (cheaper than direct A→B = 4) — shows relaxation
// Two paths tie at I: A→C→B→D→G→I = 12 and A→C→F→H→I = 12
export const DIJKSTRA_GRAPH: GraphData = {
  nodes: [
    { id: 'A', x: 440, y:  50 },  // source — top center
    { id: 'B', x: 215, y: 175 },  // level 1
    { id: 'C', x: 665, y: 175 },
    { id: 'D', x: 100, y: 295 },  // level 2
    { id: 'E', x: 330, y: 295 },
    { id: 'F', x: 665, y: 295 },
    { id: 'G', x: 100, y: 395 },  // level 3
    { id: 'H', x: 555, y: 395 },
    { id: 'I', x: 330, y: 395 },
  ],
  edges: [
    { id: 'AB', from: 'A', to: 'B', weight: 4 },
    { id: 'AC', from: 'A', to: 'C', weight: 2 },
    { id: 'BC', from: 'B', to: 'C', weight: 1 },  // cross-edge: A→C→B = 3 < A→B = 4
    { id: 'BD', from: 'B', to: 'D', weight: 3 },
    { id: 'BE', from: 'B', to: 'E', weight: 6 },
    { id: 'CF', from: 'C', to: 'F', weight: 5 },
    { id: 'DG', from: 'D', to: 'G', weight: 2 },
    { id: 'EG', from: 'E', to: 'G', weight: 1 },
    { id: 'FH', from: 'F', to: 'H', weight: 3 },
    { id: 'GI', from: 'G', to: 'I', weight: 4 },
    { id: 'HI', from: 'H', to: 'I', weight: 2 },
  ],
};

export interface Neighbor {
  id: string;
  edgeId: string;
  weight: number;
}

// Returns neighbors sorted alphabetically for deterministic traversal order
export function getNeighbors(graph: GraphData, nodeId: string): Neighbor[] {
  return graph.edges
    .filter(e => e.from === nodeId || e.to === nodeId)
    .map(e => ({
      id:     e.from === nodeId ? e.to   : e.from,
      edgeId: e.id,
      weight: e.weight,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
