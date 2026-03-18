export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  space: string;
  recurrence?: string;
}

export const COMPLEXITY_DATA: Record<string, ComplexityInfo> = {
  // Fundamentals
  'bubble': {
    best: 'Ω(n)',
    average: 'Θ(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    recurrence: 'T(n) = T(n-1) + n'
  },
  'insertion': {
    best: 'Ω(n)',
    average: 'Θ(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    recurrence: 'T(n) = T(n-1) + n'
  },
  'linear-search': {
    best: 'Ω(1)',
    average: 'Θ(n)',
    worst: 'O(n)',
    space: 'O(1)',
    recurrence: 'T(n) = T(n-1) + 1'
  },
  'binary-search': {
    best: 'Ω(1)',
    average: 'Θ(log n)',
    worst: 'O(log n)',
    space: 'O(1)',
    recurrence: 'T(n) = T(n/2) + 1'
  },

  // Divide & Conquer
  'min-max': {
    best: 'Θ(n)',
    average: 'Θ(n)',
    worst: 'Θ(n)',
    space: 'O(log n)',
    recurrence: 'T(n) = 2T(n/2) + 2'
  },
  'kadane': {
    best: 'Θ(n)',
    average: 'Θ(n)',
    worst: 'Θ(n)',
    space: 'O(1)',
    recurrence: 'T(n) = T(n-1) + 1'
  },
  'merge-sort': {
    best: 'Ω(n log n)',
    average: 'Θ(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    recurrence: 'T(n) = 2T(n/2) + n'
  },
  'quick-sort': {
    best: 'Ω(n log n)',
    average: 'Θ(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    recurrence: 'T(n) = T(k) + T(n-k-1) + n'
  },

  // Optimization
  'closest-pair': {
    best: 'Ω(n log n)',
    average: 'Θ(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    recurrence: 'T(n) = 2T(n/2) + O(n)'
  },
  'convex-hull': {
    best: 'Ω(n log n)',
    average: 'Θ(n log n)',
    worst: 'O(n²)',
    space: 'O(n)',
    recurrence: 'Graham Scan: O(n log n), Jarvis March: O(nh)'
  },
  'strassen': {
    best: 'Θ(n^2.81)',
    average: 'Θ(n^2.81)',
    worst: 'Θ(n^2.81)',
    space: 'O(n²)',
    recurrence: 'T(n) = 7T(n/2) + O(n²)'
  },

  // Greedy
  'knapsack-fractional': {
    best: 'Θ(n log n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'O(n)',
    recurrence: 'Sorting + O(n)'
  },
  'huffman-coding': {
    best: 'Θ(n log n)',
    average: 'Θ(n log n)',
    worst: 'Θ(n log n)',
    space: 'O(n)',
    recurrence: 'O(n log n)'
  },
  'kruskal-mst': {
    best: 'Θ(E log E)',
    average: 'Θ(E log E)',
    worst: 'Θ(E log E)',
    space: 'O(V + E)',
    recurrence: 'O(E log E) or O(E log V)'
  },
  'prim-mst': {
    best: 'Θ(E log V)',
    average: 'Θ(E log V)',
    worst: 'Θ(E log V)',
    space: 'O(V)',
    recurrence: 'O(E log V) with Min-Priority Queue'
  },

  // Dynamic Programming
  'knapsack-01': {
    best: 'Θ(nW)',
    average: 'Θ(nW)',
    worst: 'Θ(nW)',
    space: 'O(nW)',
    recurrence: 'dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])'
  },
  'matrix-chain': {
    best: 'Θ(n³)',
    average: 'Θ(n³)',
    worst: 'Θ(n³)',
    space: 'O(n²)',
    recurrence: 'm[i,j] = min{m[i,k] + m[k+1,j] + p[i-1]p[k]p[j]}'
  },
  'lcs': {
    best: 'Θ(mn)',
    average: 'Θ(mn)',
    worst: 'Θ(mn)',
    space: 'O(mn)',
    recurrence: 'L(i,j) = L(i-1,j-1)+1 if match, else max(L(i-1,j), L(i,j-1))'
  },
  'obst': {
    best: 'Θ(n³)',
    average: 'Θ(n³)',
    worst: 'Θ(n³)',
    space: 'O(n²)',
    recurrence: 'e[i,j] = min{e[i,k-1] + e[k+1,j] + w(i,j)}'
  },

  // Backtracking
  'n-queens': {
    best: 'Ω(n!)',
    average: 'O(n!)',
    worst: 'O(n!)',
    space: 'O(n)',
    recurrence: 'T(n) = n * T(n-1) + O(n)'
  },
  'sum-of-subsets': {
    best: 'Ω(2ⁿ)',
    average: 'O(2ⁿ)',
    worst: 'O(2ⁿ)',
    space: 'O(n)',
    recurrence: 'T(n) = 2T(n-1) + O(1)'
  },
  'hamiltonian-circuit': {
    best: 'Ω(n!)',
    average: 'O(n!)',
    worst: 'O(n!)',
    space: 'O(n)',
    recurrence: 'T(n) = (n-1)! * O(n)'
  },
  'hamiltonian': {
    best: 'Ω(n!)',
    average: 'O(n!)',
    worst: 'O(n!)',
    space: 'O(n)',
    recurrence: 'T(n) = (n-1)! * O(n)'
  },

  // Branch and Bound
  'knapsack-bb': {
    best: 'Ω(n)',
    average: 'O(2ⁿ)',
    worst: 'O(2ⁿ)',
    space: 'O(2ⁿ)',
    recurrence: 'State Space Tree Search'
  },
  'tsp': {
    best: 'Ω(n² 2ⁿ)',
    average: 'O(n² 2ⁿ)',
    worst: 'O(n² 2ⁿ)',
    space: 'O(n 2ⁿ)',
    recurrence: 'T(n) = (n-1)T(n-1)'
  },

  // Graphs
  'bfs': {
    best: 'Θ(V + E)',
    average: 'Θ(V + E)',
    worst: 'Θ(V + E)',
    space: 'O(V)',
    recurrence: 'O(V + E)'
  },
  'dfs': {
    best: 'Θ(V + E)',
    average: 'Θ(V + E)',
    worst: 'Θ(V + E)',
    space: 'O(V)',
    recurrence: 'O(V + E)'
  },
  'floyd-warshall': {
    best: 'Θ(V³)',
    average: 'Θ(V³)',
    worst: 'Θ(V³)',
    space: 'O(V²)',
    recurrence: 'd[i,j,k] = min(d[i,j,k-1], d[i,k,k-1] + d[k,j,k-1])'
  },

  // Randomized
  'hiring': {
    best: 'Θ(n)',
    average: 'Θ(ln n)',
    worst: 'Θ(n)',
    space: 'O(1)',
    recurrence: 'Expected cost: O(c_h ln n)'
  },
  'rabin-karp': {
    best: 'Θ(n + m)',
    average: 'Θ(n + m)',
    worst: 'O(nm)',
    space: 'O(1)',
    recurrence: 'O(n + m) expected'
  },

  // Complexity
  'vertex-cover': {
    best: 'Θ(V + E)',
    average: 'Θ(V + E)',
    worst: 'Θ(V + E)',
    space: 'O(V)',
    recurrence: '2-Approximation: O(V + E)'
  },
  'sat': {
    best: 'Ω(2ⁿ)',
    average: 'O(2ⁿ)',
    worst: 'O(2ⁿ)',
    space: 'O(n + m)',
    recurrence: 'NP-Complete'
  }
};
