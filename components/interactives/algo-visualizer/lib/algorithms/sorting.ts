import type { Step, SortState } from '../types';

export function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 91) + 5);
}

// ─── Snapshot helper ──────────────────────────────────────────────────────────

function snap(
  array: number[],
  comparing: number[],
  swapping: number[],
  sorted: number[],
  pivot: number | null,
  subarray: [number, number] | null,
  comparisons: number,
  swaps: number,
  description: string,
  codeLines: number[]
): Step<SortState> {
  return {
    state: { array: [...array], comparing, swapping, sorted: [...sorted], pivot, subarray, comparisons, swaps },
    description,
    codeLines,
    metrics: { Comparisons: comparisons, Swaps: swaps },
  };
}

// ─── Bubble Sort ──────────────────────────────────────────────────────────────

export const BUBBLE_CODE = [
  'function bubbleSort(arr):',
  '  for i = 0 to n-2:',
  '    for j = 0 to n-i-2:',
  '      if arr[j] > arr[j+1]:',
  '        swap(arr[j], arr[j+1])',
];

export function bubbleSort(input: number[]): Step<SortState>[] {
  const steps: Step<SortState>[] = [];
  const arr = [...input];
  const sorted: number[] = [];
  let cmp = 0, swp = 0;
  const n = arr.length;

  steps.push(snap(arr, [], [], sorted, null, null, cmp, swp, 'Start Bubble Sort', [0]));

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      cmp++;
      steps.push(snap(arr, [j, j + 1], [], sorted, null, null, cmp, swp,
        `Compare ${arr[j]} and ${arr[j + 1]}`, [3]));

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swp++;
        steps.push(snap(arr, [], [j, j + 1], sorted, null, null, cmp, swp,
          `${arr[j + 1]} > ${arr[j]} → swap`, [4]));
      }
    }
    sorted.push(n - 1 - i);
    steps.push(snap(arr, [], [], sorted, null, null, cmp, swp,
      `Pass ${i + 1} complete — position ${n - 1 - i} locked in`, [1]));
  }

  sorted.push(0);
  steps.push(snap(arr, [], [], arr.map((_, i) => i), null, null, cmp, swp, 'Sorted!', []));
  return steps;
}

// ─── Insertion Sort ───────────────────────────────────────────────────────────

export const INSERTION_CODE = [
  'function insertionSort(arr):',
  '  for i = 1 to n-1:',
  '    key = arr[i];  j = i - 1',
  '    while j >= 0 and arr[j] > key:',
  '      arr[j+1] = arr[j]',
  '      j -= 1',
  '    arr[j+1] = key',
];

export function insertionSort(input: number[]): Step<SortState>[] {
  const steps: Step<SortState>[] = [];
  const arr = [...input];
  let cmp = 0, swp = 0;
  const n = arr.length;

  steps.push(snap(arr, [], [], [], null, null, cmp, swp, 'Start Insertion Sort', [0]));

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push(snap(arr, [i], [], [], null, [0, i], cmp, swp,
      `Pick key = ${key} at index ${i}`, [2]));

    while (j >= 0 && arr[j] > key) {
      cmp++;
      steps.push(snap(arr, [j, j + 1], [], [], null, [0, i], cmp, swp,
        `arr[${j}] = ${arr[j]} > ${key} → shift right`, [3, 4]));
      arr[j + 1] = arr[j];
      swp++;
      j--;
      steps.push(snap(arr, [], [j + 1], [], null, [0, i], cmp, swp,
        `Shifted ${arr[j + 1]} → position ${j + 1}`, [4, 5]));
    }

    if (j >= 0) {
      cmp++;
      steps.push(snap(arr, [j], [], [], null, [0, i], cmp, swp,
        `arr[${j}] = ${arr[j]} ≤ ${key} → stop`, [3]));
    }

    arr[j + 1] = key;
    steps.push(snap(arr, [], [], [], null, [0, i], cmp, swp,
      `Insert ${key} at position ${j + 1}`, [6]));
  }

  steps.push(snap(arr, [], [], arr.map((_, i) => i), null, null, cmp, swp, 'Sorted!', []));
  return steps;
}

// ─── Merge Sort ───────────────────────────────────────────────────────────────

export const MERGE_CODE = [
  'function mergeSort(arr, l, r):',
  '  if l >= r: return',
  '  mid = ⌊(l + r) / 2⌋',
  '  mergeSort(arr, l, mid)',
  '  mergeSort(arr, mid+1, r)',
  '  merge(arr, l, mid, r)',
  '',
  'function merge(arr, l, mid, r):',
  '  while i < |L| and j < |R|:',
  '    if L[i] ≤ R[j]: arr[k++] = L[i++]',
  '    else:           arr[k++] = R[j++]',
  '  copy remaining elements',
];

