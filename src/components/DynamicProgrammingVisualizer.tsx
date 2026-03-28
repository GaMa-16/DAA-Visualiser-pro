import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';

interface DPVisualizerProps {
  algorithm: 'knapsack-01' | 'matrix-chain' | 'lcs' | 'obst';
}

export const DynamicProgrammingVisualizer: React.FC<DPVisualizerProps> = ({ algorithm }) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [visualSteps, setVisualSteps] = useState<any[]>([]);

  // Knapsack State
  const [capacity, setCapacity] = useState(7);
  const [items, setItems] = useState<{ w: number, v: number, id: number }[]>([
    { w: 2, v: 3, id: 1 },
    { w: 3, v: 4, id: 2 },
    { w: 4, v: 5, id: 3 },
    { w: 5, v: 6, id: 4 }
  ]);

  // LCS State
  const [str1, setStr1] = useState("STONE");
  const [str2, setStr2] = useState("LONGEST");

  // Matrix Chain State
  const [dims, setDims] = useState<number[]>([10, 30, 5, 60]);

  // OBST State
  const [keys, setKeys] = useState<number[]>([10, 12, 20]);
  const [freqs, setFreqs] = useState<number[]>([34, 8, 50]);

  const solveKnapsack01 = () => {
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    const newVisualSteps: any[] = [];
    
    newVisualSteps.push({
      table: JSON.parse(JSON.stringify(dp)),
      description: "Initialize DP table with 0s for 0 items or 0 capacity.",
      highlights: [],
      formula: "dp[i][w] = 0 if i=0 or w=0"
    });

    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];
      for (let w = 1; w <= capacity; w++) {
        const prevTable = JSON.parse(JSON.stringify(dp));
        const highlights = [[i-1, w]];
        let formula = "";
        
        if (item.w <= w) {
          highlights.push([i-1, w - item.w]);
          const take = item.v + dp[i - 1][w - item.w];
          const skip = dp[i - 1][w];
          dp[i][w] = Math.max(take, skip);
          formula = `max(Value(${item.v}) + dp[${i-1}][${w-item.w}], dp[${i-1}][${w}]) = ${dp[i][w]}`;
        } else {
          dp[i][w] = dp[i - 1][w];
          formula = `Item too heavy. dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}`;
        }

        newVisualSteps.push({
          table: JSON.parse(JSON.stringify(dp)),
          description: `Processing Item ${i} at Capacity ${w}.`,
          highlights,
          current: [i, w],
          formula
        });
      }
    }

    setVisualSteps(newVisualSteps);
    setResult({ maxValue: dp[n][capacity] });
    setCurrentStepIdx(0);
  };

  const solveLCS = () => {
    const m = str1.length;
    const n = str2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const newVisualSteps: any[] = [];

    newVisualSteps.push({
      table: JSON.parse(JSON.stringify(dp)),
      description: "Initialize table. Row 0 and Col 0 are 0.",
      highlights: [],
      formula: "dp[i][j] = 0 if i=0 or j=0"
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const highlights = [];
        let formula = "";
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          highlights.push([i-1, j-1]);
          formula = `'${str1[i-1]}' == '${str2[j-1]}'. dp[i][j] = dp[i-1][j-1] + 1 = ${dp[i][j]}`;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          highlights.push([i-1, j], [i, j-1]);
          formula = `'${str1[i-1]}' != '${str2[j-1]}'. dp[i][j] = max(dp[i-1][j], dp[i][j-1]) = ${dp[i][j]}`;
        }

        newVisualSteps.push({
          table: JSON.parse(JSON.stringify(dp)),
          description: `Comparing '${str1[i-1]}' and '${str2[j-1]}'.`,
          highlights,
          current: [i, j],
          formula
        });
      }
    }

    let i_bk = m;
    let j_bk = n;
    let lcsStr = "";
    const backtrackPath = [[i_bk, j_bk]];
    const lcsChars = [];

    newVisualSteps.push({
      table: JSON.parse(JSON.stringify(dp)),
      description: "DP table completed. Starting backtracking from bottom-right corner...",
      highlights: [],
      current: [i_bk, j_bk],
      formula: "Start Backtracking phase",
      backtrackPath: [...backtrackPath],
      lcsChars: [...lcsChars],
      isBacktracking: true
    });

    while (i_bk > 0 && j_bk > 0) {
      if (str1[i_bk - 1] === str2[j_bk - 1]) {
        lcsStr = str1[i_bk - 1] + lcsStr;
        lcsChars.push([i_bk, j_bk, str1[i_bk - 1]]);
        newVisualSteps.push({
          table: JSON.parse(JSON.stringify(dp)),
          description: `Characters match! Adding '${str1[i_bk - 1]}' to LCS and moving diagonally.`,
          highlights: [],
          current: [i_bk - 1, j_bk - 1],
          formula: `str1[${i_bk - 1}] == str2[${j_bk - 1}]. Match found!`,
          backtrackPath: [...backtrackPath],
          lcsChars: [...lcsChars],
          isBacktracking: true
        });
        i_bk--;
        j_bk--;
        backtrackPath.push([i_bk, j_bk]);
      } else if (dp[i_bk - 1][j_bk] > dp[i_bk][j_bk - 1]) {
        newVisualSteps.push({
          table: JSON.parse(JSON.stringify(dp)),
          description: `Values are different. Moving up because dp[${i_bk - 1}][${j_bk}] > dp[${i_bk}][${j_bk - 1}].`,
          highlights: [[i_bk - 1, j_bk], [i_bk, j_bk - 1]],
          current: [i_bk - 1, j_bk],
          formula: `max(${dp[i_bk - 1][j_bk]}, ${dp[i_bk][j_bk - 1]}) = Move Up`,
          backtrackPath: [...backtrackPath],
          lcsChars: [...lcsChars],
          isBacktracking: true
        });
        i_bk--;
        backtrackPath.push([i_bk, j_bk]);
      } else {
        newVisualSteps.push({
          table: JSON.parse(JSON.stringify(dp)),
          description: `Values are different. Moving left because dp[${i_bk - 1}][${j_bk}] <= dp[${i_bk}][${j_bk - 1}].`,
          highlights: [[i_bk - 1, j_bk], [i_bk, j_bk - 1]],
          current: [i_bk, j_bk - 1],
          formula: `max(${dp[i_bk - 1][j_bk]}, ${dp[i_bk][j_bk - 1]}) = Move Left`,
          backtrackPath: [...backtrackPath],
          lcsChars: [...lcsChars],
          isBacktracking: true
        });
        j_bk--;
        backtrackPath.push([i_bk, j_bk]);
      }
    }

    newVisualSteps.push({
      table: JSON.parse(JSON.stringify(dp)),
      description: `Backtracking complete! The longest common subsequence is "${lcsStr}" with length ${dp[m][n]}.`,
      highlights: [],
      current: [0, 0],
      formula: `LCS String: "${lcsStr}"`,
      backtrackPath: [...backtrackPath],
      lcsChars: [...lcsChars],
      isBacktracking: true
    });

    setVisualSteps(newVisualSteps);
    setResult({ length: dp[m][n], sequence: lcsStr });
    setCurrentStepIdx(0);
  };

  const solveMatrixChain = () => {
    const n = dims.length - 1;
    const m = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    const newVisualSteps: any[] = [];

    for (let len = 2; len <= n; len++) {
      for (let i = 1; i <= n - len + 1; i++) {
        const j = i + len - 1;
        m[i][j] = Infinity;
        for (let k = i; k <= j - 1; k++) {
          const q = m[i][k] + m[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
          if (q < m[i][j]) {
            m[i][j] = q;
          }
          newVisualSteps.push({
            table: JSON.parse(JSON.stringify(m)),
            description: `Calculating M[${i}][${j}] using split point k=${k}.`,
            highlights: [[i, k], [k+1, j]],
            current: [i, j],
            formula: `M[${i}][${k}] + M[${k+1}][${j}] + d[${i-1}]*d[${k}]*d[${j}] = ${q}`
          });
        }
      }
    }

    setVisualSteps(newVisualSteps);
    setResult({ minMult: m[1][n] });
    setCurrentStepIdx(0);
  };

  const solveOBST = () => {
    const n = keys.length;
    const cost = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    const newVisualSteps: any[] = [];

    for (let i = 0; i < n; i++) cost[i][i] = freqs[i];

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        cost[i][j] = Infinity;
        const sum = freqs.slice(i, j + 1).reduce((a, b) => a + b, 0);
        for (let r = i; r <= j; r++) {
          const c = (r > i ? cost[i][r - 1] : 0) + (r < j ? cost[r + 1][j] : 0) + sum;
          if (c < cost[i][j]) cost[i][j] = c;
          newVisualSteps.push({
            table: JSON.parse(JSON.stringify(cost)),
            description: `Calculating Cost[${i}][${j}] with root r=${keys[r]}.`,
            highlights: r > i || r < j ? [[i, r-1], [r+1, j]].filter(h => h[0] <= h[1] && h[0] >= 0) : [],
            current: [i, j],
            formula: `SubtreeCosts + SumFreqs = ${c}`
          });
        }
      }
    }

    setVisualSteps(newVisualSteps);
    setResult({ minCost: cost[0][n - 1] });
    setCurrentStepIdx(0);
  };

  useEffect(() => {
    if (algorithm === 'knapsack-01') solveKnapsack01();
    else if (algorithm === 'lcs') solveLCS();
    else if (algorithm === 'matrix-chain') solveMatrixChain();
    else if (algorithm === 'obst') solveOBST();
  }, [algorithm, capacity, items, str1, str2, dims, keys, freqs]);

  const currentVisual = visualSteps[currentStepIdx] || { table: [], highlights: [], current: [], formula: "", description: "" };

  return (
    <div className="space-y-8">
      <WobblyCard variant="muted" className="space-y-4">
        <h3 className="text-xl font-heading uppercase">Configuration</h3>
        
        {algorithm === 'knapsack-01' && (
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-sm font-bold block mb-1">Capacity</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="border-2 border-pencil p-2 wobbly-border-sm w-24" />
            </div>
            <WobblyButton size="sm" onClick={() => setItems([...items, { w: Math.floor(Math.random()*5)+1, v: Math.floor(Math.random()*10)+1, id: Date.now() }])}>Add Item</WobblyButton>
            <WobblyButton size="sm" variant="accent" onClick={() => setItems(items.slice(0, -1))}>Remove Last</WobblyButton>
          </div>
        )}

        {algorithm === 'lcs' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold block mb-1">String 1</label>
              <input type="text" value={str1} onChange={(e) => setStr1(e.target.value.toUpperCase())} className="w-full border-2 border-pencil p-2 wobbly-border-sm font-mono" />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1">String 2</label>
              <input type="text" value={str2} onChange={(e) => setStr2(e.target.value.toUpperCase())} className="w-full border-2 border-pencil p-2 wobbly-border-sm font-mono" />
            </div>
          </div>
        )}

        {algorithm === 'matrix-chain' && (
          <div>
            <label className="text-sm font-bold block mb-1">Dimensions (e.g., 10, 30, 5, 60)</label>
            <input type="text" value={dims.join(', ')} onChange={(e) => setDims(e.target.value.split(',').map(v => parseInt(v.trim()) || 0))} className="w-full border-2 border-pencil p-2 wobbly-border-sm font-mono" />
          </div>
        )}

        {algorithm === 'obst' && (
          <div>
            <label className="text-sm font-bold block mb-1">Frequencies (comma separated)</label>
            <input type="text" value={freqs.join(', ')} onChange={(e) => setFreqs(e.target.value.split(',').map(v => parseInt(v.trim()) || 0))} className="w-full border-2 border-pencil p-2 wobbly-border-sm font-mono" />
          </div>
        )}
      </WobblyCard>

      <div className="grid lg:grid-cols-3 gap-8">
        <WobblyCard className="lg:col-span-2 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-heading">DP Table Visualization</h3>
            <div className="flex gap-2">
              <WobblyButton size="sm" variant="secondary" onClick={() => setCurrentStepIdx(0)}>Reset</WobblyButton>
              <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}>Prev</WobblyButton>
              <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.min(visualSteps.length - 1, currentStepIdx + 1))}>Next</WobblyButton>
            </div>
          </div>

          <div className="flex-1 overflow-auto border-2 border-pencil wobbly-border-sm bg-white p-4 custom-scrollbar">
            <table className="w-full border-collapse font-mono text-sm border-2 border-pencil">
              <thead>
                <tr>
                  <th className="border-2 border-pencil p-2 bg-muted-paper"></th>
                  {algorithm === 'knapsack-01' && Array.from({length: capacity + 1}).map((_, i) => (
                    <th key={i} className="border-2 border-pencil p-2 bg-muted-paper">W:{i}</th>
                  ))}
                  {algorithm === 'lcs' && ["", ...str2.split("")].map((c, i) => (
                    <th key={i} className="border-2 border-pencil p-2 bg-muted-paper">{c || "-"}</th>
                  ))}
                  {(algorithm === 'matrix-chain' || algorithm === 'obst') && Array.from({length: (algorithm === 'matrix-chain' ? dims.length - 1 : keys.length)}).map((_, i) => (
                    <th key={i} className="border-2 border-pencil p-2 bg-muted-paper">{i+1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentVisual.table.map((row: any[], i: number) => (
                  <tr key={i}>
                    <th className="border-2 border-pencil p-2 bg-muted-paper">
                      {algorithm === 'knapsack-01' && (i === 0 ? "0" : `I${i}`)}
                      {algorithm === 'lcs' && (i === 0 ? "-" : str1[i-1])}
                      {(algorithm === 'matrix-chain' || algorithm === 'obst') && i}
                    </th>
                    {row.map((cell, j) => {
                      const isHighlighted = currentVisual.highlights?.some((h: any) => h[0] === i && h[1] === j);
                      const isCurrent = currentVisual.current?.[0] === i && currentVisual.current?.[1] === j;
                      const isBacktrack = currentVisual.backtrackPath?.some((h: any) => h[0] === i && h[1] === j);
                      const isLcsChar = currentVisual.lcsChars?.some((h: any) => h[0] === i && h[1] === j);
                      const isEmpty = (algorithm === 'matrix-chain' || algorithm === 'obst') && i > j;
                      
                      return (
                        <td 
                          key={j} 
                          className={`border-2 border-pencil p-2 text-center transition-all duration-300 relative ${
                            isEmpty ? 'bg-pencil/5 text-transparent' :
                            isCurrent ? 'bg-marker-red text-white scale-110 z-10 shadow-hard-sm rounded-sm' : 
                            isLcsChar ? 'bg-pen-blue/20 ring-4 ring-marker-red animate-pulse z-20 font-bold' :
                            isBacktrack ? 'bg-pen-blue/30 scale-105 z-10' :
                            isHighlighted ? 'bg-postit-yellow' : ''
                          }`}
                        >
                          {isEmpty ? "" : (cell === Infinity ? "∞" : cell)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WobblyCard>

        {algorithm === 'lcs' && currentVisual.isBacktracking && currentStepIdx === visualSteps.length - 1 && (
          <WobblyCard variant="white" decoration="tape" className="mt-8 border-4 border-pen-blue bg-emerald-50 max-w-md mx-auto transform -rotate-2">
            <h3 className="text-2xl font-bold mb-4 font-heading text-pen-blue text-center">Result Sequence</h3>
            <div className="text-center space-y-4 font-mono">
              <p className="text-xl">Final Length: <span className="font-bold text-marker-red">{result?.length}</span></p>
              <p className="text-3xl font-bold bg-white p-3 border-2 border-pencil wobbly-border-sm mx-4 shadow-hard-sm text-pencil">
                LCS String: {result?.sequence || "None"}
              </p>
            </div>
          </WobblyCard>
        )}

        <div className="flex flex-col gap-6">
          <WobblyCard variant="yellow" decoration="tape" className="flex-1">
            <h3 className="text-2xl font-heading mb-4">Step Explanation</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white border-2 border-pencil wobbly-border-sm min-h-[100px] flex items-center justify-center text-center italic">
                "{currentVisual.description}"
              </div>
              <div className="p-4 bg-marker-red text-white border-2 border-pencil wobbly-border-sm font-mono text-sm break-all">
                <p className="font-bold mb-1 uppercase text-[10px] opacity-80">Formula Applied:</p>
                {currentVisual.formula || "Initializing..."}
              </div>
            </div>
          </WobblyCard>

          <WobblyCard variant="muted" className="h-1/3">
            <h3 className="text-xl font-heading mb-2">Complexity</h3>
            <div className="space-y-2">
              <p className="text-2xl font-heading text-marker-red">
                {algorithm === 'knapsack-01' && "O(n * W)"}
                {algorithm === 'lcs' && "O(m * n)"}
                {algorithm === 'matrix-chain' && "O(n³)"}
                {algorithm === 'obst' && "O(n³)"}
              </p>
              <p className="text-sm italic">
                {algorithm === 'knapsack-01' && "Where n is items and W is capacity."}
                {algorithm === 'lcs' && "Where m and n are string lengths."}
                {algorithm === 'matrix-chain' && "Due to triple nested loops."}
                {algorithm === 'obst' && "Optimal Binary Search Tree construction."}
              </p>
            </div>
          </WobblyCard>
        </div>
      </div>
    </div>
  );
};
