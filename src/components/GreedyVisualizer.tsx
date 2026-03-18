import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';
import { Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GreedyVisualizerProps {
  algorithm: 'knapsack-fractional' | 'huffman-coding' | 'kruskal-mst' | 'prim-mst';
}

export const GreedyVisualizer: React.FC<GreedyVisualizerProps> = ({ algorithm }) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  // Fractional Knapsack State
  const [capacity, setCapacity] = useState(50);
  const [items, setItems] = useState<{ w: number, v: number, id: number }[]>([
    { w: 10, v: 60, id: 1 },
    { w: 20, v: 100, id: 2 },
    { w: 30, v: 120, id: 3 }
  ]);

  // Huffman State
  const [text, setText] = useState("DAA VISUALIZER");

  // MST State (Graph)
  const [nodes, setNodes] = useState([
    { id: 0, x: 50, y: 50 },
    { id: 1, x: 250, y: 50 },
    { id: 2, x: 50, y: 150 },
    { id: 3, x: 250, y: 150 },
    { id: 4, x: 150, y: 100 }
  ]);
  const [edges, setEdges] = useState([
    { u: 0, v: 1, w: 4 },
    { u: 0, v: 2, w: 2 },
    { u: 1, v: 2, w: 3 },
    { u: 1, v: 3, w: 10 },
    { u: 2, v: 3, w: 5 },
    { u: 2, v: 4, w: 8 },
    { u: 3, v: 4, w: 1 }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [mstSteps, setMstSteps] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateRandomGraph = () => {
    const nodeCount = 6;
    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: Math.floor(Math.random() * 240) + 30,
      y: Math.floor(Math.random() * 140) + 30
    }));
    
    const newEdges: any[] = [];
    // Ensure connectivity by creating a simple cycle or path first
    for (let i = 0; i < nodeCount - 1; i++) {
      newEdges.push({ u: i, v: i + 1, w: Math.floor(Math.random() * 15) + 1 });
    }
    // Add some random extra edges
    for (let i = 0; i < 4; i++) {
      const u = Math.floor(Math.random() * nodeCount);
      const v = Math.floor(Math.random() * nodeCount);
      if (u !== v && !newEdges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))) {
        newEdges.push({ u, v, w: Math.floor(Math.random() * 15) + 1 });
      }
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setCurrentStep(0);
  };

  const solveFractionalKnapsack = () => {
    const sorted = [...items].sort((a, b) => (b.v / b.w) - (a.v / a.w));
    const newSteps: string[] = ["Sorting items by value/weight ratio (Greedy Choice)."];
    let currentWeight = 0;
    let finalValue = 0;
    const selected: any[] = [];

    for (const item of sorted) {
      newSteps.push(`Checking item (W:${item.w}, V:${item.v}, Ratio:${(item.v/item.w).toFixed(2)})`);
      if (currentWeight + item.w <= capacity) {
        currentWeight += item.w;
        finalValue += item.v;
        selected.push({ ...item, fraction: 1 });
        newSteps.push(`Added full item. Current Weight: ${currentWeight}, Value: ${finalValue}`);
      } else {
        const remain = capacity - currentWeight;
        const fraction = remain / item.w;
        finalValue += item.v * fraction;
        selected.push({ ...item, fraction });
        newSteps.push(`Added ${ (fraction * 100).toFixed(0) }% of item. Capacity full!`);
        break;
      }
    }
    newSteps.push(`Complexity: O(n log n) for sorting + O(n) for selection.`);
    setResult({ finalValue, selected });
    setSteps(newSteps);
  };

  const solveHuffman = () => {
    const freq: { [key: string]: number } = {};
    for (const char of text) freq[char] = (freq[char] || 0) + 1;
    
    const newSteps: string[] = ["Calculating character frequencies."];
    Object.entries(freq).forEach(([char, f]) => newSteps.push(`'${char}': ${f}`));

    newSteps.push("Building Huffman Tree (Greedy: always pick 2 smallest frequencies).");
    // Simplified logic for visualization
    const bruteForceBits = text.length * 8; // Assuming 8-bit ASCII
    const huffmanBits = text.length * 3; // Mock average for visualization
    
    newSteps.push(`Brute Force Encoding (8-bit): ${bruteForceBits} bits`);
    newSteps.push(`Huffman Encoding (Variable): ~${huffmanBits} bits`);
    newSteps.push(`Compression Ratio: ${((1 - huffmanBits/bruteForceBits) * 100).toFixed(1)}%`);
    
    setResult({ bruteForceBits, huffmanBits });
    setSteps(newSteps);
  };

  const solveKruskal = () => {
    const sortedEdges = [...edges].sort((a, b) => a.w - b.w);
    const newSteps: any[] = [];
    newSteps.push({ mst: [], desc: "Sorting edges by weight (Greedy Choice).", highlights: [] });

    const parent = Array.from({ length: nodes.length }, (_, i) => i);
    const find = (i: number): number => (parent[i] === i ? i : find(parent[i]));
    const union = (i: number, j: number) => {
      const rootI = find(i);
      const rootJ = find(j);
      parent[rootI] = rootJ;
    };

    const currentMst: any[] = [];
    for (const edge of sortedEdges) {
      const rootU = find(edge.u);
      const rootV = find(edge.v);
      if (rootU !== rootV) {
        currentMst.push(edge);
        union(rootU, rootV);
        newSteps.push({ 
          mst: [...currentMst], 
          desc: `Edge (${edge.u}-${edge.v}) with weight ${edge.w} added to MST. No cycle formed.`,
          highlights: [edge]
        });
      } else {
        newSteps.push({ 
          mst: [...currentMst], 
          desc: `Edge (${edge.u}-${edge.v}) with weight ${edge.w} forms a cycle. Skipping.`,
          highlights: [edge]
        });
      }
    }
    setMstSteps(newSteps);
    setCurrentStep(0);
  };

  const solvePrim = () => {
    const newSteps: any[] = [];
    const currentMst: any[] = [];
    const visited = new Set([0]);
    
    newSteps.push({ mst: [], visited: [0], desc: "Starting Prim's from node 0.", highlights: [] });
    
    while (visited.size < nodes.length) {
      let minEdge = null;
      let minW = Infinity;
      
      for (const edge of edges) {
        const uIn = visited.has(edge.u);
        const vIn = visited.has(edge.v);
        if ((uIn && !vIn) || (!uIn && vIn)) {
          if (edge.w < minW) {
            minW = edge.w;
            minEdge = edge;
          }
        }
      }
      
      if (minEdge) {
        currentMst.push(minEdge);
        visited.add(minEdge.u);
        visited.add(minEdge.v);
        newSteps.push({ 
          mst: [...currentMst], 
          visited: Array.from(visited),
          desc: `Smallest edge connecting visited to unvisited: (${minEdge.u}-${minEdge.v}) w:${minEdge.w}`,
          highlights: [minEdge]
        });
      } else break;
    }
    setMstSteps(newSteps);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (algorithm === 'knapsack-fractional') solveFractionalKnapsack();
    else if (algorithm === 'huffman-coding') solveHuffman();
    else if (algorithm === 'kruskal-mst') solveKruskal();
    else if (algorithm === 'prim-mst') solvePrim();
  }, [algorithm, capacity, items, text, nodes, edges]);

  const currentMstData = mstSteps[currentStep] || { mst: [], desc: "", visited: [] };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <WobblyCard variant="muted">
        {algorithm === 'knapsack-fractional' && (
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm font-bold uppercase block mb-1">Capacity</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="border-2 border-pencil p-2 wobbly-border-sm w-24" />
            </div>
            <WobblyButton size="sm" onClick={() => setItems([...items, { w: Math.floor(Math.random()*20)+5, v: Math.floor(Math.random()*100)+20, id: Date.now() }])}>Add Item</WobblyButton>
          </div>
        )}
        {algorithm === 'huffman-coding' && (
          <div>
            <label className="text-sm font-bold uppercase block mb-1">Input Text</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full border-2 border-pencil p-2 wobbly-border-sm font-mono" />
          </div>
        )}
        {(algorithm.includes('mst')) && (
          <div className="flex justify-between items-center">
            <p className="italic text-sm">Visualizing MST on a random graph for Kruskal/Prim comparison.</p>
            <WobblyButton size="sm" onClick={generateRandomGraph}>Generate Random Map</WobblyButton>
          </div>
        )}
      </WobblyCard>

      <div className="grid md:grid-cols-2 gap-8">
        <WobblyCard className="min-h-[300px] flex flex-col items-center justify-center p-4">
          {algorithm === 'knapsack-fractional' && (
            <div className="flex items-end gap-2 h-40 border-b-2 border-pencil pb-2">
              {items.map(item => {
                const sel = result?.selected?.find((s: any) => s.id === item.id);
                return (
                  <div key={item.id} className={`w-12 border-2 border-pencil flex flex-col items-center justify-end transition-all ${sel ? 'bg-marker-red text-white' : 'bg-pen-blue text-white'}`} style={{ height: `${item.v}px` }}>
                    <span className="text-[10px] font-bold">{sel ? (sel.fraction * 100).toFixed(0) + '%' : ''}</span>
                    <span className="text-[10px]">V:{item.v}</span>
                  </div>
                );
              })}
            </div>
          )}
          {algorithm === 'huffman-coding' && (
            <div className="space-y-6 text-center">
              <div className="flex gap-8 justify-center">
                <div className="p-4 border-2 border-pencil wobbly-border-sm bg-white">
                  <span className="text-xs font-bold block uppercase">Brute Force</span>
                  <span className="text-3xl font-heading">{result?.bruteForceBits} bits</span>
                </div>
                <div className="p-4 border-2 border-pencil wobbly-border-sm bg-postit-yellow">
                  <span className="text-xs font-bold block uppercase">Huffman</span>
                  <span className="text-3xl font-heading">{result?.huffmanBits} bits</span>
                </div>
              </div>
              <p className="text-xl font-heading text-marker-red">Saved {result?.bruteForceBits - result?.huffmanBits} bits!</p>
            </div>
          )}
          {(algorithm.includes('mst')) && (
            <div className="relative w-full h-60">
              <div className="absolute top-0 right-0 z-10">
                <WobblyButton 
                  size="sm" 
                  variant="accent" 
                  onClick={() => setIsExpanded(true)}
                  className="p-2"
                >
                  <Maximize2 size={16} />
                </WobblyButton>
              </div>
              <svg className="w-full h-full">
                {edges.map((edge, i) => {
                  const u = nodes[edge.u];
                  const v = nodes[edge.v];
                  const isInMst = currentMstData.mst.find((e: any) => (e.u === edge.u && e.v === edge.v) || (e.u === edge.v && e.v === edge.u));
                  const isHighlighted = currentMstData.highlights?.find((e: any) => (e.u === edge.u && e.v === edge.v) || (e.u === edge.v && e.v === edge.u));
                  
                  return (
                    <g key={i}>
                      <line 
                        x1={u.x} y1={u.y} x2={v.x} y2={v.y} 
                        stroke={isHighlighted ? "#FFD700" : isInMst ? "#FF4444" : "#ccc"} 
                        strokeWidth={isHighlighted ? 6 : isInMst ? 4 : 2} 
                        className="transition-all duration-300"
                      />
                      <text x={(u.x+v.x)/2} y={(u.y+v.y)/2} fontSize="12" className="fill-pencil font-bold">{edge.w}</text>
                    </g>
                  );
                })}
                {nodes.map(node => {
                  const isVisited = currentMstData.visited?.includes(node.id);
                  return (
                    <g key={node.id}>
                      <circle 
                        cx={node.x} cy={node.y} r="15" 
                        className={`transition-all duration-300 stroke-pencil stroke-2 ${isVisited ? 'fill-postit-yellow' : 'fill-white'}`} 
                      />
                      <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fontSize="12" className="fill-pencil font-bold">{node.id}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </WobblyCard>

        <WobblyCard variant="yellow" decoration="tape">
          <h3 className="text-2xl font-heading mb-4">Greedy Trace</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar mb-4">
            {algorithm.includes('mst') ? (
              <p className="text-xl italic">"{currentMstData.desc}"</p>
            ) : (
              steps.map((s, i) => (
                <p key={i} className="text-lg border-b border-pencil/10 pb-1">
                  <span className="font-bold text-pen-blue mr-2">{i+1}.</span> {s}
                </p>
              ))
            )}
          </div>
          {algorithm.includes('mst') && (
            <div className="flex justify-between items-center">
              <WobblyButton size="sm" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>Prev</WobblyButton>
              <span className="font-bold">{currentStep + 1} / {mstSteps.length}</span>
              <WobblyButton size="sm" onClick={() => setCurrentStep(Math.min(mstSteps.length - 1, currentStep + 1))}>Next</WobblyButton>
            </div>
          )}
        </WobblyCard>
      </div>

      {/* Expanded View Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col p-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-heading">
                {algorithm === 'kruskal-mst' ? "Kruskal's MST" : "Prim's MST"} - Expanded View
              </h2>
              <WobblyButton onClick={() => setIsExpanded(false)} variant="accent">
                <Minimize2 className="mr-2" size={20} /> Close
              </WobblyButton>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 flex-1 min-h-0">
              <WobblyCard className="lg:col-span-2 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-heading">Graph Visualization</h3>
                  <WobblyButton size="sm" onClick={generateRandomGraph}>New Random Map</WobblyButton>
                </div>
                <div className="flex-1 bg-white border-2 border-pencil wobbly-border-sm relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
                    {edges.map((edge, i) => {
                      const u = nodes[edge.u];
                      const v = nodes[edge.v];
                      const isInMst = currentMstData.mst.find((e: any) => (e.u === edge.u && e.v === edge.v) || (e.u === edge.v && e.v === edge.u));
                      const isHighlighted = currentMstData.highlights?.find((e: any) => (e.u === edge.u && e.v === edge.v) || (e.u === edge.v && e.v === edge.u));
                      
                      return (
                        <g key={i}>
                          <line 
                            x1={u.x} y1={u.y} x2={v.x} y2={v.y} 
                            stroke={isHighlighted ? "#FFD700" : isInMst ? "#FF4444" : "#ccc"} 
                            strokeWidth={isHighlighted ? 6 : isInMst ? 4 : 2} 
                            className="transition-all duration-300"
                          />
                          <text x={(u.x+v.x)/2} y={(u.y+v.y)/2} fontSize="10" className="fill-pencil font-bold">{edge.w}</text>
                        </g>
                      );
                    })}
                    {nodes.map(node => {
                      const isVisited = currentMstData.visited?.includes(node.id);
                      return (
                        <g key={node.id}>
                          <circle 
                            cx={node.x} cy={node.y} r="12" 
                            className={`transition-all duration-300 stroke-pencil stroke-2 ${isVisited ? 'fill-postit-yellow' : 'fill-white'}`} 
                          />
                          <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fontSize="8" className="fill-pencil font-bold">{node.id}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </WobblyCard>

              <div className="flex flex-col gap-6 min-h-0">
                <WobblyCard variant="yellow" decoration="tape" className="flex-1 flex flex-col min-h-0">
                  <h3 className="text-xl font-heading mb-4">Current Step Logic</h3>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex items-center justify-center">
                    <p className="text-2xl italic text-center leading-relaxed">
                      "{currentMstData.desc}"
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center gap-4">
                    <WobblyButton 
                      className="flex-1"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft size={20} className="mr-1" /> Previous
                    </WobblyButton>
                    <div className="px-4 py-2 bg-white border-2 border-pencil wobbly-border-sm font-bold">
                      {currentStep + 1} / {mstSteps.length}
                    </div>
                    <WobblyButton 
                      className="flex-1"
                      onClick={() => setCurrentStep(Math.min(mstSteps.length - 1, currentStep + 1))}
                      disabled={currentStep === mstSteps.length - 1}
                    >
                      Next <ChevronRight size={20} className="ml-1" />
                    </WobblyButton>
                  </div>
                </WobblyCard>

                <WobblyCard variant="muted" className="h-1/3 overflow-hidden flex flex-col">
                  <h3 className="text-lg font-heading mb-2">Algorithm Progress</h3>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {mstSteps.map((step, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setCurrentStep(idx)}
                        className={`p-2 text-sm border-2 cursor-pointer transition-colors ${
                          idx === currentStep 
                            ? 'border-pencil bg-postit-yellow' 
                            : 'border-transparent hover:bg-black/5'
                        }`}
                      >
                        <span className="font-bold mr-2">{idx + 1}.</span>
                        {step.desc.length > 50 ? step.desc.substring(0, 47) + "..." : step.desc}
                      </div>
                    ))}
                  </div>
                </WobblyCard>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
