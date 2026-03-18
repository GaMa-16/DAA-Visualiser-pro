import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';
import { motion, AnimatePresence } from 'motion/react';

interface BacktrackingVisualizerProps {
  algorithm: 'n-queens' | 'sum-of-subsets' | 'hamiltonian-circuit';
}

export const BacktrackingVisualizer: React.FC<BacktrackingVisualizerProps> = ({ algorithm }) => {
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  
  // N-Queens State
  const [n, setN] = useState(4);
  
  // Sum of Subsets State
  const [set, setSet] = useState<number[]>([5, 10, 12, 13, 15, 18]);
  const [target, setTarget] = useState(30);

  // Hamiltonian Circuit State
  const [adjMatrix, setAdjMatrix] = useState<number[][]>([
    [0, 1, 0, 1, 0],
    [1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ]);

  const solveNQueens = () => {
    const newSteps: any[] = [];
    const board = Array(n).fill(-1);

    const isSafe = (row: number, col: number, currentBoard: number[]) => {
      for (let i = 0; i < row; i++) {
        if (currentBoard[i] === col || 
            Math.abs(currentBoard[i] - col) === Math.abs(i - row)) {
          return false;
        }
      }
      return true;
    };

    const backtrack = (row: number) => {
      if (row === n) {
        newSteps.push({
          board: [...board],
          description: "Found a solution!",
          status: 'success',
          row: row - 1,
          col: board[row-1]
        });
        return true;
      }

      for (let col = 0; col < n; col++) {
        board[row] = col;
        const safe = isSafe(row, col, board);
        
        newSteps.push({
          board: [...board],
          description: safe ? `Placing queen at (${row}, ${col})` : `Cannot place queen at (${row}, ${col}) - Conflict detected`,
          status: safe ? 'placing' : 'conflict',
          row,
          col
        });

        if (safe) {
          if (backtrack(row + 1)) return true;
        }
        
        board[row] = -1;
        newSteps.push({
          board: [...board],
          description: `Backtracking from row ${row}`,
          status: 'backtrack',
          row,
          col
        });
      }
      return false;
    };

    backtrack(0);
    setSteps(newSteps);
    setCurrentStepIdx(0);
  };

  const solveSumOfSubsets = () => {
    const newSteps: any[] = [];
    const subset: number[] = [];

    const backtrack = (index: number, currentSum: number) => {
      if (currentSum === target) {
        newSteps.push({
          subset: [...subset],
          description: `Found subset with sum ${target}!`,
          status: 'success',
          currentIndex: index
        });
        return true;
      }

      if (index === set.length || currentSum > target) {
        return false;
      }

      // Include element
      subset.push(set[index]);
      newSteps.push({
        subset: [...subset],
        description: `Including ${set[index]}. Current sum: ${currentSum + set[index]}`,
        status: 'including',
        currentIndex: index
      });
      if (backtrack(index + 1, currentSum + set[index])) return true;

      // Exclude element
      const excluded = subset.pop();
      newSteps.push({
        subset: [...subset],
        description: `Excluding ${excluded}. Backtracking...`,
        status: 'backtrack',
        currentIndex: index
      });
      if (backtrack(index + 1, currentSum)) return true;

      return false;
    };

    backtrack(0, 0);
    setSteps(newSteps);
    setCurrentStepIdx(0);
  };

  const solveHamiltonian = () => {
    const n = adjMatrix.length;
    const path = Array(n).fill(-1);
    const newSteps: any[] = [];

    const isSafe = (v: number, pos: number, currentPath: number[]) => {
      if (adjMatrix[currentPath[pos - 1]][v] === 0) return false;
      for (let i = 0; i < pos; i++) {
        if (currentPath[i] === v) return false;
      }
      return true;
    };

    const backtrack = (pos: number) => {
      if (pos === n) {
        const hasEdgeToStart = adjMatrix[path[pos - 1]][path[0]] === 1;
        newSteps.push({
          path: [...path],
          description: hasEdgeToStart ? "Found Hamiltonian Circuit!" : "Path found but no edge back to start. Backtracking...",
          status: hasEdgeToStart ? 'success' : 'conflict',
          pos
        });
        return hasEdgeToStart;
      }

      for (let v = 1; v < n; v++) {
        if (isSafe(v, pos, path)) {
          path[pos] = v;
          newSteps.push({
            path: [...path],
            description: `Moving to vertex ${v}`,
            status: 'moving',
            pos
          });

          if (backtrack(pos + 1)) return true;

          path[pos] = -1;
          newSteps.push({
            path: [...path],
            description: `Vertex ${v} leads to no solution. Backtracking...`,
            status: 'backtrack',
            pos
          });
        }
      }
      return false;
    };

    path[0] = 0;
    newSteps.push({
      path: [...path],
      description: "Starting from vertex 0",
      status: 'start',
      pos: 0
    });
    backtrack(1);
    setSteps(newSteps);
    setCurrentStepIdx(0);
  };

  useEffect(() => {
    if (algorithm === 'n-queens') solveNQueens();
    else if (algorithm === 'sum-of-subsets') solveSumOfSubsets();
    else if (algorithm === 'hamiltonian-circuit') solveHamiltonian();
  }, [algorithm, n, set, target, adjMatrix]);

  const currentStep = steps[currentStepIdx] || {};

  return (
    <div className="space-y-8">
      <WobblyCard variant="muted" className="space-y-4">
        <h3 className="text-xl font-heading uppercase">Configuration</h3>
        
        {algorithm === 'n-queens' && (
          <div className="flex items-end gap-4">
            <div>
              <label className="text-sm font-bold block mb-1">Board Size (N)</label>
              <input 
                type="number" 
                min="4" 
                max="8" 
                value={n} 
                onChange={(e) => setN(Math.min(8, Math.max(4, Number(e.target.value))))} 
                className="border-2 border-pencil p-2 wobbly-border-sm w-24" 
              />
            </div>
            <p className="text-sm italic text-pencil/60">Max 8 for visualization clarity.</p>
          </div>
        )}

        {algorithm === 'sum-of-subsets' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold block mb-1">Set (comma separated)</label>
              <input 
                type="text" 
                value={set.join(', ')} 
                onChange={(e) => setSet(e.target.value.split(',').map(v => parseInt(v.trim()) || 0))} 
                className="w-full border-2 border-pencil p-2 wobbly-border-sm font-mono" 
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1">Target Sum</label>
              <input 
                type="number" 
                value={target} 
                onChange={(e) => setTarget(Number(e.target.value))} 
                className="border-2 border-pencil p-2 wobbly-border-sm w-24" 
              />
            </div>
          </div>
        )}

        {algorithm === 'hamiltonian-circuit' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold uppercase text-pencil/60">Adjacency Matrix (5x5)</p>
              <div className="relative pt-8 pl-8 w-fit">
                {/* Column Labels */}
                <div className="absolute top-0 left-8 right-0 flex justify-around pr-1">
                  {[0,1,2,3,4].map(n => <span key={n} className="text-xs font-bold w-10 text-center text-marker-red">{n}</span>)}
                </div>
                {/* Row Labels */}
                <div className="absolute top-8 left-0 bottom-0 flex flex-col justify-around pb-1">
                  {[0,1,2,3,4].map(n => <span key={n} className="text-xs font-bold h-10 flex items-center text-marker-red">{n}</span>)}
                </div>
                <div className="grid grid-cols-5 gap-2 bg-pencil p-2 wobbly-border-sm shadow-hard-sm">
                  {adjMatrix.map((row, i) => row.map((val, j) => (
                    <input
                      key={`${i}-${j}`}
                      type="number"
                      min="0"
                      max="1"
                      value={val}
                      onChange={(e) => {
                        const val = Math.min(1, Math.max(0, Number(e.target.value)));
                        const newMatrix = adjMatrix.map((row, rowIndex) => {
                          if (rowIndex === i) {
                            const newRow = [...row];
                            newRow[j] = val;
                            return newRow;
                          }
                          if (rowIndex === j) {
                            const newRow = [...row];
                            newRow[i] = val;
                            return newRow;
                          }
                          return row;
                        });
                        setAdjMatrix(newMatrix);
                      }}
                      className="w-10 h-10 text-center font-mono text-sm border-none focus:ring-2 focus:ring-marker-red bg-white wobbly-border-sm"
                    />
                  )))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <WobblyButton 
                size="sm" 
                variant="secondary" 
                className="border-marker-red text-marker-red hover:bg-marker-red hover:text-white px-6"
                onClick={() => setAdjMatrix(Array(5).fill(0).map(() => Array(5).fill(0)))}
              >
                Clear Matrix
              </WobblyButton>
              <p className="text-xs italic text-pencil/40 max-w-[200px]">
                Tip: Enter 1 to create an edge between vertices, 0 to remove it.
              </p>
            </div>
          </div>
        )}
      </WobblyCard>

      <div className="grid lg:grid-cols-3 gap-8">
        <WobblyCard className="lg:col-span-2 flex flex-col min-h-[450px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-heading">Backtracking Visualization</h3>
            <div className="flex gap-2">
              <WobblyButton size="sm" variant="secondary" onClick={() => setCurrentStepIdx(0)}>Reset</WobblyButton>
              <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}>Prev</WobblyButton>
              <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))}>Next</WobblyButton>
            </div>
          </div>

          <div className={`flex-1 flex items-center justify-center border-2 border-pencil wobbly-border-sm p-8 relative overflow-hidden transition-colors duration-500 ${algorithm === 'hamiltonian-circuit' ? 'bg-pencil' : 'bg-white'}`}>
            {algorithm === 'n-queens' && (
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
                {Array(n * n).fill(0).map((_, idx) => {
                  const r = Math.floor(idx / n);
                  const c = idx % n;
                  const hasQueen = currentStep.board?.[r] === c;
                  const isCurrent = currentStep.row === r && currentStep.col === c;
                  const isBlack = (r + c) % 2 === 1;
                  
                  return (
                    <div 
                      key={idx}
                      className={`
                        w-12 h-12 md:w-16 md:h-16 border border-pencil flex items-center justify-center text-3xl
                        ${isBlack ? 'bg-pencil/10' : 'bg-white'}
                        ${isCurrent && currentStep.status === 'conflict' ? 'bg-marker-red/40' : ''}
                        ${isCurrent && currentStep.status === 'placing' ? 'bg-pen-blue/20' : ''}
                      `}
                    >
                      {hasQueen && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={isCurrent && currentStep.status === 'conflict' ? 'text-marker-red' : 'text-pencil'}
                        >
                          ♛
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {algorithm === 'sum-of-subsets' && (
              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-wrap justify-center gap-4">
                  {set.map((num, idx) => {
                    const isIncluded = currentStep.subset?.includes(num);
                    const isCurrent = currentStep.currentIndex === idx;
                    return (
                      <div 
                        key={idx}
                        className={`
                          w-16 h-16 border-2 border-pencil wobbly-border-sm flex items-center justify-center text-xl font-heading transition-all
                          ${isIncluded ? 'bg-pen-blue text-white shadow-hard-sm -translate-y-2' : 'bg-white'}
                          ${isCurrent ? 'ring-4 ring-marker-red' : ''}
                        `}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
                <div className="text-center">
                  <p className="text-sm uppercase font-bold text-pencil/60">Current Subset Sum</p>
                  <p className="text-5xl font-heading text-marker-red">
                    {currentStep.subset?.reduce((a: number, b: number) => a + b, 0) || 0}
                  </p>
                </div>
              </div>
            )}

            {algorithm === 'hamiltonian-circuit' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {adjMatrix.map((row, i) => row.map((val, j) => {
                      if (val === 0 || i >= j) return null;
                      const angleI = (i / adjMatrix.length) * 2 * Math.PI;
                      const xI = Math.cos(angleI) * 100 + 100;
                      const yI = Math.sin(angleI) * 100 + 100;
                      
                      const angleJ = (j / adjMatrix.length) * 2 * Math.PI;
                      const xJ = Math.cos(angleJ) * 100 + 100;
                      const yJ = Math.sin(angleJ) * 100 + 100;
                      
                      const isInPath = currentStep.path?.some((v: number, idx: number) => 
                        (v === i && currentStep.path[idx+1] === j) || (v === j && currentStep.path[idx+1] === i)
                      );

                      return (
                        <line
                          key={`${i}-${j}`}
                          x1={xI + 24} y1={yI + 24}
                          x2={xJ + 24} y2={yJ + 24}
                          stroke={isInPath ? '#FF4444' : '#FFFFFF'}
                          strokeWidth={isInPath ? 4 : 1}
                          strokeDasharray={isInPath ? "0" : "4,2"}
                          className="transition-all duration-500"
                        />
                      );
                    }))}
                  </svg>
                  {adjMatrix.map((_, i) => {
                    const angle = (i / adjMatrix.length) * 2 * Math.PI;
                    const x = Math.cos(angle) * 100 + 100;
                    const y = Math.sin(angle) * 100 + 100;
                    
                    return (
                      <div 
                        key={i}
                        className={`
                          absolute w-12 h-12 border-2 border-white rounded-full flex items-center justify-center font-heading transition-all z-10
                          ${currentStep.path?.includes(i) ? 'bg-pen-blue text-white' : 'bg-pencil text-white'}
                          ${currentStep.path?.[currentStep.path.length-1] === i ? 'ring-4 ring-marker-red' : ''}
                        `}
                        style={{ left: x, top: y }}
                      >
                        {i}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </WobblyCard>

        <div className="flex flex-col gap-6">
          <WobblyCard variant="yellow" decoration="tape" className="flex-1">
            <h3 className="text-2xl font-heading mb-4">State Space Search</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white border-2 border-pencil wobbly-border-sm min-h-[100px] flex items-center justify-center text-center italic">
                "{currentStep.description || "Initializing search..."}"
              </div>
              <div className="p-4 bg-marker-red text-white border-2 border-pencil wobbly-border-sm font-mono text-sm">
                <p className="font-bold mb-1 uppercase text-[10px] opacity-80">Algorithm Status:</p>
                <p className="capitalize">{currentStep.status || "Ready"}</p>
                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] mt-1 text-right opacity-60">Step {currentStepIdx + 1} of {steps.length}</p>
              </div>
            </div>
          </WobblyCard>

          <WobblyCard variant="muted">
            <h3 className="text-xl font-heading mb-2">Complexity</h3>
            <div className="space-y-2">
              <p className="text-2xl font-heading text-marker-red">
                {algorithm === 'n-queens' && "O(N!)"}
                {algorithm === 'sum-of-subsets' && "O(2ⁿ)"}
                {algorithm === 'hamiltonian-circuit' && "O(N!)"}
              </p>
              <p className="text-sm italic">
                {algorithm === 'n-queens' && "Exponential growth as board size increases."}
                {algorithm === 'sum-of-subsets' && "Each element can either be in or out."}
                {algorithm === 'hamiltonian-circuit' && "Checking all permutations of vertices."}
              </p>
            </div>
          </WobblyCard>
        </div>
      </div>
    </div>
  );
};
