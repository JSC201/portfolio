import type { AlgorithmDef } from '../types';
import { generateRandomArray, bubbleSort, insertionSort, mergeSort, quickSort, BUBBLE_CODE, INSERTION_CODE, MERGE_CODE, QUICK_CODE } from './sorting';
import { bfs, dfs, dijkstra, BFS_CODE, DFS_CODE, DIJKSTRA_CODE } from './graphs';
import { TREE_GRAPH, DIJKSTRA_GRAPH } from '../presets';

export const algorithms: AlgorithmDef[] = [
  // ── Sorting ──────────────────────────────────────────────────────────────
  {
    id: 'bubble',
    name: 'Bubble Sort',
    category: 'Sorting',
    description: 'Repeatedly swaps adjacent elements that are out of order. Each pass bubbles the largest unsorted element to its correct position.',
    about: [
      'Each pass compares adjacent pairs and swaps them if out of order, moving the largest unsorted element to its final position.',
      'Simple to understand but O(n²) makes it impractical for large inputs.',
    ],
    complexity: { time: 'O(n²)', space: 'O(1)', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    pseudocode: BUBBLE_CODE,
    viewType: 'array',
    getSteps: (input: number[]) => bubbleSort(input),
    getDefaultInput: (size = 20) => generateRandomArray(size),
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    category: 'Sorting',
    description: 'Builds a sorted subarray one element at a time by inserting each new element into its correct position.',
    about: [
      'Maintains a sorted prefix, inserting each new element into its correct position by shifting larger elements right.',
      'Efficient on small or nearly-sorted arrays.',
    ],
    complexity: { time: 'O(n²)', space: 'O(1)', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    pseudocode: INSERTION_CODE,
    viewType: 'array',
    getSteps: (input: number[]) => insertionSort(input),
    getDefaultInput: (size = 20) => generateRandomArray(size),
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    category: 'Sorting',
    description: 'Divide-and-conquer: recursively splits the array in half, sorts each half, then merges the sorted halves back together.',
    about: [
      'Recursively splits the array in half, sorts each half independently, then merges the two sorted halves back together.',
      'Stable and guaranteed O(n log n) in all cases.',
    ],
    complexity: { time: 'O(n log n)', space: 'O(n)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    pseudocode: MERGE_CODE,
    viewType: 'array',
    getSteps: (input: number[]) => mergeSort(input),
    getDefaultInput: (size = 20) => generateRandomArray(size),
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    category: 'Sorting',
    description: 'Picks a pivot, partitions elements smaller/larger around it, then recursively sorts each partition.',
    about: [
      'Picks a pivot element, partitions everything smaller to its left and larger to its right, then recurses on each side.',
      'Cache-friendly and fastest in practice for in-memory data.',
    ],
    complexity: { time: 'O(n log n)', space: 'O(log n)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    pseudocode: QUICK_CODE,
    viewType: 'array',
    getSteps: (input: number[]) => quickSort(input),
    getDefaultInput: (size = 20) => generateRandomArray(size),
  },
  // ── Graphs ───────────────────────────────────────────────────────────────
  {
    id: 'bfs',
    name: 'BFS',
    category: 'Graphs',
    description: 'Breadth-First Search explores all neighbors at the current depth before moving deeper. Uses a queue — guarantees shortest path on unweighted graphs.',
    about: [
      'Explores all neighbors at the current depth before going deeper, using a queue to process nodes level by level.',
      'Guarantees the shortest hop-count path in unweighted graphs.',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    pseudocode: BFS_CODE,
    viewType: 'graph',
    getSteps: () => bfs('A'),
    getDefaultInput: () => TREE_GRAPH,
  },
  {
    id: 'dfs',
    name: 'DFS',
    category: 'Graphs',
    description: 'Depth-First Search dives as deep as possible before backtracking. Uses a stack — useful for cycle detection, topological sort, and connected components.',
    about: [
      'Dives as deep as possible along each branch before backtracking, using a stack (or recursion) to track the path.',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    pseudocode: DFS_CODE,
    viewType: 'graph',
    getSteps: () => dfs('A'),
    getDefaultInput: () => TREE_GRAPH,
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's",
    category: 'Graphs',
    description: "Finds shortest paths from a source to all nodes in a weighted graph. Uses a min-heap to always process the nearest unvisited node.",
    about: [
      'Greedily settles the nearest unsettled node, building shortest weighted paths from a source to every reachable node.',
      'Requires non-negative edge weights.',
    ],
    complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
    pseudocode: DIJKSTRA_CODE,
    viewType: 'graph',
    getSteps: () => dijkstra('A'),
    getDefaultInput: () => DIJKSTRA_GRAPH,
  },
];
