import React, { useState } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';

export const MasterTheoremSolver: React.FC = () => {
  const [a, setA] = useState<number>(2);
  const [b, setB] = useState<number>(2);
  const [k, setK] = useState<number>(1); // f(n) = n^k
  const [p, setP] = useState<number>(0); // log^p n

  const solve = () => {
    const log_b_a = Math.log(a) / Math.log(b);
    
    if (log_b_a > k) {
      return `O(n^{log_${b} ${a}}) = O(n^{${log_b_a.toFixed(2)}})`;
    } else if (Math.abs(log_b_a - k) < 0.001) {
      if (p > -1) return `O(n^{${k}} log^{${p + 1}} n)`;
      if (p === -1) return `O(n^{${k}} log log n)`;
      return `O(n^{${k}})`;
    } else {
      if (p >= 0) return `O(n^{${k}} log^{${p}} n)`;
      return `O(n^{${k}})`;
    }
  };

  return (
    <WobblyCard variant="yellow" decoration="tape" className="max-w-xl mx-auto">
      <h2 className="text-3xl mb-4 text-center">Recurrence Solver</h2>
      <p className="text-xl mb-6 text-center italic">
        T(n) = aT(n/b) + n^k log^p n
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-bold uppercase">a (Number of subproblems)</label>
          <input 
            type="number" 
            value={a} 
            onChange={(e) => setA(Number(e.target.value))}
            className="border-2 border-pencil p-2 wobbly-border-sm bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-bold uppercase">b (Division factor)</label>
          <input 
            type="number" 
            value={b} 
            onChange={(e) => setB(Number(e.target.value))}
            className="border-2 border-pencil p-2 wobbly-border-sm bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-bold uppercase">k (Polynomial power)</label>
          <input 
            type="number" 
            value={k} 
            onChange={(e) => setK(Number(e.target.value))}
            className="border-2 border-pencil p-2 wobbly-border-sm bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-bold uppercase">p (Logarithmic power)</label>
          <input 
            type="number" 
            value={p} 
            onChange={(e) => setP(Number(e.target.value))}
            className="border-2 border-pencil p-2 wobbly-border-sm bg-white"
          />
        </div>
      </div>

      <div className="border-t-2 border-dashed border-pencil pt-4 text-center">
        <p className="text-sm uppercase font-bold text-pencil/60">Complexity Result:</p>
        <p className="text-3xl font-heading text-pen-blue mt-2">{solve()}</p>
      </div>
    </WobblyCard>
  );
};