export function mergeSort(input: number[]): Step<SortState>[] {
  const steps: Step<SortState>[] = [];
  const arr = [...input];
  let cmp = 0, swp = 0;
  const mergedRanges: Array<[number, number]> = [];

  function sortedIndices(): number[] {
    const s = new Set<number>();
    for (const [l, r] of mergedRanges) {
      for (let i = l; i <= r; i++) s.add(i);
    }
    return [...s];
  }

  function merge(left: number, mid: number, right: number) {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < L.length && j < R.length) {
      cmp++;
      steps.push(snap(arr, [left + i, mid + 1 + j], [], sortedIndices(), null, [left, right], cmp, swp,
        `Compare ${L[i]} and ${R[j]}`, [8]));

      if (L[i] <= R[j]) {
        arr[k++] = L[i++];
        steps.push(snap(arr, [], [k - 1], sortedIndices(), null, [left, right], cmp, swp,
          `${L[i - 1]} ≤ ${R[j]} → place at ${k - 1}`, [9]));
      } else {
        arr[k++] = R[j++];
        swp++;
        steps.push(snap(arr, [], [k - 1], sortedIndices(), null, [left, right], cmp, swp,
          `${L[i]} > ${R[j - 1]} → place at ${k - 1}`, [10]));
      }
    }
    while (i < L.length) { arr[k++] = L[i++]; swp++; }
    while (j < R.length) { arr[k++] = R[j++]; swp++; }

    mergedRanges.push([left, right]);
    steps.push(snap(arr, [], [], sortedIndices(), null, null, cmp, swp,
      `Merged [${left}..${right}] → ${arr.slice(left, right + 1).join(', ')}`, [11]));
  }

  function sort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    steps.push(snap(arr, [], [], sortedIndices(), null, [left, right], cmp, swp,
      `Divide [${left}..${right}] at mid ${mid}`, [2]));
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  steps.push(snap(arr, [], [], [], null, null, cmp, swp, 'Start Merge Sort', [0]));
  sort(0, arr.length - 1);
  steps.push(snap(arr, [], [], arr.map((_, i) => i), null, null, cmp, swp, 'Sorted!', []));
  return steps;
}

// ─── Quick Sort ───────────────────────────────────────────────────────────────

export const QUICK_CODE = [
  'function quickSort(arr, lo, hi):',
  '  if lo >= hi: return',
  '  p = partition(arr, lo, hi)',
  '  quickSort(arr, lo, p-1)',
  '  quickSort(arr, p+1, hi)',
  '',
  'function partition(arr, lo, hi):',
  '  pivot = arr[hi]',
  '  i = lo - 1',
  '  for j = lo to hi-1:',
  '    if arr[j] ≤ pivot:',
  '      i++;  swap(arr[i], arr[j])',
  '  swap(arr[i+1], arr[hi])',
  '  return i + 1',
];

export function quickSort(input: number[]): Step<SortState>[] {
  const steps: Step<SortState>[] = [];
  const arr = [...input];
  let cmp = 0, swp = 0;
  const finalized = new Set<number>();

  function getFinal(): number[] { return [...finalized]; }

  function partition(lo: number, hi: number): number {
    const pivotVal = arr[hi];
    steps.push(snap(arr, [], [], getFinal(), hi, [lo, hi], cmp, swp,
      `Partition [${lo}..${hi}] — pivot = ${pivotVal}`, [7]));

    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      cmp++;
      steps.push(snap(arr, [j, hi], [], getFinal(), hi, [lo, hi], cmp, swp,
        `Compare arr[${j}] = ${arr[j]} with pivot ${pivotVal}`, [10]));

      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swp++;
          steps.push(snap(arr, [], [i, j], getFinal(), hi, [lo, hi], cmp, swp,
            `arr[${j}] ≤ pivot → swap arr[${i}] and arr[${j}]`, [11]));
        }
      }
    }

    const pIdx = i + 1;
    if (pIdx !== hi) {
      [arr[pIdx], arr[hi]] = [arr[hi], arr[pIdx]];
      swp++;
    }
    finalized.add(pIdx);
    steps.push(snap(arr, [], [pIdx], getFinal(), pIdx, [lo, hi], cmp, swp,
      `Pivot ${pivotVal} placed at final position ${pIdx}`, [12]));
    return pIdx;
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) finalized.add(lo);
      return;
    }
    steps.push(snap(arr, [], [], getFinal(), null, [lo, hi], cmp, swp,
      `quickSort [${lo}..${hi}]`, [0]));
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }

  steps.push(snap(arr, [], [], [], null, null, cmp, swp, 'Start Quick Sort', [0]));
  sort(0, arr.length - 1);
  steps.push(snap(arr, [], [], arr.map((_, i) => i), null, null, cmp, swp, 'Sorted!', []));
  return steps;
}
