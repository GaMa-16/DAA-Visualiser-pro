import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Repeat, CheckCircle2, Shuffle, Settings2 } from 'lucide-react';

interface ComplexityVisualizerProps {
  algorithm: 'vertex-cover' | 'hamiltonian' | 'sat';
}

export const ComplexityVisualizer: React.FC<ComplexityVisualizerProps> = ({ algorithm }) => {
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Vertex Cover / Hamiltonian State
  const [nodes, setNodes] = useState<{id: number, x: number, y: number}[]>([]);
  const [edges, setEdges] = useState<{from: number, to: number}[]>([]);
  const [customGraph, setCustomGraph] = useState("");

  // SAT State
  const [clauses, setClauses] = useState<number[][]>([]);
  const [variables, setVariables] = useState<boolean[]>([]);
  const [customSAT, setCustomSAT] = useState("");

  useEffect(() => {
    generateRandomInput();
  }, [algorithm]);

  const generateRandomInput = () => {
    setCurrentStepIdx(0);
    if (algorithm === 'vertex-cover' || algorithm === 'hamiltonian') {
      const nodeCount = algorithm === 'vertex-cover' ? 8 : 6;
      const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: i,
        x: 50 + Math.random() * 300,
        y: 50 + Math.random() * 300
      }));
      
      const newEdges: {from: number, to: number}[] = [];
      const prob = algorithm === 'vertex-cover' ? 0.3 : 0.5;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (Math.random() < prob) {
            newEdges.push({ from: i, to: j });
          }
        }
      }
      setNodes(newNodes);
      setEdges(newEdges);
      if (algorithm === 'vertex-cover') generateVertexCoverSteps(newNodes, newEdges);
      else generateHamiltonianSteps(newNodes, newEdges);
    } else if (algorithm === 'sat') {
      const varCount = 4;
      const clauseCount = 5;
      const newClauses = Array.from({ length: clauseCount }, () => {
        const c: number[] = [];
        const size = Math.floor(Math.random() * 2) + 2; // 2 or 3 literals
        const usedVars = new Set();
        while (c.length < size) {
          const v = Math.floor(Math.random() * varCount) + 1;
          if (!usedVars.has(v)) {
            c.push(Math.random() > 0.5 ? v : -v);
            usedVars.add(v);
          }
        }
        return c;
      });
      setClauses(newClauses);
      setVariables(Array(varCount).fill(false));
      generateSATSteps(newClauses, Array(varCount).fill(false));
    }
  };

  const handleCustomInput = () => {
    setCurrentStepIdx(0);
    if (algorithm === 'vertex-cover' || algorithm === 'hamiltonian') {
      try {
        const lines = customGraph.split('\n').filter(l => l.trim());
        const nodeCount = parseInt(lines[0]);
        const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
          id: i,
          x: 50 + Math.random() * 300,
          y: 50 + Math.random() * 300
        }));
        const newEdges = lines.slice(1).map(l => {
          const [from, to] = l.split(',').map(n => parseInt(n.trim()));
          return { from, to };
        }).filter(e => !isNaN(e.from) && !isNaN(e.to));
        
        setNodes(newNodes);
        setEdges(newEdges);
        if (algorithm === 'vertex-cover') generateVertexCoverSteps(newNodes, newEdges);
        else generateHamiltonianSteps(newNodes, newEdges);
      } catch (e) {
        alert("Invalid format. Use: \nNodeCount\nfrom,to\nfrom,to...");
      }
    } else if (algorithm === 'sat') {
      try {
        const newClauses = customSAT.split(';').map(c => c.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)));
        const maxVar = Math.max(...newClauses.flat().map(Math.abs));
        setClauses(newClauses);
        setVariables(Array(maxVar).fill(false));
        generateSATSteps(newClauses, Array(maxVar).fill(false));
      } catch (e) {
        alert("Invalid format. Use: 1,-2,3; -1,2; 3,-4");
      }
    }
  };

  // --- Vertex Cover (2-Approximation) ---
  const generateVertexCoverSteps = (ns: any[], es: any[]) => {
    const newSteps: any[] = [];
    const cover = new Set<number>();
    const remainingEdges = [...es];
    const removedEdges = new Set<number>();

    newSteps.push({
      cover: new Set(),
      remainingEdges: [...remainingEdges],
      description: "Starting 2-Approximation for Vertex Cover. We pick an edge and add both endpoints.",
      currentEdge: null
    });

    while (remainingEdges.length > 0) {
      const edgeIdx = Math.floor(Math.random() * remainingEdges.length);
      const edge = remainingEdges[edgeIdx];
      
      cover.add(edge.from);
      cover.add(edge.to);

      const newlyRemoved: number[] = [];
      const nextRemaining = remainingEdges.filter((e, idx) => {
        const isIncident = e.from === edge.from || e.from === edge.to || e.to === edge.from || e.to === edge.to;
        if (isIncident) newlyRemoved.push(idx);
        return !isIncident;
      });

      newSteps.push({
        cover: new Set(cover),
        remainingEdges: [...nextRemaining],
        description: `Picked edge (${edge.from}, ${edge.to}). Adding both to cover and removing all incident edges.`,
        currentEdge: edge
      });

      remainingEdges.length = 0;
      remainingEdges.push(...nextRemaining);
    }

    newSteps.push({
      cover: new Set(cover),
      remainingEdges: [],
      description: `Vertex Cover complete. Size: ${cover.size}. This is at most twice the size of the optimal cover.`,
      done: true
    });

    setSteps(newSteps);
  };

  // --- Hamiltonian Cycle (Backtracking) ---
  const generateHamiltonianSteps = (ns: any[], es: any[]) => {
    const newSteps: any[] = [];
    const path: number[] = [0];
    const n = ns.length;

    const adj = Array(n).fill(0).map(() => new Set<number>());
    es.forEach(e => {
      adj[e.from].add(e.to);
      adj[e.to].add(e.from);
    });

    const solve = (curr: number) => {
      if (path.length === n) {
        if (adj[curr].has(0)) {
          newSteps.push({
            path: [...path, 0],
            description: `Found a Hamiltonian Cycle! All nodes visited and can return to start.`,
            status: 'success'
          });
          return true;
        }
        newSteps.push({
          path: [...path],
          description: `All nodes visited, but no edge back to start from ${curr}. Backtracking...`,
          status: 'fail'
        });
        return false;
      }

      for (let next = 0; next < n; next++) {
        if (adj[curr].has(next) && !path.includes(next)) {
          path.push(next);
          newSteps.push({
            path: [...path],
            description: `Visiting node ${next} from ${curr}.`,
            status: 'visiting'
          });
          if (solve(next)) return true;
          path.pop();
          newSteps.push({
            path: [...path],
            description: `Backtracking from ${next}.`,
            status: 'backtrack'
          });
        }
      }
      return false;
    };

    newSteps.push({
      path: [0],
      description: "Starting Hamiltonian Cycle search from Node 0.",
      status: 'start'
    });

    if (!solve(0)) {
      newSteps.push({
        path: [],
        description: "No Hamiltonian Cycle exists in this graph.",
        status: 'fail'
      });
    }

    setSteps(newSteps);
  };

  // --- SAT (NP-Complete Intro) ---
  const generateSATSteps = (cls: number[][], vars: boolean[]) => {
    const newSteps: any[] = [];
    const n = vars.length;

    // We'll just visualize checking a few random assignments since full SAT is exponential
    for (let attempt = 0; attempt < 3; attempt++) {
      const currentVars = Array.from({ length: n }, () => Math.random() > 0.5);
      const clauseResults = cls.map(c => {
        return c.some(lit => {
          const vIdx = Math.abs(lit) - 1;
          const val = currentVars[vIdx];
          return lit > 0 ? val : !val;
        });
      });

      const satisfiedCount = clauseResults.filter(r => r).length;
      const isSatisfied = satisfiedCount === cls.length;

      newSteps.push({
        vars: currentVars,
        clauseResults,
        description: `Checking assignment: ${currentVars.map((v, i) => `x${i+1}=${v}`).join(', ')}. ${satisfiedCount}/${cls.length} clauses satisfied.`,
        isSatisfied
      });

      if (isSatisfied) break;
    }

    newSteps.push({
      description: "SAT is the first problem proven to be NP-Complete (Cook-Levin Theorem). Finding a satisfying assignment is hard, but verifying one is easy (in P).",
      done: true
    });

    setSteps(newSteps);
  };

  const currentStep = steps[currentStepIdx] || {};

  return (
    <div className="space-y-8">
      {/* Configuration */}
      <WobblyCard variant="muted" className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-heading uppercase flex items-center gap-2">
            {algorithm === 'vertex-cover' && <Shield size={24} className="text-marker-red" />}
            {algorithm === 'hamiltonian' && <Repeat size={24} className="text-marker-red" />}
            {algorithm === 'sat' && <CheckCircle2 size={24} className="text-marker-red" />}
            {algorithm.replace('-', ' ')}
          </h3>
          <WobblyButton size="sm" variant="accent" onClick={generateRandomInput} className="flex items-center gap-2">
            <Shuffle size={16} /> Random Input
          </WobblyButton>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {(algorithm === 'vertex-cover' || algorithm === 'hamiltonian') && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-60">Custom Graph (NodeCount \n from,to...)</label>
              <div className="flex gap-2">
                <textarea 
                  value={customGraph}
                  onChange={(e) => setCustomGraph(e.target.value)}
                  placeholder="5&#10;0,1&#10;1,2&#10;2,3&#10;3,4&#10;4,0"
                  className="flex-1 p-2 border-2 border-pencil wobbly-border-sm focus:outline-none font-mono text-sm h-24"
                />
                <WobblyButton size="sm" onClick={handleCustomInput} className="self-end">Apply</WobblyButton>
              </div>
            </div>
          )}
          {algorithm === 'sat' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-60">Custom SAT (Clauses separated by ; literals by ,)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customSAT}
                  onChange={(e) => setCustomSAT(e.target.value)}
                  placeholder="1,-2,3; -1,2; 3,-4"
                  className="flex-1 p-2 border-2 border-pencil wobbly-border-sm focus:outline-none"
                />
                <WobblyButton size="sm" onClick={handleCustomInput}>Apply</WobblyButton>
              </div>
            </div>
          )}
        </div>
      </WobblyCard>

      {/* Visualization */}
      <div className="grid lg:grid-cols-3 gap-8">
        <WobblyCard className="lg:col-span-2 flex flex-col min-h-[500px] bg-pencil relative overflow-hidden">
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <WobblyButton size="sm" variant="secondary" onClick={() => setCurrentStepIdx(0)}>Reset</WobblyButton>
            <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}>Prev</WobblyButton>
            <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))}>Next</WobblyButton>
          </div>

          <div className="flex-1 relative flex items-center justify-center p-8">
            {algorithm !== 'sat' ? (
              <div className="relative w-[400px] h-[400px]">
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  {edges.map((edge, idx) => {
                    const from = nodes[edge.from];
                    const to = nodes[edge.to];
                    if (!from || !to) return null;
                    
                    const isCovered = algorithm === 'vertex-cover' && (currentStep.cover?.has(edge.from) || currentStep.cover?.has(edge.to));
                    const isCurrent = algorithm === 'vertex-cover' && currentStep.currentEdge?.from === edge.from && currentStep.currentEdge?.to === edge.to;
                    
                    let isPath = false;
                    if (algorithm === 'hamiltonian' && currentStep.path) {
                      for (let i = 0; i < currentStep.path.length - 1; i++) {
                        if ((currentStep.path[i] === edge.from && currentStep.path[i+1] === edge.to) ||
                            (currentStep.path[i] === edge.to && currentStep.path[i+1] === edge.from)) {
                          isPath = true;
                          break;
                        }
                      }
                    }

                    return (
                      <line 
                        key={idx} 
                        x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                        stroke={isCurrent ? '#FF4444' : isPath ? '#00FF00' : isCovered ? '#4444FF' : '#FFFFFF'} 
                        strokeWidth={isCurrent || isPath ? "4" : "2"}
                        strokeDasharray={isCovered || isPath ? "0" : "5,5"}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
                {nodes.map(node => {
                  const isInCover = algorithm === 'vertex-cover' && currentStep.cover?.has(node.id);
                  const isInPath = algorithm === 'hamiltonian' && currentStep.path?.includes(node.id);
                  const isLastInPath = algorithm === 'hamiltonian' && currentStep.path?.[currentStep.path.length - 1] === node.id;
                  
                  return (
                    <motion.div
                      key={node.id}
                      className={`absolute w-12 h-12 border-2 border-white rounded-full flex items-center justify-center font-heading transition-all z-10 ${
                        isLastInPath ? 'bg-marker-red text-white scale-125' :
                        isInCover || isInPath ? 'bg-pen-blue text-white' : 'bg-pencil text-white'
                      }`}
                      style={{ left: node.x - 24, top: node.y - 24 }}
                    >
                      {node.id}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full max-w-2xl space-y-8">
                <div className="flex justify-center gap-4">
                  {currentStep.vars?.map((v: boolean, i: number) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="text-xs font-bold text-white/60">x{i+1}</div>
                      <div className={`w-12 h-12 border-2 border-white flex items-center justify-center font-heading text-xl ${v ? 'bg-green-500' : 'bg-marker-red'} text-white`}>
                        {v ? 'T' : 'F'}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid gap-4">
                  {clauses.map((clause, idx) => (
                    <div key={idx} className={`p-4 border-2 border-white wobbly-border-sm flex items-center justify-between ${currentStep.clauseResults?.[idx] ? 'bg-green-500/20' : 'bg-marker-red/20'}`}>
                      <div className="font-mono text-white text-lg">
                        ({clause.map(lit => (lit > 0 ? `x${lit}` : `¬x${Math.abs(lit)}`)).join(' ∨ ')})
                      </div>
                      <div className={`font-heading ${currentStep.clauseResults?.[idx] ? 'text-green-400' : 'text-marker-red'}`}>
                        {currentStep.clauseResults?.[idx] ? 'SAT' : 'UNSAT'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </WobblyCard>

        {/* Trace */}
        <div className="flex flex-col gap-6">
          <WobblyCard variant="yellow" decoration="tape" className="flex-1">
            <h3 className="text-2xl font-heading mb-4">Complexity Trace</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white border-2 border-pencil wobbly-border-sm min-h-[120px] flex items-center justify-center text-center italic">
                "{currentStep.description || "Initializing..."}"
              </div>
              
              {algorithm === 'vertex-cover' && (
                <div className="p-4 bg-pencil text-white border-2 border-pencil wobbly-border-sm">
                  <p className="text-[10px] uppercase font-bold opacity-60">Cover Size</p>
                  <p className="text-xl font-heading">{currentStep.cover?.size || 0}</p>
                </div>
              )}
            </div>
          </WobblyCard>

          <WobblyCard variant="muted">
            <h3 className="text-xl font-heading mb-2">Complexity Insight</h3>
            <p className="text-sm italic">
              {algorithm === 'vertex-cover' && "Vertex Cover is NP-Hard. This 2-approximation algorithm is fast and guaranteed to be 'close' to optimal."}
              {algorithm === 'hamiltonian' && "Finding a Hamiltonian Cycle is NP-Complete. We use backtracking, which may take exponential time in the worst case."}
              {algorithm === 'sat' && "SAT was the first problem shown to be NP-Complete. It's the foundation of complexity theory."}
            </p>
          </WobblyCard>
        </div>
      </div>
    </div>
  );
};
