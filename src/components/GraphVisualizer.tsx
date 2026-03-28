import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';
import { motion, AnimatePresence } from 'motion/react';

interface GraphVisualizerProps {
  algorithm: 'bfs' | 'dfs' | 'floyd-warshall';
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ algorithm }) => {
  const [nodes, setNodes] = useState<{id: number, x: number, y: number}[]>([
    {id: 0, x: 100, y: 100},
    {id: 1, x: 300, y: 100},
    {id: 2, x: 100, y: 300},
    {id: 3, x: 300, y: 300},
    {id: 4, x: 200, y: 200},
  ]);
  const [edges, setEdges] = useState<{from: number, to: number, weight: number}[]>([
    {from: 0, to: 1, weight: 4},
    {from: 0, to: 2, weight: 2},
    {from: 1, to: 3, weight: 3},
    {from: 2, to: 3, weight: 1},
    {from: 4, to: 0, weight: 5},
    {from: 4, to: 3, weight: 8},
  ]);

  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const generateRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 4) + 4; // 4 to 7 nodes
    const newNodes = [];
    const padding = 50;
    const size = 300;

    for (let i = 0; i < nodeCount; i++) {
      newNodes.push({
        id: i,
        x: Math.floor(Math.random() * size) + padding,
        y: Math.floor(Math.random() * size) + padding,
      });
    }

    const newEdges: {from: number, to: number, weight: number}[] = [];
    const edgeProbability = 0.4;

    for (let i = 0; i < nodeCount; i++) {
      // Ensure each node has at least one edge to another node
      const target = (i + 1) % nodeCount;
      newEdges.push({
        from: i,
        to: target,
        weight: Math.floor(Math.random() * 9) + 1
      });

      // Add some random additional edges
      for (let j = i + 2; j < nodeCount; j++) {
        if (Math.random() < edgeProbability) {
          newEdges.push({
            from: i,
            to: j,
            weight: Math.floor(Math.random() * 9) + 1
          });
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setCurrentStepIdx(0);
  };

  const generateBFS = () => {
    const newSteps: any[] = [];
    const visited = new Set<number>();
    const queue: number[] = [0];
    const order: number[] = [];
    
    newSteps.push({
      visited: new Set(),
      queue: [0],
      current: null,
      description: "Starting BFS from Node 0. Adding 0 to queue.",
      status: 'start'
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      if (visited.has(u)) continue;
      
      visited.add(u);
      order.push(u);
      
      const neighbors = edges
        .filter(e => e.from === u || e.to === u)
        .map(e => e.from === u ? e.to : e.from)
        .filter(v => !visited.has(v));

      neighbors.forEach(v => {
        if (!queue.includes(v)) queue.push(v);
      });

      newSteps.push({
        visited: new Set(visited),
        queue: [...queue],
        current: u,
        description: `Visited Node ${u}. Neighbors to explore: ${neighbors.join(', ') || 'None'}`,
        status: 'visiting'
      });
    }

    newSteps.push({
      visited: new Set(visited),
      queue: [],
      current: null,
      description: `BFS Complete. Traversal Order: ${order.join(' -> ')}`,
      status: 'success'
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
  };

  const generateDFS = () => {
    const newSteps: any[] = [];
    const visited = new Set<number>();
    const order: number[] = [];

    const dfs = (u: number) => {
      visited.add(u);
      order.push(u);
      
      newSteps.push({
        visited: new Set(visited),
        current: u,
        description: `Visiting Node ${u}.`,
        status: 'visiting'
      });

      const neighbors = edges
        .filter(e => e.from === u || e.to === u)
        .map(e => e.from === u ? e.to : e.from)
        .filter(v => !visited.has(v));

      for (const v of neighbors) {
        if (!visited.has(v)) {
          dfs(v);
        }
      }
    };

    newSteps.push({
      visited: new Set(),
      current: null,
      description: "Starting DFS from Node 0.",
      status: 'start'
    });

    dfs(0);

    newSteps.push({
      visited: new Set(visited),
      current: null,
      description: `DFS Complete. Traversal Order: ${order.join(' -> ')}`,
      status: 'success'
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
  };

  const generateFloydWarshall = () => {
    const n = nodes.length;
    const dist = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) dist[i][i] = 0;
    edges.forEach(e => {
      dist[e.from][e.to] = e.weight;
      dist[e.to][e.from] = e.weight; // Undirected for simplicity
    });

    const newSteps: any[] = [];
    newSteps.push({
      matrix: JSON.parse(JSON.stringify(dist)),
      description: "Initial distance matrix based on direct edges.",
      k: -1
    });

    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            const oldVal = dist[i][j];
            dist[i][j] = dist[i][k] + dist[k][j];
            newSteps.push({
              matrix: JSON.parse(JSON.stringify(dist)),
              description: `Found a shorter path! ${dist[i][k]} + ${dist[k][j]} < ${oldVal === Infinity ? '∞' : oldVal}. Updating cell to ${dist[i][j]}.`,
              k, i, j,
              updatedCell: [i, j],
              oldVal,
              newVal: dist[i][j]
            });
          }
        }
      }
    }

    newSteps.push({
      matrix: JSON.parse(JSON.stringify(dist)),
      description: "Floyd-Warshall complete. All-pairs shortest paths found.",
      k: n
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
  };

  useEffect(() => {
    if (algorithm === 'bfs') generateBFS();
    else if (algorithm === 'dfs') generateDFS();
    else if (algorithm === 'floyd-warshall') generateFloydWarshall();
  }, [algorithm, nodes, edges]);

  const currentStep = steps[currentStepIdx] || {};

  return (
    <div className="space-y-8">
      <WobblyCard variant="muted" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-heading uppercase">Graph Configuration</h3>
          <WobblyButton size="sm" variant="accent" onClick={generateRandomGraph}>
            Generate Random Graph
          </WobblyButton>
        </div>
        <p className="text-sm italic opacity-60">Visualizing an undirected graph with {nodes.length} nodes. Node 0 is the start for BFS/DFS.</p>
      </WobblyCard>

      <div className="grid lg:grid-cols-3 gap-8">
        <WobblyCard className="lg:col-span-2 flex flex-col min-h-[500px] bg-pencil relative overflow-hidden">
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <WobblyButton size="sm" variant="secondary" onClick={() => setCurrentStepIdx(0)}>Reset</WobblyButton>
            <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}>Prev</WobblyButton>
            <WobblyButton size="sm" onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))}>Next</WobblyButton>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            {algorithm !== 'floyd-warshall' ? (
              <div className="relative w-[400px] h-[400px]">
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  {edges.map((edge, idx) => {
                    const from = nodes[edge.from];
                    const to = nodes[edge.to];
                    const isActive = (currentStep.current === edge.from && currentStep.visited?.has(edge.to)) || 
                                   (currentStep.current === edge.to && currentStep.visited?.has(edge.from));
                    return (
                      <line 
                        key={idx} 
                        x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                        stroke={isActive ? '#FF4444' : '#FFFFFF'} 
                        strokeWidth={isActive ? "4" : "2"}
                        strokeDasharray={isActive ? "0" : "5,5"}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
                {nodes.map(node => (
                  <motion.div
                    key={node.id}
                    className={`absolute w-12 h-12 border-2 border-white rounded-full flex items-center justify-center font-heading transition-all z-10 ${
                      currentStep.current === node.id ? 'bg-marker-red text-white scale-125' : 
                      currentStep.visited?.has(node.id) ? 'bg-pen-blue text-white' : 'bg-pencil text-white'
                    }`}
                    style={{ left: node.x - 24, top: node.y - 24 }}
                  >
                    {node.id}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 wobbly-border-sm shadow-hard-lg max-w-full overflow-auto flex flex-col items-center">
                <div className="text-center mb-6">
                  <h4 className="text-pencil font-heading text-2xl">Distance Matrix (k={currentStep.k})</h4>
                  {currentStep.k >= 0 && currentStep.k < nodes.length && (
                    <p className="italic text-sm text-pencil/70 font-mono mt-2">"Using vertex {currentStep.k} as an intermediate point."</p>
                  )}
                </div>
                <table className="border-collapse mb-6">
                  <thead>
                    <tr>
                      <th className="p-2 border-b-2 border-pencil"></th>
                      {nodes.map(n => <th key={n.id} className="p-2 border-b-2 border-pencil font-heading text-marker-red text-lg">{n.id}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {currentStep.matrix?.map((row: any, i: number) => (
                      <tr key={i}>
                        <td className="p-3 border-r-2 border-pencil font-heading text-marker-red text-lg">{i}</td>
                        {row.map((val: any, j: number) => {
                          const isUpdated = currentStep.updatedCell?.[0] === i && currentStep.updatedCell?.[1] === j;
                          const isPivot = currentStep.k === i || currentStep.k === j;
                          
                          return (
                            <td 
                              key={j} 
                              className={`p-4 border border-pencil/20 text-center font-mono text-base transition-colors ${
                                isUpdated ? 'bg-emerald-100 shadow-hard-sm z-10 scale-105 border-emerald-300' : 
                                isPivot ? 'bg-postit-yellow/50 font-bold' : ''
                              }`}
                            >
                              {isUpdated ? (
                                <div className="flex items-center justify-center gap-2">
                                  <span className="line-through text-marker-red/70">
                                    {currentStep.oldVal === Infinity ? '∞' : currentStep.oldVal}
                                  </span>
                                  <span className="text-emerald-700 font-bold text-lg">
                                    {val === Infinity ? '∞' : val}
                                  </span>
                                </div>
                              ) : (
                                val === Infinity ? '∞' : val
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center gap-3 flex-wrap mt-2">
                  {Array.from({length: nodes.length + 2}).map((_, idx) => {
                    const kVal = idx - 1;
                    const isActive = currentStep.k === kVal;
                    const isPast = currentStep.k > kVal;
                    return (
                      <div key={kVal} className={`w-10 h-10 flex items-center justify-center border-2 border-pencil wobbly-border-sm transition-all font-mono text-sm ${isActive ? 'bg-marker-red text-white scale-110 shadow-hard-sm font-bold' : isPast ? 'bg-pen-blue text-white' : 'bg-white text-pencil/40'}`}>
                        {kVal === -1 ? '-1' : kVal === nodes.length ? '✓' : kVal}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </WobblyCard>

        <div className="flex flex-col gap-6">
          <WobblyCard variant="yellow" decoration="tape" className="flex-1">
            <h3 className="text-2xl font-heading mb-4">Algorithm Trace</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white border-2 border-pencil wobbly-border-sm min-h-[120px] flex items-center justify-center text-center italic">
                "{currentStep.description || "Initializing..."}"
              </div>
              {algorithm === 'bfs' && (
                <div className="p-4 bg-pencil text-white border-2 border-pencil wobbly-border-sm">
                  <p className="text-[10px] uppercase font-bold opacity-60">Queue Status</p>
                  <p className="text-xl font-heading">
                    {currentStep.queue?.length > 0 ? `[ ${currentStep.queue.join(', ')} ]` : 'Empty'}
                  </p>
                </div>
              )}
            </div>
          </WobblyCard>
          
          <WobblyCard variant="muted">
            <h3 className="text-xl font-heading mb-2">Did you know?</h3>
            <p className="text-sm italic">
              {algorithm === 'bfs' && "BFS uses a Queue (FIFO) and is optimal for finding the shortest path in unweighted graphs."}
              {algorithm === 'dfs' && "DFS uses a Stack (LIFO) or Recursion. It's great for topological sorting and finding cycles."}
              {algorithm === 'floyd-warshall' && "Floyd-Warshall is a Dynamic Programming algorithm that finds shortest paths between all pairs of vertices."}
            </p>
          </WobblyCard>
        </div>
      </div>
    </div>
  );
};
