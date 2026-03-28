import type { Step, GraphState, NodeStatus, GraphData } from '../types';
import { TREE_GRAPH, DIJKSTRA_GRAPH, getNeighbors } from '../presets';

// ─── Snapshot helpers ─────────────────────────────────────────────────────────

function makeSnap(graph: GraphData) {
  return function snap(
    nodeStatus: Record<string, NodeStatus>,
    activeEdgeId: string | null,
    parentMap: Record<string, string | null>,
    distances: Record<string, number>,
    queueOrStack: string[],
    nodesExpanded: number,
    description: string,
    codeLines: number[],
    extraMetrics: Record<string, string | number> = {},
    visitOrder: string[] = []
  ): Step<GraphState> {
    return {
      state: {
        graph,
        nodeStatus: { ...nodeStatus },
        activeEdgeId,
        parentMap: { ...parentMap },
        distances: { ...distances },
        queueOrStack: [...queueOrStack],
        nodesExpanded,
        visitOrder: [...visitOrder],
      },
      description,
      codeLines,
      metrics: { 'Nodes Expanded': nodesExpanded, ...extraMetrics },
    };
  };
}

function initStatus(graph: GraphData): Record<string, NodeStatus> {
  const s: Record<string, NodeStatus> = {};
  for (const n of graph.nodes) s[n.id] = 'unvisited';
  return s;
}

// ─── BFS ──────────────────────────────────────────────────────────────────────

export const BFS_CODE = [
  'function BFS(graph, start):',
  '  visited = {start}',
  '  queue = deque([start])',
  '  while queue not empty:',
  '    node = queue.popleft()',
  '    for neighbor in graph[node]:',
  '      if neighbor not in visited:',
  '        visited.add(neighbor)',
  '        queue.append(neighbor)',
];

export function bfs(startId = 'A'): Step<GraphState>[] {
  const steps: Step<GraphState>[] = [];
  const snap = makeSnap(TREE_GRAPH);
  const status = initStatus(TREE_GRAPH);
  const parentMap: Record<string, string | null> = { [startId]: null };
  const distances: Record<string, number> = {};
  for (const n of TREE_GRAPH.nodes) distances[n.id] = Infinity;
  distances[startId] = 0;

  const queue: string[] = [startId];
  status[startId] = 'frontier';
  let expanded = 0;
  const visitOrder: string[] = [];

  const s = (desc: string, lines: number[], activeEdge: string | null = null) =>
    snap(status, activeEdge, parentMap, distances, queue, expanded, desc, lines, {
      Queue: queue.length ? queue.join(' → ') : '(empty)',
    }, visitOrder);

  steps.push(s(`Start BFS from ${startId}`, [0, 1, 2]));

  while (queue.length > 0) {
    const node = queue.shift()!;
    status[node] = 'current';
    expanded++;
    steps.push(s(`Dequeue ${node} — explore neighbors`, [4]));

    for (const { id: nbr, edgeId } of getNeighbors(TREE_GRAPH, node)) {
      if (status[nbr] === 'unvisited') {
        status[nbr] = 'frontier';
        queue.push(nbr);
        parentMap[nbr] = node;
        distances[nbr] = distances[node] + 1;
        steps.push(s(`Discover ${nbr} from ${node} — enqueue`, [5, 6, 7, 8], edgeId));
      }
    }

    status[node] = 'visited';
    visitOrder.push(node);
    steps.push(s(`${node} fully processed`, [3]));
  }

  steps.push(s(`BFS complete — visited all ${expanded} nodes level by level`, []));
  return steps;
}

// ─── DFS ──────────────────────────────────────────────────────────────────────

export const DFS_CODE = [
  'function DFS(graph, start):',
  '  stack = [start]',
  '  while stack not empty:',
  '    node = stack.pop()',
  '    if node not visited:',
  '      visited.add(node)',
  '      for neighbor in graph[node]:',
  '        if neighbor not visited:',
  '          stack.push(neighbor)',
];

