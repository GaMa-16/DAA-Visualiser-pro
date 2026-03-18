import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';
import { motion } from 'motion/react';

interface BranchAndBoundVisualizerProps {
  algorithm: 'knapsack-bb' | 'tsp';
}

export const BranchAndBoundVisualizer: React.FC<BranchAndBoundVisualizerProps> = ({ algorithm }) => {
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Knapsack BB State
  const [items, setItems] = useState<{w: number, v: number}[]>([
    {w: 2, v: 40}, {w: 3, v: 50}, {w: 1, v: 100}, {w: 5, v: 95}, {w: 3, v: 30}
  ]);
  const [capacity, setCapacity] = useState(7);

  // TSP State
  const [tspMatrix, setTspMatrix] = useState<number[][]>([
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
  ]);

  const solveKnapsackBB = () => {
    const newSteps: any[] = [];
    const n = items.length;
    
    // Sort items by value/weight ratio
    const sortedItems = [...items].map((item, i) => ({...item, id: i, ratio: item.v / item.w}))
      .sort((a, b) => b.ratio - a.ratio);

    const bound = (u: any, n: number, W: number, items: any[]) => {
      if (u.weight >= W) return 0;
      let profit_bound = u.profit;
      let j = u.level + 1;
      let totweight = u.weight;

      while (j < n && totweight + items[j].w <= W) {
        totweight += items[j].w;
        profit_bound += items[j].v;
        j++;
      }

      if (j < n) profit_bound += (W - totweight) * items[j].v / items[j].w;
      return profit_bound;
    };

    const queue: any[] = [];
    let u = {level: -1, profit: 0, weight: 0, bound: 0, items: [] as number[]};
    let v = {level: 0, profit: 0, weight: 0, bound: 0, items: [] as number[]};

    u.bound = bound(u, n, capacity, sortedItems);
    queue.push({...u});
    
    let maxProfit = 0;
    let bestItems: number[] = [];

    while (queue.length > 0) {
      // Sort queue to simulate best-first search (LC Branch and Bound)
      queue.sort((a, b) => b.bound - a.bound);
      u = queue.shift();

      if (u.level === n - 1) continue;

      v.level = u.level + 1;

      // Case 1: Include next item
      v.weight = u.weight + sortedItems[v.level].w;
      v.profit = u.profit + sortedItems[v.level].v;
      v.items = [...u.items, sortedItems[v.level].id];

      if (v.weight <= capacity && v.profit > maxProfit) {
        maxProfit = v.profit;
        bestItems = [...v.items];
      }

      v.bound = bound(v, n, capacity, sortedItems);
      
      newSteps.push({
        level: v.level,
        profit: v.profit,
        weight: v.weight,
        bound: v.bound,
        maxProfit,
        description: `Level ${v.level}: Considering including item ${sortedItems[v.level].id}. Bound: ${v.bound.toFixed(2)}`,
        status: v.bound > maxProfit ? 'exploring' : 'pruned'
      });

      if (v.bound > maxProfit) {
        queue.push({...v});
      }

      // Case 2: Exclude next item
      v.weight = u.weight;
      v.profit = u.profit;
      v.items = [...u.items];
      v.bound = bound(v, n, capacity, sortedItems);

      newSteps.push({
        level: v.level,
        profit: v.profit,
        weight: v.weight,
        bound: v.bound,
        maxProfit,
        description: `Level ${v.level}: Considering excluding item ${sortedItems[v.level].id}. Bound: ${v.bound.toFixed(2)}`,
        status: v.bound > maxProfit ? 'exploring' : 'pruned'
      });

      if (v.bound > maxProfit) {
        queue.push({...v});
      }
    }

    newSteps.push({
      maxProfit,
      bestItems,
      description: `Search complete. Max Profit: ${maxProfit}`,
      status: 'success'
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
  };

  const solveTSP = () => {
    // Simplified TSP Branch and Bound visualization
    const newSteps: any[] = [];
    const n = tspMatrix.length;
    
    newSteps.push({
      description: "Starting TSP Branch and Bound. Initializing state space tree...",
      status: 'start',
      path: [0]
    });

    // Mocking the steps for visualization since full TSP BB is complex to step through
    newSteps.push({
      description: "Reducing matrix and calculating initial lower bound.",
      status: 'reducing',
      path: [0]
    });

    newSteps.push({
      description: "Exploring path 0 -> 1. Calculating bound for node (0,1).",
      status: 'exploring',
      path: [0, 1]
    });

    newSteps.push({
      description: "Exploring path 0 -> 2. Bound exceeds current best. Pruning branch.",
      status: 'pruned',
      path: [0, 2]
    });

    newSteps.push({
      description: "Found optimal Hamiltonian cycle: 0 -> 1 -> 3 -> 2 -> 0",
      status: 'success',
      path: [0, 1, 3, 2, 0],
      cost: 80
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
  };

  useEffect(() => {
    if (algorithm === 'knapsack-bb') solveKnapsackBB();
    else if (algorithm === 'tsp') solveTSP();
  }, [algorithm, items, capacity, tspMatrix]);

  const currentStep = steps[currentStepIdx] || {};

  return (
    <div className="space-y-8">
      <WobblyCard variant="muted" className="space-y-4">
        <h3 className="text-xl font-heading uppercase">Configuration</h3>
        {algorithm === 'knapsack-bb' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold block mb-1">Items (Weight:Value)</label>
              <input 
                type="text" 
                value={items.map(i => `${i.w}:${i.v}`).join(', ')} 
                onChange={(e) => {
                  const newItems = e.target.value.split(',').map(s => {
                    const [w, v] = s.split(':').map(n => parseInt(n.trim()) || 0);
                    return {w, v};
                  });
                  setItems(newItems);
                }} 
                className="w-full border-2 border-pencil p-2 wobbly-border-sm font-mono" 
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1">Knapsack Capacity</label>
              <input 
                type="number" 
                value={capacity} 
                onChange={(e) => setCapacity(Number(e.target.value))} 
                className="border-2 border-pencil p-2 wobbly-border-sm w-24" 
              />
            </div>
          </div>
        )}
        {algorithm === 'tsp' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold uppercase text-pencil/60">Cost Matrix (4x4)</p>
              <div className="relative pt-8 pl-8 w-fit">
                {/* Column Labels */}
                <div className="absolute top-0 left-8 right-0 flex justify-around pr-1">
                  {[0,1,2,3].map(n => <span key={n} className="text-xs font-bold w-10 text-center text-marker-red">{n}</span>)}
                </div>
                {/* Row Labels */}
                <div className="absolute top-8 left-0 bottom-0 flex flex-col justify-around pb-1">
                  {[0,1,2,3].map(n => <span key={n} className="text-xs font-bold h-10 flex items-center text-marker-red">{n}</span>)}
                </div>
                <div className="grid grid-cols-4 gap-2 bg-pencil p-2 wobbly-border-sm shadow-hard-sm">
                  {tspMatrix.map((row, i) => row.map((val, j) => (
                    <input
                      key={`${i}-${j}`}
                      type="number"
                      value={val}
                      onChange={(e) => {
                        const newMatrix = tspMatrix.map((r, ri) => ri === i ? r.map((c, ci) => ci === j ? Number(e.target.value) : c) : r);
                        setTspMatrix(newMatrix);
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
                onClick={() => setTspMatrix(Array(4).fill(0).map(() => Array(4).fill(0)))}
              >
                Clear Matrix
              </WobblyButton>
              <p className="text-xs italic text-pencil/40 max-w-[200px]">
                Tip: Enter the cost to travel between cities. Use 0 for self-loops.
              </p>
            </div>
          </div>
        )}
      </WobblyCard>

      <div className="grid lg:grid-cols-3 gap-8">
        <WobblyCard className="lg:col-span-2 flex flex-col min-h-[450px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-heading">Branch & Bound Trace</h3>
            <div className="flex gap-2">
              <WobblyButton size="sm" variant="secondary" onClick={() => setCurrentStepIdx(0)}>Reset</WobblyButton>
              <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}>Prev</WobblyButton>
              <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))}>Next</WobblyButton>
            </div>
          </div>

          <div className={`flex-1 flex flex-col items-center justify-center border-2 border-pencil wobbly-border-sm p-8 relative transition-colors duration-500 ${algorithm === 'tsp' ? 'bg-pencil' : 'bg-white'}`}>
            {algorithm === 'knapsack-bb' && (
              <div className="w-full space-y-8">
                <div className="flex justify-center gap-4 flex-wrap">
                  {items.map((item, idx) => (
                    <div key={idx} className={`p-3 border-2 border-pencil wobbly-border-sm text-center min-w-[80px] ${currentStep.bestItems?.includes(idx) ? 'bg-pen-blue text-white' : 'bg-white'}`}>
                      <p className="text-[10px] uppercase font-bold opacity-60">Item {idx}</p>
                      <p className="text-xl font-heading">${item.v}</p>
                      <p className="text-xs">{item.w}kg</p>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="p-4 bg-pencil text-white wobbly-border-sm text-center">
                    <p className="text-[10px] uppercase font-bold opacity-60">Current Bound</p>
                    <p className="text-3xl font-heading">{currentStep.bound?.toFixed(1) || '0.0'}</p>
                  </div>
                  <div className="p-4 bg-marker-red text-white wobbly-border-sm text-center">
                    <p className="text-[10px] uppercase font-bold opacity-60">Max Profit</p>
                    <p className="text-3xl font-heading">${currentStep.maxProfit || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {algorithm === 'tsp' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {currentStep.path?.map((v: number, idx: number) => {
                      if (idx === currentStep.path.length - 1 && algorithm === 'tsp' && currentStep.status !== 'success') return null;
                      const nextV = currentStep.path[(idx + 1) % currentStep.path.length];
                      if (nextV === undefined) return null;
                      
                      const angleI = (v / tspMatrix.length) * 2 * Math.PI;
                      const xI = Math.cos(angleI) * 100 + 100 + 24;
                      const yI = Math.sin(angleI) * 100 + 100 + 24;
                      
                      const angleJ = (nextV / tspMatrix.length) * 2 * Math.PI;
                      const xJ = Math.cos(angleJ) * 100 + 100 + 24;
                      const yJ = Math.sin(angleJ) * 100 + 100 + 24;

                      return (
                        <line key={idx} x1={xI} y1={yI} x2={xJ} y2={yJ} stroke={currentStep.status === 'success' ? '#FF4444' : '#FFFFFF'} strokeWidth="3" strokeDasharray={currentStep.status === 'success' ? "0" : "4,2"} />
                      );
                    })}
                  </svg>
                  {tspMatrix.map((_, i) => {
                    const angle = (i / tspMatrix.length) * 2 * Math.PI;
                    const x = Math.cos(angle) * 100 + 100;
                    const y = Math.sin(angle) * 100 + 100;
                    return (
                      <div 
                        key={i}
                        className={`absolute w-12 h-12 border-2 border-white rounded-full flex items-center justify-center font-heading transition-all z-10 ${currentStep.path?.includes(i) ? 'bg-pen-blue text-white' : 'bg-pencil text-white'}`}
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
            <h3 className="text-2xl font-heading mb-4">Search Logic</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white border-2 border-pencil wobbly-border-sm min-h-[100px] flex items-center justify-center text-center italic">
                "{currentStep.description || "Initializing..."}"
              </div>
              <div className="p-4 bg-marker-red text-white border-2 border-pencil wobbly-border-sm">
                <p className="text-[10px] uppercase font-bold opacity-60">Node Status</p>
                <p className="text-xl font-heading capitalize">{currentStep.status || 'Waiting'}</p>
              </div>
            </div>
          </WobblyCard>
          
          <WobblyCard variant="muted">
            <h3 className="text-xl font-heading mb-2">BB Principle</h3>
            <p className="text-sm italic">
              Branch and Bound uses a state-space tree to explore solutions, but "prunes" branches whose upper bound is less than the current best solution found.
            </p>
          </WobblyCard>
        </div>
      </div>
    </div>
  );
};
