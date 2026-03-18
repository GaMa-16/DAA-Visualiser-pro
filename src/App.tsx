import React, { useState } from 'react';
import { WobblyCard, WobblyButton } from './components/ui/WobblyComponents';
import { MasterTheoremSolver } from './components/MasterTheoremSolver';
import { SortingVisualizer } from './components/SortingVisualizer';
import { DivideConquerVisualizer } from './components/DivideConquerVisualizer';
import { GeometryVisualizer } from './components/GeometryVisualizer';
import { MatrixVisualizer } from './components/MatrixVisualizer';
import { GreedyVisualizer } from './components/GreedyVisualizer';
import { DynamicProgrammingVisualizer } from './components/DynamicProgrammingVisualizer';
import { BacktrackingVisualizer } from './components/BacktrackingVisualizer';
import { BranchAndBoundVisualizer } from './components/BranchAndBoundVisualizer';
import { GraphVisualizer } from './components/GraphVisualizer';
import { RandomizedVisualizer } from './components/RandomizedVisualizer';
import { ComplexityVisualizer } from './components/ComplexityVisualizer';
import { BenchmarkPanel } from './components/BenchmarkPanel';
import { CheatSheetPanel } from './components/CheatSheetPanel';
import { PseudoCodePanel } from './components/PseudoCodePanel';
import { 
  BookOpen, 
  Zap, 
  Target, 
  GitBranch, 
  Calculator, 
  Undo2,
  BarChart3, 
  HelpCircle,
  Menu,
  X,
  Search,
  Layers,
  Network,
  Share2,
  Dices,
  BrainCircuit,
  Activity,
  Info,
  Code2,
  Sun,
  Moon,
  Instagram,
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

type Module = 'fundamentals' | 'divide-conquer' | 'greedy' | 'dynamic-programming' | 'optimization' | 'backtracking' | 'branch-bound' | 'graphs' | 'randomized' | 'complexity' | 'sandbox';

import { ChatBot } from './components/ChatBot';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('fundamentals');
  const [activeAlgo, setActiveAlgo] = useState<string>('bubble');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showPseudoCode, setShowPseudoCode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const modules = [
    { 
      id: 'fundamentals', 
      name: 'Searching & Sorting', 
      icon: <BookOpen size={20} />,
      algos: ['bubble', 'insertion', 'linear-search', 'binary-search']
    },
    { 
      id: 'divide-conquer', 
      name: 'Divide & Conquer', 
      icon: <GitBranch size={20} />,
      algos: ['min-max', 'kadane', 'merge-sort', 'quick-sort']
    },
    { 
      id: 'greedy', 
      name: 'Greedy Algorithms', 
      icon: <Zap size={20} />,
      algos: ['knapsack-fractional', 'huffman-coding', 'kruskal-mst', 'prim-mst']
    },
    { 
      id: 'dynamic-programming', 
      name: 'Dynamic Programming', 
      icon: <Layers size={20} />,
      algos: ['knapsack-01', 'matrix-chain', 'lcs', 'obst']
    },
    { 
      id: 'optimization', 
      name: 'Optimization', 
      icon: <Target size={20} />,
      algos: ['closest-pair', 'convex-hull', 'strassen', 'min-max', 'kadane']
    },
    { 
      id: 'backtracking', 
      name: 'Backtracking', 
      icon: <Undo2 size={20} />,
      algos: ['n-queens', 'sum-of-subsets', 'hamiltonian-circuit']
    },
    { 
      id: 'branch-bound', 
      name: 'Branch and Bound', 
      icon: <Network size={20} />,
      algos: ['knapsack-bb', 'tsp']
    },
    { 
      id: 'graphs', 
      name: 'Graphs Algorithms', 
      icon: <Share2 size={20} />,
      algos: ['bfs', 'dfs', 'floyd-warshall']
    },
    { 
      id: 'randomized', 
      name: 'Randomized Algorithms', 
      icon: <Dices size={20} />,
      algos: ['hiring', 'quick-sort', 'rabin-karp']
    },
    { 
      id: 'complexity', 
      name: 'Approximation & Complexity', 
      icon: <BrainCircuit size={20} />,
      algos: ['vertex-cover', 'hamiltonian', 'sat']
    },
    { 
      id: 'sandbox', 
      name: 'Complexity Sandbox', 
      icon: <HelpCircle size={20} />,
      algos: ['master-theorem']
    },
  ];

  const handleModuleChange = (modId: Module) => {
    setActiveModule(modId);
    const mod = modules.find(m => m.id === modId);
    if (mod && mod.algos.length > 0) {
      setActiveAlgo(mod.algos[0]);
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-zinc-900 border-b-2 border-pencil p-4 flex justify-between items-center z-50">
        <h1 className="text-2xl font-heading">DAA Visualizer Pro</h1>
        <div className="flex gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Desktop Theme Toggle */}
      <div className="hidden md:block fixed top-6 right-6 z-50">
        <WobblyButton
          variant="secondary"
          size="sm"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-12 h-12 flex items-center justify-center p-0"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </WobblyButton>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`
              fixed md:relative inset-y-0 left-0 w-72 bg-white dark:bg-zinc-900 border-r-[3px] border-pencil p-6 z-40
              flex flex-col gap-8 overflow-y-auto
              ${isSidebarOpen ? 'block' : 'hidden md:flex'}
            `}
          >
            <div className="hidden md:block">
              <h1 className="text-3xl font-heading leading-tight">
                DAA <br /> Visualizer <br /> <span className="text-marker-red">Pro</span>
              </h1>
              <div className="h-1 w-20 bg-pencil mt-2 wobbly-border-sm" />
            </div>

            <nav className="flex flex-col gap-3">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => handleModuleChange(mod.id as Module)}
                  className={`
                    flex items-center gap-3 p-3 text-xl font-heading transition-all
                    border-2 border-transparent hover:border-pencil wobbly-border-sm
                    ${activeModule === mod.id ? 'bg-postit-yellow border-pencil shadow-hard-sm' : 'hover:bg-muted-paper'}
                  `}
                >
                  {mod.icon}
                  {mod.name}
                </button>
              ))}
            </nav>

            <div className="mt-auto">
              <WobblyCard variant="muted" className="p-4 text-sm">
                <p className="font-bold uppercase mb-1">Quick Tip:</p>
                <p className="italic">You can now enter custom values for every algorithm!</p>
              </WobblyCard>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block bg-marker-red text-white px-3 py-1 text-sm font-bold uppercase wobbly-border-sm mb-2">
              21CSC204J Syllabus
            </div>
            <h2 className="text-6xl md:text-7xl font-heading">
              {modules.find(m => m.id === activeModule)?.name}
            </h2>
          </div>
          
          <div className="flex gap-4">
            <WobblyButton 
              variant={showPseudoCode ? "accent" : "secondary"} 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowPseudoCode(!showPseudoCode)}
            >
              <Code2 size={18} /> {showPseudoCode ? "Hide Pseudo Code" : "Pseudo Code"}
            </WobblyButton>
            <WobblyButton 
              variant={showCheatSheet ? "accent" : "secondary"} 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowCheatSheet(!showCheatSheet)}
            >
              <Info size={18} /> {showCheatSheet ? "Hide Cheat Sheet" : "Cheat Sheet"}
            </WobblyButton>
            <WobblyButton 
              variant={showBenchmark ? "accent" : "secondary"} 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowBenchmark(!showBenchmark)}
            >
              <Activity size={18} /> {showBenchmark ? "Hide Benchmarks" : "Benchmarks"}
            </WobblyButton>
          </div>
        </header>

        {/* Sub-navigation for Algorithms */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          {modules.find(m => m.id === activeModule)?.algos.map(algo => (
            <div key={algo} className="relative">
              <WobblyButton 
                size="sm" 
                variant={activeAlgo === algo ? 'accent' : 'primary'}
                onClick={() => setActiveAlgo(algo)}
                className="whitespace-nowrap"
              >
                {algo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </WobblyButton>
              {activeAlgo === algo && (
                <motion.div 
                  layoutId="activeTabMarker"
                  className="absolute -bottom-2 left-0 right-0 h-1.5 bg-marker-red wobbly-border-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule + activeAlgo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {showPseudoCode && (
              <div className="mb-12">
                <PseudoCodePanel 
                  algorithmId={activeAlgo} 
                  algorithmName={activeAlgo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
                />
              </div>
            )}

            {activeModule === 'fundamentals' && (
              <SortingVisualizer algorithm={activeAlgo as any} />
            )}

            {activeModule === 'divide-conquer' && (
              ['merge-sort', 'quick-sort'].includes(activeAlgo) ? (
                <SortingVisualizer algorithm={activeAlgo.replace('-sort', '') as any} />
              ) : (
                <DivideConquerVisualizer algorithm={activeAlgo as any} />
              )
            )}

            {activeModule === 'greedy' && (
              <GreedyVisualizer algorithm={activeAlgo as any} />
            )}

            {activeModule === 'dynamic-programming' && (
              <DynamicProgrammingVisualizer algorithm={activeAlgo as any} />
            )}

            {activeModule === 'backtracking' && (
              <BacktrackingVisualizer algorithm={activeAlgo as any} />
            )}

            {activeModule === 'branch-bound' && (
              <BranchAndBoundVisualizer algorithm={activeAlgo as any} />
            )}

            {activeModule === 'graphs' && (
              <GraphVisualizer algorithm={activeAlgo as any} />
            )}

            {activeModule === 'randomized' && (
              <RandomizedVisualizer algorithm={activeAlgo as any} />
            )}

            {activeModule === 'complexity' && (
              <ComplexityVisualizer algorithm={activeAlgo as any} />
            )}

            {activeModule === 'optimization' && (
              ['closest-pair', 'convex-hull'].includes(activeAlgo) ? (
                <GeometryVisualizer algorithm={activeAlgo as any} />
              ) : activeAlgo === 'strassen' ? (
                <MatrixVisualizer algorithm="strassen" />
              ) : (
                <DivideConquerVisualizer algorithm={activeAlgo as any} />
              )
            )}

            {activeModule === 'sandbox' && (
              <div className="space-y-12">
                <MasterTheoremSolver />
                
                <WobblyCard variant="white" className="max-w-3xl mx-auto">
                  <h3 className="text-3xl mb-4">Master Theorem Cheat Sheet</h3>
                  <div className="space-y-4 text-lg">
                    <div className="p-3 border-2 border-dashed border-pencil wobbly-border-sm">
                      <p><strong>Case 1:</strong> If log_b(a) &gt; k, then T(n) = Θ(n^{'{'}log_b(a){'}'})</p>
                    </div>
                    <div className="p-3 border-2 border-dashed border-pencil wobbly-border-sm">
                      <p><strong>Case 2:</strong> If log_b(a) = k, then T(n) = Θ(n^k log^{'{'}p+1{'}'} n)</p>
                    </div>
                    <div className="p-3 border-2 border-dashed border-pencil wobbly-border-sm">
                      <p><strong>Case 3:</strong> If log_b(a) &lt; k, then T(n) = Θ(n^k log^p n)</p>
                    </div>
                  </div>
                </WobblyCard>
              </div>
            )}

            {!['fundamentals', 'divide-conquer', 'greedy', 'dynamic-programming', 'optimization', 'backtracking', 'branch-bound', 'graphs', 'randomized', 'complexity', 'sandbox'].includes(activeModule) && (
              <WobblyCard variant="yellow" className="text-center py-20">
                <h3 className="text-4xl mb-4">Under Construction! 🏗️</h3>
                <p className="text-xl">Our scribbles for this module are still being sketched out. Check back soon!</p>
              </WobblyCard>
            )}
          </motion.div>
        </AnimatePresence>

        {showCheatSheet && (
          <div className="mt-8">
            <CheatSheetPanel 
              algorithmId={activeAlgo} 
              algorithmName={activeAlgo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
            />
          </div>
        )}

        {showBenchmark && (
          <div className="mt-12">
            <BenchmarkPanel 
              algorithmId={activeAlgo} 
              algorithmName={activeAlgo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 py-10 border-t-2 border-pencil border-dashed">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="font-heading text-2xl">Gargeek Nama</p>
              <p className="text-pencil/60 italic">Algorithm Enthusiast & Developer</p>
            </div>
            
            <div className="flex gap-6">
              <a 
                href="https://instagram.com/gargeek_nama" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-marker-red transition-colors"
              >
                <Instagram size={20} />
                <span className="font-bold">gargeek_nama</span>
              </a>
              <a 
                href="https://github.com/GaMa-16" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pen-blue transition-colors"
              >
                <Github size={20} />
                <span className="font-bold">GaMa-16</span>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-pencil/40">
            © {new Date().getFullYear()} • Built with Passion & Scribbles
          </div>
        </footer>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-10 right-10 opacity-10 pointer-events-none hidden lg:block">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path d="M10,10 Q50,150 190,190" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="10,10" />
          <circle cx="190" cy="190" r="5" fill="currentColor" />
        </svg>
      </div>
      <ChatBot />
    </div>
  );
}