export function dfs(startId = 'A'): Step<GraphState>[] {
  const steps: Step<GraphState>[] = [];
  const snap = makeSnap(TREE_GRAPH);
  const status = initStatus(TREE_GRAPH);
  const parentMap: Record<string, string | null> = { [startId]: null };
  const distances: Record<string, number> = {};
  for (const n of TREE_GRAPH.nodes) distances[n.id] = Infinity;
  distances[startId] = 0;

  const stack: string[] = [startId];
  status[startId] = 'frontier';
  let expanded = 0;
  const visitOrder: string[] = [];

  const s = (desc: string, lines: number[], activeEdge: string | null = null) =>
    snap(status, activeEdge, parentMap, distances, stack, expanded, desc, lines, {
      Stack: stack.length ? [...stack].reverse().join(' → ') : '(empty)',
    }, visitOrder);

  steps.push(s(`Start DFS from ${startId}`, [0, 1]));

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (status[node] === 'visited') continue;

    status[node] = 'current';
    expanded++;
    steps.push(s(`Pop ${node} — mark visited`, [3, 4, 5]));

    // Push in reverse alphabetical order so left children (A < B) are popped first
    const neighbors = getNeighbors(TREE_GRAPH, node);
    for (const { id: nbr, edgeId } of [...neighbors].reverse()) {
      if (status[nbr] !== 'visited') {
        status[nbr] = 'frontier';
        stack.push(nbr);
        if (parentMap[nbr] === undefined) {
          parentMap[nbr] = node;
          distances[nbr] = distances[node] + 1;
        }
        steps.push(s(`Push ${nbr} onto stack`, [6, 7, 8], edgeId));
      }
    }

    status[node] = 'visited';
    visitOrder.push(node);
    steps.push(s(`${node} fully processed`, [2]));
  }

  steps.push(s(`DFS complete — visited all ${expanded} nodes depth-first`, []));
  return steps;
}

// ─── Dijkstra ─────────────────────────────────────────────────────────────────

export const DIJKSTRA_CODE = [
  'function Dijkstra(graph, start):',
  '  dist[v] = ∞ for all v;  dist[start] = 0',
  '  pq = MinHeap([(0, start)])',
  '  while pq not empty:',
  '    (d, u) = pq.extractMin()',
  '    if d > dist[u]: continue',
  '    for (v, w) in adj[u]:',
  '      if dist[u] + w < dist[v]:',
  '        dist[v] = dist[u] + w',
  '        pq.push((dist[v], v))',
];

class MinHeap {
  private data: [number, string][] = [];

  push(dist: number, node: string) {
    this.data.push([dist, node]);
    this.up(this.data.length - 1);
  }

  pop(): [number, string] | undefined {
    if (!this.data.length) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length) { this.data[0] = last; this.down(0); }
    return top;
  }

  get size() { return this.data.length; }

  private up(i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p][0] <= this.data[i][0]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  private down(i: number) {
    const n = this.data.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.data[l][0] < this.data[s][0]) s = l;
      if (r < n && this.data[r][0] < this.data[s][0]) s = r;
      if (s === i) break;
      [this.data[s], this.data[i]] = [this.data[i], this.data[s]];
      i = s;
    }
  }
}

export function dijkstra(startId = 'A'): Step<GraphState>[] {
  const steps: Step<GraphState>[] = [];
  const snap = makeSnap(DIJKSTRA_GRAPH);
  const status = initStatus(DIJKSTRA_GRAPH);
  const parentMap: Record<string, string | null> = {};
  const dist: Record<string, number> = {};
  for (const n of DIJKSTRA_GRAPH.nodes) { dist[n.id] = Infinity; parentMap[n.id] = null; }
  dist[startId] = 0;

  const pq = new MinHeap();
  pq.push(0, startId);
  status[startId] = 'frontier';
  let expanded = 0;
  const visitOrder: string[] = [];

  const distMetrics = () => {
    const m: Record<string, string | number> = {};
    for (const n of DIJKSTRA_GRAPH.nodes) {
      m[`dist[${n.id}]`] = dist[n.id] === Infinity ? '∞' : dist[n.id];
    }
    return m;
  };

  const s = (desc: string, lines: number[], activeEdge: string | null = null) =>
    snap(status, activeEdge, parentMap, dist, [], expanded, desc, lines, distMetrics(), visitOrder);

  steps.push(s(`Init Dijkstra from ${startId} — dist[${startId}]=0, all others ∞`, [0, 1, 2]));

  while (pq.size > 0) {
    const [d, u] = pq.pop()!;

    if (d > dist[u]) {
      steps.push(s(`Skip stale entry (${d}, ${u}) — already found shorter path`, [5]));
      continue;
    }

    status[u] = 'current';
    expanded++;
    steps.push(s(`Extract min: ${u}  (dist = ${d})`, [4]));

    for (const { id: v, edgeId, weight } of getNeighbors(DIJKSTRA_GRAPH, u)) {
      const newDist = dist[u] + weight;
      const curDist = dist[v] === Infinity ? '∞' : dist[v];
      steps.push(s(
        `Edge ${u}→${v} (w=${weight}): ${dist[u]}+${weight}=${newDist} vs dist[${v}]=${curDist}`,
        [6, 7], edgeId));

      if (newDist < dist[v]) {
        dist[v] = newDist;
        parentMap[v] = u;
        if (status[v] === 'unvisited') status[v] = 'frontier';
        pq.push(newDist, v);
        steps.push(s(`Relax! dist[${v}] updated to ${newDist} via ${u}`, [8, 9], edgeId));
      }
    }

    status[u] = 'visited';
    visitOrder.push(u);
    steps.push(s(`${u} finalized — shortest dist = ${dist[u]}`, [3]));
  }

  steps.push(s(`Done — all shortest paths from ${startId} found`, []));
  return steps;
}
