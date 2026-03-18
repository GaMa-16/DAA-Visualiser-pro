import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { runBenchmark, getBenchmarkSizes, BenchmarkResult } from '../services/benchmarkService';
import { Play, RotateCcw, Activity } from 'lucide-react';

interface BenchmarkPanelProps {
  algorithmId: string;
  algorithmName: string;
}

export const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({ algorithmId, algorithmName }) => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const sizes = getBenchmarkSizes(algorithmId);

  const startBenchmark = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    const benchmarkResults: BenchmarkResult[] = [];
    for (let i = 0; i < sizes.length; i++) {
      const n = sizes[i];
      const result = await runBenchmark(algorithmId, [n]);
      benchmarkResults.push(result[0]);
      setResults([...benchmarkResults]);
      setProgress(((i + 1) / sizes.length) * 100);
    }

    setIsRunning(false);
  };

  return (
    <WobblyCard variant="muted" className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="text-marker-red" size={24} />
          <h3 className="text-xl font-heading uppercase">Performance Benchmark</h3>
        </div>
        <div className="flex gap-2">
          <WobblyButton 
            size="sm" 
            variant="accent" 
            onClick={startBenchmark} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? <RotateCcw className="animate-spin" size={16} /> : <Play size={16} />}
            {isRunning ? 'Running...' : 'Run Benchmark'}
          </WobblyButton>
        </div>
      </div>

      <p className="text-sm italic opacity-60">
        Measuring execution time for {algorithmName} across varying input sizes (n).
        Times are measured in milliseconds (ms) on your local browser.
      </p>

      {isRunning && (
        <div className="w-full bg-pencil h-2 rounded-full overflow-hidden">
          <div 
            className="bg-marker-red h-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="h-[300px] w-full bg-white border-2 border-pencil wobbly-border-sm p-4">
        {results.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results}>
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="n" 
                label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                contentStyle={{ border: '2px solid #141414', borderRadius: '0px' }}
                formatter={(value: number) => [`${value.toFixed(4)} ms`, 'Time']}
              />
              <Area 
                type="monotone" 
                dataKey="time" 
                stroke="#FF4444" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTime)" 
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-pencil/40 italic">
            <Activity size={48} className="mb-2 opacity-20" />
            <p>Click "Run Benchmark" to see the growth curve</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sizes.map((n, i) => {
          const result = results.find(r => r.n === n);
          return (
            <div key={i} className="p-2 bg-pencil text-white border-2 border-pencil wobbly-border-sm">
              <p className="text-[10px] uppercase font-bold opacity-60">n = {n}</p>
              <p className="text-lg font-heading">
                {result ? `${result.time.toFixed(2)}ms` : '--'}
              </p>
            </div>
          );
        })}
      </div>
    </WobblyCard>
  );
};
