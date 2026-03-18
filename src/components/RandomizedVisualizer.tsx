import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Shuffle, SortAsc, UserPlus } from 'lucide-react';

interface RandomizedVisualizerProps {
  algorithm: 'hiring' | 'quick-sort' | 'rabin-karp';
}

export const RandomizedVisualizer: React.FC<RandomizedVisualizerProps> = ({ algorithm }) => {
  // Common state
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Hiring Problem State
  const [candidates, setCandidates] = useState<number[]>([]);
  const [customCandidates, setCustomCandidates] = useState("");

  // Quick Sort State
  const [array, setArray] = useState<number[]>([]);
  const [customArray, setCustomArray] = useState("");

  // Rabin-Karp State
  const [text, setText] = useState("");
  const [pattern, setPattern] = useState("");
  const [customText, setCustomText] = useState("");
  const [customPattern, setCustomPattern] = useState("");

  // Initialization
  useEffect(() => {
    generateRandomInput();
  }, [algorithm]);

  const generateRandomInput = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    if (algorithm === 'hiring') {
      const newCandidates = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1);
      setCandidates(newCandidates);
      generateHiringSteps(newCandidates);
    } else if (algorithm === 'quick-sort') {
      const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
      setArray(newArray);
      generateQuickSortSteps(newArray);
    } else if (algorithm === 'rabin-karp') {
      const chars = "ABC";
      const newText = Array.from({ length: 15 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      const newPattern = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      setText(newText);
      setPattern(newPattern);
      generateRabinKarpSteps(newText, newPattern);
    }
  };

  const handleCustomInput = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    if (algorithm === 'hiring') {
      const newCandidates = customCandidates.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      if (newCandidates.length > 0) {
        setCandidates(newCandidates);
        generateHiringSteps(newCandidates);
      }
    } else if (algorithm === 'quick-sort') {
      const newArray = customArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      if (newArray.length > 0) {
        setArray(newArray);
        generateQuickSortSteps(newArray);
      }
    } else if (algorithm === 'rabin-karp') {
      if (customText && customPattern) {
        setText(customText);
        setPattern(customPattern);
        generateRabinKarpSteps(customText, customPattern);
      }
    }
  };

  // --- Hiring Problem Logic ---
  const generateHiringSteps = (data: number[]) => {
    const newSteps: any[] = [];
    const shuffled = [...data];
    
    // Fisher-Yates Shuffle visualization
    newSteps.push({
      candidates: [...shuffled],
      shuffling: true,
      description: "Initial candidates. We need to randomize the order to avoid worst-case hiring costs.",
      currentIdx: -1,
      bestScore: 0,
      hiredCount: 0
    });

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      newSteps.push({
        candidates: [...shuffled],
        shuffling: true,
        description: `Randomizing: Swapping index ${i} and ${j}.`,
        currentIdx: i,
        bestScore: 0,
        hiredCount: 0
      });
    }

    // Hiring process
    let bestScore = -1;
    let hiredCount = 0;
    const hiredIndices: number[] = [];

    newSteps.push({
      candidates: [...shuffled],
      shuffling: false,
      description: "Randomization complete. Starting the hiring process.",
      currentIdx: -1,
      bestScore: 0,
      hiredCount: 0,
      hiredIndices: []
    });

    for (let i = 0; i < shuffled.length; i++) {
      const currentScore = shuffled[i];
      let hired = false;
      if (currentScore > bestScore) {
        bestScore = currentScore;
        hiredCount++;
        hiredIndices.push(i);
        hired = true;
      }

      newSteps.push({
        candidates: [...shuffled],
        shuffling: false,
        description: hired 
          ? `Candidate ${i} has score ${currentScore} > ${bestScore === currentScore ? 'previous best' : bestScore}. Hire them!` 
          : `Candidate ${i} has score ${currentScore} <= ${bestScore}. Don't hire.`,
        currentIdx: i,
        bestScore,
        hiredCount,
        hiredIndices: [...hiredIndices]
      });
    }

    newSteps.push({
      candidates: [...shuffled],
      shuffling: false,
      description: `Hiring complete. Total hired: ${hiredCount}. Expected hiring cost is O(ln n).`,
      currentIdx: -1,
      bestScore,
      hiredCount,
      hiredIndices: [...hiredIndices],
      done: true
    });

    setSteps(newSteps);
  };

  // --- Randomized Quick Sort Logic ---
  const generateQuickSortSteps = (data: number[]) => {
    const newSteps: any[] = [];
    const arr = [...data];

    const quickSort = (low: number, high: number) => {
      if (low < high) {
        // Randomized Pivot Selection
        const randomPivotIdx = Math.floor(Math.random() * (high - low + 1)) + low;
        newSteps.push({
          arr: [...arr],
          description: `Selecting random pivot from range [${low}, ${high}]: Index ${randomPivotIdx} (Value: ${arr[randomPivotIdx]})`,
          pivotIdx: randomPivotIdx,
          range: [low, high],
          phase: 'pivot'
        });

        // Swap random pivot with high
        [arr[randomPivotIdx], arr[high]] = [arr[high], arr[randomPivotIdx]];
        
        const pivot = arr[high];
        let i = low - 1;

        newSteps.push({
          arr: [...arr],
          description: `Swapped random pivot to end. Starting partition around ${pivot}.`,
          pivotIdx: high,
          range: [low, high],
          phase: 'partition-start'
        });

        for (let j = low; j < high; j++) {
          newSteps.push({
            arr: [...arr],
            description: `Comparing ${arr[j]} with pivot ${pivot}.`,
            pivotIdx: high,
            compareIdx: j,
            iIdx: i,
            range: [low, high],
            phase: 'compare'
          });

          if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            newSteps.push({
              arr: [...arr],
              description: `${arr[i]} < ${pivot}, swapping with index ${i}.`,
              pivotIdx: high,
              compareIdx: j,
              iIdx: i,
              range: [low, high],
              phase: 'swap'
            });
          }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        const pi = i + 1;

        newSteps.push({
          arr: [...arr],
          description: `Partition complete. Pivot ${pivot} is now at its correct position ${pi}.`,
          pivotIdx: pi,
          range: [low, high],
          phase: 'partition-end'
        });

        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };

    quickSort(0, arr.length - 1);
    newSteps.push({
      arr: [...arr],
      description: "Quick Sort complete! The array is sorted.",
      phase: 'done'
    });

    setSteps(newSteps);
  };

  // --- Rabin-Karp Logic ---
  const generateRabinKarpSteps = (T: string, P: string) => {
    const newSteps: any[] = [];
    const n = T.length;
    const m = P.length;
    const d = 256; // Radix
    const q = 101; // A prime number

    let p = 0; // Hash value for pattern
    let t = 0; // Hash value for text
    let h = 1;

    // h = pow(d, m-1) % q
    for (let i = 0; i < m - 1; i++) {
      h = (h * d) % q;
    }

    // Initial hashes
    for (let i = 0; i < m; i++) {
      p = (d * p + P.charCodeAt(i)) % q;
      t = (d * t + T.charCodeAt(i)) % q;
    }

    newSteps.push({
      text: T,
      pattern: P,
      description: `Initial hashes calculated. Pattern Hash: ${p}, First Window Hash: ${t}.`,
      windowIdx: 0,
      patternHash: p,
      textHash: t,
      matches: []
    });

    const matches: number[] = [];

    for (let i = 0; i <= n - m; i++) {
      newSteps.push({
        text: T,
        pattern: P,
        description: `Comparing hashes at window ${i}. Pattern: ${p}, Window: ${t}.`,
        windowIdx: i,
        patternHash: p,
        textHash: t,
        matches: [...matches],
        comparing: true
      });

      if (p === t) {
        // Spurious hit or real match
        let j;
        for (j = 0; j < m; j++) {
          if (T[i + j] !== P[j]) break;
        }

        if (j === m) {
          matches.push(i);
          newSteps.push({
            text: T,
            pattern: P,
            description: `Hashes match AND characters match! Pattern found at index ${i}.`,
            windowIdx: i,
            patternHash: p,
            textHash: t,
            matches: [...matches],
            found: true
          });
        } else {
          newSteps.push({
            text: T,
            pattern: P,
            description: `Spurious hit! Hashes match but characters don't at index ${i}.`,
            windowIdx: i,
            patternHash: p,
            textHash: t,
            matches: [...matches],
            spurious: true
          });
        }
      }

      if (i < n - m) {
        const oldT = t;
        t = (d * (t - T.charCodeAt(i) * h) + T.charCodeAt(i + m)) % q;
        if (t < 0) t = (t + q);
        
        newSteps.push({
          text: T,
          pattern: P,
          description: `Rolling hash: Removing ${T[i]} and adding ${T[i + m]}. New hash: ${t}.`,
          windowIdx: i + 1,
          patternHash: p,
          textHash: t,
          matches: [...matches],
          rolling: true
        });
      }
    }

    newSteps.push({
      text: T,
      pattern: P,
      description: `Search complete. Found ${matches.length} matches at indices: ${matches.join(', ') || 'None'}.`,
      windowIdx: -1,
      patternHash: p,
      textHash: t,
      matches: [...matches],
      done: true
    });

    setSteps(newSteps);
  };

  const currentStep = steps[currentStepIdx] || {};

  return (
    <div className="space-y-8">
      {/* Input Controls */}
      <WobblyCard variant="muted" className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-heading uppercase flex items-center gap-2">
            {algorithm === 'hiring' && <UserPlus size={24} className="text-marker-red" />}
            {algorithm === 'quick-sort' && <SortAsc size={24} className="text-marker-red" />}
            {algorithm === 'rabin-karp' && <Search size={24} className="text-marker-red" />}
            {algorithm.replace('-', ' ')} Configuration
          </h3>
          <WobblyButton size="sm" variant="accent" onClick={generateRandomInput} className="flex items-center gap-2">
            <Shuffle size={16} /> Random Input
          </WobblyButton>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {algorithm === 'hiring' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-60">Custom Candidates (comma separated scores)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customCandidates}
                  onChange={(e) => setCustomCandidates(e.target.value)}
                  placeholder="e.g. 45, 88, 12, 95, 30"
                  className="flex-1 p-2 border-2 border-pencil wobbly-border-sm focus:outline-none"
                />
                <WobblyButton size="sm" onClick={handleCustomInput}>Apply</WobblyButton>
              </div>
            </div>
          )}
          {algorithm === 'quick-sort' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-60">Custom Array (comma separated numbers)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customArray}
                  onChange={(e) => setCustomArray(e.target.value)}
                  placeholder="e.g. 10, 5, 8, 2, 7"
                  className="flex-1 p-2 border-2 border-pencil wobbly-border-sm focus:outline-none"
                />
                <WobblyButton size="sm" onClick={handleCustomInput}>Apply</WobblyButton>
              </div>
            </div>
          )}
          {algorithm === 'rabin-karp' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Custom Text</label>
                <input 
                  type="text" 
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. ABABDABACDABABCABAB"
                  className="w-full p-2 border-2 border-pencil wobbly-border-sm focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Custom Pattern</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    placeholder="e.g. ABABC"
                    className="flex-1 p-2 border-2 border-pencil wobbly-border-sm focus:outline-none"
                  />
                  <WobblyButton size="sm" onClick={handleCustomInput}>Apply</WobblyButton>
                </div>
              </div>
            </>
          )}
        </div>
      </WobblyCard>

      {/* Visualization Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        <WobblyCard className="lg:col-span-2 flex flex-col min-h-[450px] bg-pencil relative overflow-hidden">
          {/* Controls Overlay */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <WobblyButton size="sm" variant="secondary" onClick={() => setCurrentStepIdx(0)}>Reset</WobblyButton>
            <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}>Prev</WobblyButton>
            <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))}>Next</WobblyButton>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            {algorithm === 'hiring' && (
              <div className="flex flex-wrap justify-center gap-4">
                {currentStep.candidates?.map((score: number, idx: number) => (
                  <motion.div
                    key={idx}
                    layout
                    className={`
                      w-16 h-24 border-2 border-white rounded-lg flex flex-col items-center justify-center gap-2 relative transition-all
                      ${currentStep.currentIdx === idx ? 'bg-marker-red scale-110' : 
                        currentStep.hiredIndices?.includes(idx) ? 'bg-pen-blue' : 'bg-pencil'}
                    `}
                  >
                    <span className="text-xs text-white/60 font-bold">#{idx}</span>
                    <span className="text-2xl font-heading text-white">{score}</span>
                    {currentStep.hiredIndices?.includes(idx) && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                        <UserPlus size={12} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {algorithm === 'quick-sort' && (
              <div className="flex items-end justify-center gap-2 h-64 w-full">
                {currentStep.arr?.map((val: number, idx: number) => {
                  const isPivot = currentStep.pivotIdx === idx;
                  const isComparing = currentStep.compareIdx === idx;
                  const isInRange = idx >= currentStep.range?.[0] && idx <= currentStep.range?.[1];
                  
                  return (
                    <motion.div
                      key={idx}
                      layout
                      className={`
                        w-10 border-2 border-white flex items-center justify-center text-white font-bold transition-all relative
                        ${isPivot ? 'bg-marker-red h-full' : 
                          isComparing ? 'bg-postit-yellow text-pencil h-full scale-110 z-10' : 
                          isInRange ? 'bg-pen-blue' : 'bg-pencil opacity-30'}
                      `}
                      style={{ height: `${(val / 100) * 100}%` }}
                    >
                      <span className="-rotate-90 whitespace-nowrap">{val}</span>
                      {isPivot && <span className="absolute -top-6 text-[10px] uppercase font-bold text-marker-red">Pivot</span>}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {algorithm === 'rabin-karp' && (
              <div className="flex flex-col gap-8 w-full">
                {/* Text View */}
                <div className="flex flex-wrap justify-center gap-1">
                  {currentStep.text?.split('').map((char: string, idx: number) => {
                    const isInWindow = idx >= currentStep.windowIdx && idx < currentStep.windowIdx + currentStep.pattern?.length;
                    const isMatched = currentStep.matches?.some((m: number) => idx >= m && idx < m + currentStep.pattern?.length);
                    
                    return (
                      <motion.div
                        key={idx}
                        className={`
                          w-8 h-10 border-2 border-white flex items-center justify-center font-heading text-xl transition-all
                          ${isMatched ? 'bg-green-500 text-white' : 
                            isInWindow ? 'bg-marker-red text-white' : 'bg-pencil text-white/40'}
                        `}
                      >
                        {char}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pattern View */}
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[10px] uppercase font-bold text-white/60">Pattern</div>
                  <div className="flex gap-1">
                    {currentStep.pattern?.split('').map((char: string, idx: number) => (
                      <div key={idx} className="w-8 h-10 border-2 border-white bg-pen-blue text-white flex items-center justify-center font-heading text-xl">
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </WobblyCard>

        {/* Trace Panel */}
        <div className="flex flex-col gap-6">
          <WobblyCard variant="yellow" decoration="tape" className="flex-1">
            <h3 className="text-2xl font-heading mb-4">Algorithm Trace</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white border-2 border-pencil wobbly-border-sm min-h-[120px] flex items-center justify-center text-center italic">
                "{currentStep.description || "Initializing..."}"
              </div>
              
              {algorithm === 'hiring' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-pencil text-white border-2 border-pencil wobbly-border-sm">
                    <p className="text-[10px] uppercase font-bold opacity-60">Best Score</p>
                    <p className="text-xl font-heading">{currentStep.bestScore || 0}</p>
                  </div>
                  <div className="p-2 bg-pencil text-white border-2 border-pencil wobbly-border-sm">
                    <p className="text-[10px] uppercase font-bold opacity-60">Hired Count</p>
                    <p className="text-xl font-heading">{currentStep.hiredCount || 0}</p>
                  </div>
                </div>
              )}

              {algorithm === 'rabin-karp' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-pencil text-white border-2 border-pencil wobbly-border-sm">
                    <p className="text-[10px] uppercase font-bold opacity-60">Pattern Hash</p>
                    <p className="text-xl font-heading">{currentStep.patternHash || 0}</p>
                  </div>
                  <div className="p-2 bg-pencil text-white border-2 border-pencil wobbly-border-sm">
                    <p className="text-[10px] uppercase font-bold opacity-60">Window Hash</p>
                    <p className="text-xl font-heading">{currentStep.textHash || 0}</p>
                  </div>
                </div>
              )}
            </div>
          </WobblyCard>

          <WobblyCard variant="muted">
            <h3 className="text-xl font-heading mb-2">Algorithm Insight</h3>
            <p className="text-sm italic">
              {algorithm === 'hiring' && "Randomization ensures we don't encounter the worst-case hiring cost (hiring everyone)."}
              {algorithm === 'quick-sort' && "Randomized pivot selection makes the O(n²) worst-case extremely unlikely, keeping it O(n log n)."}
              {algorithm === 'rabin-karp' && "Rabin-Karp uses hashing to find any one of a set of pattern strings in a text in O(n+m) time."}
            </p>
          </WobblyCard>
        </div>
      </div>
    </div>
  );
};
