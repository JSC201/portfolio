export interface Step<S> {
  state: S;
  description: string;
  codeLines: number[];
  metrics: Record<string, number | string>;
}

export interface SortState {
  array: number[];
  comparing: number[];              // amber  — being compared
  swapping: number[];               // red    — being swapped/moved
  sorted: number[];                 // green  — final position confirmed
  pivot: number | null;             // purple — quicksort pivot index
  subarray: [number, number] | null; // subtle bg — current working range
  comparisons: number;
  swaps: number;
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type NodeStatus = 'unvisited' | 'frontier' | 'visited' | 'current';

export interface GraphState {
  graph: GraphData;
  nodeStatus: Record<string, NodeStatus>;
  activeEdgeId: string | null;
  parentMap: Record<string, string | null>;
  distances: Record<string, number>;
  queueOrStack: string[];
  nodesExpanded: number;
  visitOrder: string[];
}

export type AlgorithmCategory = 'Sorting' | 'Graphs';
export type AlgorithmViewType = 'array' | 'graph';

export interface ComplexityInfo {
  time: string;
  space: string;
  best?: string;
  average?: string;
  worst?: string;
}

export interface AlgorithmDef {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  about: string[];
  complexity: ComplexityInfo;
  pseudocode: string[];
  viewType: AlgorithmViewType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSteps: (input: any) => Step<any>[];
  getDefaultInput: (size?: number) => unknown;
}
