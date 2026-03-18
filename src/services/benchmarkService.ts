/**
 * Benchmark Service
 * Provides raw implementations of algorithms for performance testing.
 */

export type BenchmarkResult = {
  n: number;
  time: number;
};

export const runBenchmark = async (
  algoId: string,
  nValues: number[]
): Promise<BenchmarkResult[]> => {
  const results: BenchmarkResult[] = [];

  for (const n of nValues) {
    // Small delay to prevent UI freezing and allow garbage collection
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const start = performance.now();
    executeAlgorithm(algoId, n);
    const end = performance.now();
    
    results.push({ n, time: end - start });
  }

  return results;
};

const executeAlgorithm = (id: string, n: number) => {
  switch (id) {
    // --- Fundamentals ---
    case 'bubble': {
      const arr = Array.from({ length: n }, () => Math.random());
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
      break;
    }
    case 'insertion': {
      const arr = Array.from({ length: n }, () => Math.random());
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          j = j - 1;
        }
        arr[j + 1] = key;
      }
      break;
    }
    case 'linear-search': {
      const arr = Array.from({ length: n }, (_, i) => i);
      const target = n - 1;
      for (let i = 0; i < n; i++) {
        if (arr[i] === target) break;
      }
      break;
    }
    case 'binary-search': {
      const arr = Array.from({ length: n }, (_, i) => i);
      const target = n - 1;
      let l = 0, r = n - 1;
      while (l <= r) {
        let m = Math.floor((l + r) / 2);
        if (arr[m] === target) break;
        if (arr[m] < target) l = m + 1;
        else r = m - 1;
      }
      break;
    }

    // --- Divide & Conquer ---
    case 'merge-sort': {
      const mergeSort = (a: number[]): number[] => {
        if (a.length <= 1) return a;
        const m = Math.floor(a.length / 2);
        const left = mergeSort(a.slice(0, m));
        const right = mergeSort(a.slice(m));
        return merge(left, right);
      };
      const merge = (left: number[], right: number[]): number[] => {
        const res = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
          if (left[i] < right[j]) res.push(left[i++]);
          else res.push(right[j++]);
        }
        return [...res, ...left.slice(i), ...right.slice(j)];
      };
      mergeSort(Array.from({ length: n }, () => Math.random()));
      break;
    }
    case 'quick-sort': {
      const quickSort = (a: number[]): number[] => {
        if (a.length <= 1) return a;
        const pivot = a[0];
        const left = a.filter((x, i) => x < pivot && i !== 0);
        const right = a.filter(x => x >= pivot);
        return [...quickSort(left), pivot, ...quickSort(right)];
      };
      quickSort(Array.from({ length: n }, () => Math.random()));
      break;
    }

    // --- Dynamic Programming ---
    case 'knapsack-01': {
      const W = 50;
      const val = Array.from({ length: n }, () => Math.floor(Math.random() * 100));
      const wt = Array.from({ length: n }, () => Math.floor(Math.random() * 20));
      const dp = Array(n + 1).fill(0).map(() => Array(W + 1).fill(0));
      for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
          if (wt[i - 1] <= w) dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
          else dp[i][w] = dp[i - 1][w];
        }
      }
      break;
    }
    case 'matrix-chain': {
      const p = Array.from({ length: n + 1 }, () => Math.floor(Math.random() * 20) + 1);
      const m = Array(n + 1).fill(0).map(() => Array(n + 1).fill(0));
      for (let L = 2; L <= n; L++) {
        for (let i = 1; i <= n - L + 1; i++) {
          let j = i + L - 1;
          m[i][j] = Infinity;
          for (let k = i; k <= j - 1; k++) {
            let q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
            if (q < m[i][j]) m[i][j] = q;
          }
        }
      }
      break;
    }

    // --- Graphs ---
    case 'floyd-warshall': {
      const dist = Array(n).fill(0).map(() => Array(n).fill(Infinity));
      for (let i = 0; i < n; i++) {
        dist[i][i] = 0;
        for (let j = 0; j < n; j++) if (Math.random() > 0.7) dist[i][j] = Math.floor(Math.random() * 10);
      }
      for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
      break;
    }

    // --- Backtracking (Exponential) ---
    case 'n-queens': {
      const solve = (row: number, cols: number, diag1: number, diag2: number): number => {
        if (row === n) return 1;
        let count = 0;
        let available = ((1 << n) - 1) & ~(cols | diag1 | diag2);
        while (available) {
          let p = available & -available;
          available ^= p;
          count += solve(row + 1, cols | p, (diag1 | p) << 1, (diag2 | p) >> 1);
        }
        return count;
      };
      solve(0, 0, 0, 0);
      break;
    }

    // Default: just a loop to simulate work if not implemented
    default: {
      let sum = 0;
      for (let i = 0; i < n * n; i++) sum += i;
      break;
    }
  }
};

export const getBenchmarkSizes = (algoId: string): number[] => {
  const exponential = ['n-queens', 'sum-of-subsets', 'hamiltonian', 'tsp', 'knapsack-bb', 'sat'];
  const cubic = ['matrix-chain', 'obst', 'floyd-warshall', 'strassen'];
  
  if (exponential.includes(algoId)) return [4, 8, 12, 14];
  if (cubic.includes(algoId)) return [10, 50, 100, 150];
  return [10, 100, 1000, 2500];
};
