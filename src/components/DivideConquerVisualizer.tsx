import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';

interface DivideConquerVisualizerProps {
  algorithm: 'min-max' | 'kadane' | 'closest-pair';
}

export const DivideConquerVisualizer: React.FC<DivideConquerVisualizerProps> = ({ algorithm }) => {
  const [input, setInput] = useState<string>("12, 45, 2, 89, 34, 67, 23, 9");
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const solveMinMax = (arr: number[]) => {
    const newSteps: any[] = [];
    
    const findMinMax = (l: number, r: number): { min: number, max: number } => {
      if (l === r) {
        newSteps.push({ l, r, min: arr[l], max: arr[l], desc: `Base case: Single element ${arr[l]}` });
        return { min: arr[l], max: arr[l] };
      }
      if (r === l + 1) {
        const min = Math.min(arr[l], arr[r]);
        const max = Math.max(arr[l], arr[r]);
        newSteps.push({ l, r, min, max, desc: `Base case: Comparing ${arr[l]} and ${arr[r]}` });
        return { min, max };
      }

      const mid = Math.floor((l + r) / 2);
      newSteps.push({ l, r, mid, desc: `Dividing range [${l}, ${r}] at mid ${mid}` });
      
      const left = findMinMax(l, mid);
      const right = findMinMax(mid + 1, r);
      
      const res = {
        min: Math.min(left.min, right.min),
        max: Math.max(left.max, right.max)
      };
      newSteps.push({ l, r, min: res.min, max: res.max, desc: `Conquering: Merging results from [${l}, ${mid}] and [${mid+1}, ${r}]` });
      return res;
    };

    findMinMax(0, arr.length - 1);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const solveKadane = (arr: number[]) => {
    const newSteps: any[] = [];
    let maxSoFar = -Infinity;
    let maxEndingHere = 0;
    let start = 0, end = 0, s = 0;

    for (let i = 0; i < arr.length; i++) {
      maxEndingHere += arr[i];
      newSteps.push({ i, maxEndingHere, maxSoFar, desc: `Adding ${arr[i]} to current sum.` });

      if (maxSoFar < maxEndingHere) {
        maxSoFar = maxEndingHere;
        start = s;
        end = i;
        newSteps.push({ i, maxEndingHere, maxSoFar, start, end, desc: `New global maximum found: ${maxSoFar}` });
      }

      if (maxEndingHere < 0) {
        maxEndingHere = 0;
        s = i + 1;
        newSteps.push({ i, maxEndingHere, maxSoFar, desc: `Current sum negative, resetting start to ${s}` });
      }
    }
    setSteps(newSteps);
    setCurrentStep(0);
  };

  useEffect(() => {
    const arr = input.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    setArray(arr);
    if (algorithm === 'min-max') solveMinMax(arr);
    else if (algorithm === 'kadane') solveKadane(arr);
  }, [algorithm, input]);

  const stepData = steps[currentStep] || {};

  return (
    <div className="space-y-8">
      <WobblyCard variant="muted">
        <label className="text-sm font-bold uppercase block mb-1">Input Array</label>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border-2 border-pencil p-2 wobbly-border-sm bg-white font-mono"
        />
      </WobblyCard>

      <div className="grid md:grid-cols-2 gap-8">
        <WobblyCard className="min-h-[300px] flex flex-col items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {array.map((val, idx) => {
              const isHighlighted = algorithm === 'min-max' 
                ? (idx >= stepData.l && idx <= stepData.r)
                : (idx === stepData.i || (idx >= stepData.start && idx <= stepData.end));
              
              return (
                <div 
                  key={idx}
                  className={`w-12 h-12 border-2 border-pencil flex items-center justify-center font-bold transition-all ${isHighlighted ? 'bg-marker-red text-white scale-110 rotate-3' : 'bg-white'}`}
                  style={{ borderRadius: '8px' }}
                >
                  {val}
                </div>
              );
            })}
          </div>
          
          <div className="text-center space-y-2">
            {algorithm === 'min-max' && (
              <div className="flex gap-4 justify-center">
                <div className="bg-postit-yellow p-2 border-2 border-pencil wobbly-border-sm">
                  <span className="text-xs font-bold block">MIN</span>
                  <span className="text-2xl font-heading">{stepData.min ?? '?'}</span>
                </div>
                <div className="bg-postit-yellow p-2 border-2 border-pencil wobbly-border-sm">
                  <span className="text-xs font-bold block">MAX</span>
                  <span className="text-2xl font-heading">{stepData.max ?? '?'}</span>
                </div>
              </div>
            )}
            {algorithm === 'kadane' && (
              <div className="bg-postit-yellow p-2 border-2 border-pencil wobbly-border-sm">
                <span className="text-xs font-bold block">MAX SUBARRAY SUM</span>
                <span className="text-2xl font-heading">{stepData.maxSoFar ?? 0}</span>
              </div>
            )}
          </div>
        </WobblyCard>

        <WobblyCard variant="yellow" decoration="tack">
          <h3 className="text-2xl font-heading mb-4">Execution Trace</h3>
          <p className="text-xl italic mb-6">"{stepData.desc}"</p>
          <div className="flex justify-between items-center">
            <WobblyButton size="sm" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>Prev</WobblyButton>
            <span className="font-bold">{currentStep + 1} / {steps.length}</span>
            <WobblyButton size="sm" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}>Next</WobblyButton>
          </div>
        </WobblyCard>
      </div>
    </div>
  );
};
