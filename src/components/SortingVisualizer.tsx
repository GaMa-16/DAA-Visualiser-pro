import React, { useState, useEffect, useRef } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface VisualizerStep {
  array: number[];
  description: string;
  highlights: number[]; // Indices to highlight
  foundIndex?: number;
}

interface SortingVisualizerProps {
  algorithm: 'insertion' | 'bubble' | 'quick' | 'merge' | 'linear-search' | 'binary-search';
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ algorithm }) => {
  const [userInput, setUserInput] = useState<string>("");
  const [targetValue, setTargetValue] = useState<number>(0);
  const [history, setHistory] = useState<VisualizerStep[]>([]);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateSteps = (initialArray: number[], target?: number) => {
    const steps: VisualizerStep[] = [{ 
      array: [...initialArray], 
      description: "Initial array loaded.", 
      highlights: [] 
    }];
    const arr = [...initialArray];

    if (algorithm === 'bubble') {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          steps.push({ 
            array: [...arr], 
            description: `Comparing ${arr[j]} and ${arr[j+1]}`, 
            highlights: [j, j+1] 
          });
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            steps.push({ 
              array: [...arr], 
              description: `Swapped ${arr[j+1]} and ${arr[j]} because ${arr[j+1]} > ${arr[j]}`, 
              highlights: [j, j+1] 
            });
          }
        }
      }
      steps.push({ array: [...arr], description: "Sorting complete!", highlights: [] });
    } else if (algorithm === 'insertion') {
      for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        steps.push({ array: [...arr], description: `Picking key: ${key}`, highlights: [i] });
        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          steps.push({ array: [...arr], description: `Moving ${arr[j]} to the right`, highlights: [j, j+1] });
          j = j - 1;
        }
        arr[j + 1] = key;
        steps.push({ array: [...arr], description: `Inserted ${key} at index ${j+1}`, highlights: [j+1] });
      }
      steps.push({ array: [...arr], description: "Sorting complete!", highlights: [] });
    } else if (algorithm === 'merge') {
      const mergeSort = (start: number, end: number) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        steps.push({ array: [...arr], description: `Dividing range [${start}, ${end}] into [${start}, ${mid}] and [${mid+1}, ${end}]`, highlights: [start, end] });
        mergeSort(start, mid);
        mergeSort(mid + 1, end);
        
        // Merge
        let left = start;
        let right = mid + 1;
        const temp = [];
        steps.push({ array: [...arr], description: `Merging ranges [${start}, ${mid}] and [${mid+1}, ${end}]`, highlights: [start, mid, right, end] });
        
        while (left <= mid && right <= end) {
          if (arr[left] <= arr[right]) {
            temp.push(arr[left++]);
          } else {
            temp.push(arr[right++]);
          }
        }
        while (left <= mid) temp.push(arr[left++]);
        while (right <= end) temp.push(arr[right++]);
        
        for (let i = 0; i < temp.length; i++) {
          arr[start + i] = temp[i];
          steps.push({ array: [...arr], description: `Placing ${temp[i]} back into position ${start + i}`, highlights: [start + i] });
        }
      };
      mergeSort(0, arr.length - 1);
      steps.push({ array: [...arr], description: "Sorting complete!", highlights: [] });
    } else if (algorithm === 'quick') {
      const quickSort = (low: number, high: number) => {
        if (low < high) {
          const pivotIndex = partition(low, high);
          quickSort(low, pivotIndex - 1);
          quickSort(pivotIndex + 1, high);
        }
      };

      const partition = (low: number, high: number): number => {
        const pivot = arr[high];
        steps.push({ array: [...arr], description: `Picking pivot: ${pivot} at index ${high}`, highlights: [high] });
        let i = low - 1;
        for (let j = low; j < high; j++) {
          steps.push({ array: [...arr], description: `Comparing ${arr[j]} with pivot ${pivot}`, highlights: [j, high] });
          if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push({ array: [...arr], description: `Swapping ${arr[i]} and ${arr[j]}`, highlights: [i, j] });
          }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push({ array: [...arr], description: `Placing pivot ${pivot} at index ${i + 1}`, highlights: [i + 1, high] });
        return i + 1;
      };
      quickSort(0, arr.length - 1);
      steps.push({ array: [...arr], description: "Sorting complete!", highlights: [] });
    } else if (algorithm === 'linear-search' && target !== undefined) {
      for (let i = 0; i < arr.length; i++) {
        steps.push({ array: [...arr], description: `Checking index ${i}: Is ${arr[i]} == ${target}?`, highlights: [i] });
        if (arr[i] === target) {
          steps.push({ array: [...arr], description: `Found ${target} at index ${i}!`, highlights: [i], foundIndex: i });
          break;
        }
      }
      if (steps[steps.length-1].foundIndex === undefined) {
        steps.push({ array: [...arr], description: `${target} not found in array.`, highlights: [] });
      }
    } else if (algorithm === 'binary-search' && target !== undefined) {
      // Binary search requires sorted array
      arr.sort((a, b) => a - b);
      steps.push({ array: [...arr], description: "Array sorted for binary search.", highlights: [] });
      let low = 0;
      let high = arr.length - 1;
      while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        steps.push({ 
          array: [...arr], 
          description: `Range: [${low}, ${high}]. Checking mid index ${mid}: Is ${arr[mid]} == ${target}?`, 
          highlights: [low, mid, high] 
        });
        if (arr[mid] === target) {
          steps.push({ array: [...arr], description: `Found ${target} at index ${mid}!`, highlights: [mid], foundIndex: mid });
          break;
        } else if (arr[mid] < target) {
          steps.push({ array: [...arr], description: `${arr[mid]} < ${target}, searching right half.`, highlights: [mid] });
          low = mid + 1;
        } else {
          steps.push({ array: [...arr], description: `${arr[mid]} > ${target}, searching left half.`, highlights: [mid] });
          high = mid - 1;
        }
      }
      if (steps[steps.length-1].foundIndex === undefined) {
        steps.push({ array: [...arr], description: `${target} not found in array.`, highlights: [] });
      }
    }

    setHistory(steps);
    setStep(0);
    setIsPlaying(false);
  };

  const handleRandom = () => {
    const randomArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    setUserInput(randomArr.join(", "));
    generateSteps(randomArr, targetValue);
  };

  const handleApply = () => {
    const parsed = userInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      generateSteps(parsed, targetValue);
    }
  };

  useEffect(() => {
    handleRandom();
  }, [algorithm]);

  useEffect(() => {
    if (isPlaying && step < history.length - 1) {
      timerRef.current = setTimeout(() => {
        setStep(s => s + 1);
      }, speed);
    } else {
      setIsPlaying(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, step, history, speed]);

  const currentStep = history[step] || { array: [], description: "", highlights: [] };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <WobblyCard variant="muted" className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-bold uppercase block mb-1">Custom Array (comma separated)</label>
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g. 45, 22, 89, 12"
              className="w-full border-2 border-pencil p-2 wobbly-border-sm bg-white font-mono"
            />
          </div>
          {(algorithm.includes('search')) && (
            <div className="w-full md:w-32">
              <label className="text-sm font-bold uppercase block mb-1">Target</label>
              <input 
                type="number" 
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full border-2 border-pencil p-2 wobbly-border-sm bg-white font-mono"
              />
            </div>
          )}
          <div className="flex gap-2">
            <WobblyButton size="sm" onClick={handleApply}>Apply</WobblyButton>
            <WobblyButton size="sm" variant="secondary" onClick={handleRandom}>Random</WobblyButton>
          </div>
        </div>
      </WobblyCard>

      {/* Visualizer Stage */}
      <WobblyCard className="min-h-[350px] flex flex-col items-center justify-center p-8">
        <div className="flex items-end justify-center gap-3 h-48 w-full mb-8">
          {currentStep.array.map((val, idx) => {
            const isHighlighted = currentStep.highlights.includes(idx);
            const isFound = currentStep.foundIndex === idx;
            return (
              <div 
                key={idx}
                className={`
                  w-10 border-2 border-pencil transition-all duration-300 relative flex items-end justify-center
                  ${isFound ? 'bg-marker-red' : isHighlighted ? 'bg-postit-yellow' : 'bg-pen-blue'}
                `}
                style={{ 
                  height: `${Math.max(val * 2, 40)}px`,
                  borderRadius: '4px 4px 0 0',
                  boxShadow: isHighlighted ? '0 0 15px rgba(255, 249, 196, 0.8)' : 'none'
                }}
              >
                <span className={`absolute -top-8 font-bold text-lg ${isHighlighted ? 'scale-125 text-marker-red' : ''}`}>
                  {val}
                </span>
                <span className="text-[10px] font-bold text-white mb-1">{idx}</span>
              </div>
            );
          })}
        </div>
        
        <div className="w-full bg-paper border-2 border-dashed border-pencil p-4 wobbly-border-sm text-center min-h-[80px] flex items-center justify-center">
          <p className="text-xl italic font-heading">"{currentStep.description}"</p>
        </div>
      </WobblyCard>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <WobblyButton onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          <ChevronLeft size={24} />
        </WobblyButton>
        
        <WobblyButton variant="accent" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </WobblyButton>

        <WobblyButton onClick={() => setStep(Math.min(history.length - 1, step + 1))} disabled={step === history.length - 1}>
          <ChevronRight size={24} />
        </WobblyButton>

        <div className="flex items-center gap-2 bg-white border-2 border-pencil px-4 py-2 wobbly-border-sm">
          <span className="text-xs font-bold uppercase">Speed</span>
          <input 
            type="range" 
            min="50" 
            max="1000" 
            step="50"
            value={1050 - speed} 
            onChange={(e) => setSpeed(1050 - Number(e.target.value))}
            className="w-24 accent-marker-red"
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-xl font-heading">Step: {step + 1} / {history.length}</p>
        <p className="text-sm text-pencil/60 italic uppercase tracking-widest">
          {algorithm.replace('-', ' ')}
        </p>
      </div>
    </div>
  );
};
