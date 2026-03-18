import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';

interface MatrixVisualizerProps {
  algorithm: 'strassen';
}

export const MatrixVisualizer: React.FC<MatrixVisualizerProps> = ({ algorithm }) => {
  const [size, setSize] = useState(2);
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<number[][] | null>(null);

  const generateRandomMatrices = () => {
    const newA = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.floor(Math.random() * 10)));
    const newB = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.floor(Math.random() * 10)));
    setMatrixA(newA);
    setMatrixB(newB);
    solveStrassen(newA, newB);
  };

  const solveStrassen = (a: number[][], b: number[][]) => {
    const newSteps: string[] = [];
    
    if (size === 2) {
      newSteps.push("Calculating Strassen's 7 products (M1 to M7):");
      const m1 = (a[0][0] + a[1][1]) * (b[0][0] + b[1][1]);
      const m2 = (a[1][0] + a[1][1]) * b[0][0];
      const m3 = a[0][0] * (b[0][1] - b[1][1]);
      const m4 = a[1][1] * (b[1][0] - b[0][0]);
      const m5 = (a[0][0] + a[0][1]) * b[1][1];
      const m6 = (a[1][0] - a[0][0]) * (b[0][0] + b[0][1]);
      const m7 = (a[0][1] - a[1][1]) * (b[1][0] + b[1][1]);

      newSteps.push(`M1 = (a11+a22)(b11+b22) = ${m1}`);
      newSteps.push(`M2 = (a21+a22)b11 = ${m2}`);
      newSteps.push(`M3 = a11(b12-b11) = ${m3}`);
      newSteps.push(`M4 = a22(b21-b11) = ${m4}`);
      newSteps.push(`M5 = (a11+a12)b22 = ${m5}`);
      newSteps.push(`M6 = (a21-a11)(b11+b12) = ${m6}`);
      newSteps.push(`M7 = (a12-a22)(b21+b22) = ${m7}`);

      const c11 = m1 + m4 - m5 + m7;
      const c12 = m3 + m5;
      const c21 = m2 + m4;
      const c22 = m1 - m2 + m3 + m6;

      newSteps.push("Combining products for final matrix C:");
      newSteps.push(`C11 = M1+M4-M5+M7 = ${c11}`);
      newSteps.push(`C12 = M3+M5 = ${c12}`);
      newSteps.push(`C21 = M2+M4 = ${c21}`);
      newSteps.push(`C22 = M1-M2+M3+M6 = ${c22}`);

      setResult([[c11, c12], [c21, c22]]);
    } else {
      newSteps.push("Strassen's algorithm is typically demonstrated with 2x2 matrices for clarity.");
      // Standard multiplication for other sizes in this demo
      const res = a.map((row, i) => b[0].map((_, j) => row.reduce((acc, _, k) => acc + a[i][k] * b[k][j], 0)));
      setResult(res);
    }
    setSteps(newSteps);
  };

  useEffect(() => {
    generateRandomMatrices();
  }, [size]);

  return (
    <div className="space-y-8">
      <WobblyCard variant="muted" className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-bold uppercase">Size:</span>
          <select 
            value={size} 
            onChange={(e) => setSize(Number(e.target.value))}
            className="border-2 border-pencil p-1 wobbly-border-sm bg-white"
          >
            <option value={2}>2x2</option>
            <option value={4}>4x4</option>
          </select>
        </div>
        <WobblyButton size="sm" onClick={generateRandomMatrices}>Randomize</WobblyButton>
      </WobblyCard>

      <div className="grid md:grid-cols-3 gap-4 items-center">
        <WobblyCard className="p-4 flex flex-col items-center">
          <span className="text-xs font-bold mb-2">Matrix A</span>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {matrixA.flat().map((v, i) => (
              <div key={i} className="w-10 h-10 border-2 border-pencil flex items-center justify-center bg-white font-mono">{v}</div>
            ))}
          </div>
        </WobblyCard>

        <div className="text-4xl font-heading text-center">×</div>

        <WobblyCard className="p-4 flex flex-col items-center">
          <span className="text-xs font-bold mb-2">Matrix B</span>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {matrixB.flat().map((v, i) => (
              <div key={i} className="w-10 h-10 border-2 border-pencil flex items-center justify-center bg-white font-mono">{v}</div>
            ))}
          </div>
        </WobblyCard>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <WobblyCard variant="yellow" decoration="tape">
          <h3 className="text-2xl font-heading mb-4">Strassen's Trace</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {steps.map((s, i) => (
              <p key={i} className="text-lg border-b border-pencil/10 pb-1">
                {s}
              </p>
            ))}
          </div>
        </WobblyCard>

        <WobblyCard className="p-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold mb-2 uppercase">Result Matrix C</span>
          {result && (
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
              {result.flat().map((v, i) => (
                <div key={i} className="w-12 h-12 border-2 border-pencil flex items-center justify-center bg-marker-red text-white font-mono font-bold">{v}</div>
              ))}
            </div>
          )}
        </WobblyCard>
      </div>
    </div>
  );
};
