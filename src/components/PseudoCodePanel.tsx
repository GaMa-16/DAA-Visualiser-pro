import React from 'react';
import { WobblyCard } from './ui/WobblyComponents';
import { PSEUDOCODE_DATA } from '../constants/pseudocode';
import { Code2, ListChecks, Terminal } from 'lucide-react';

interface PseudoCodePanelProps {
  algorithmId: string;
  algorithmName: string;
}

export const PseudoCodePanel: React.FC<PseudoCodePanelProps> = ({ algorithmId, algorithmName }) => {
  const data = PSEUDOCODE_DATA[algorithmId];

  if (!data) {
    return (
      <WobblyCard variant="muted" className="p-6 text-center italic opacity-60">
        Algorithm steps and pseudo code not available for this module yet.
      </WobblyCard>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Steps Section */}
      <WobblyCard variant="white" className="space-y-6">
        <div className="flex items-center gap-2 border-b-2 border-pencil pb-4">
          <ListChecks className="text-marker-red" size={24} />
          <h3 className="text-xl font-heading uppercase">Algorithm Steps</h3>
        </div>
        
        <ul className="space-y-4">
          {data.steps.map((step, idx) => (
            <li key={idx} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-postit-yellow border-2 border-pencil flex items-center justify-center font-bold font-heading">
                {idx + 1}
              </span>
              <p className="text-lg pt-1">{step}</p>
            </li>
          ))}
        </ul>
      </WobblyCard>

      {/* Pseudo Code Section */}
      <WobblyCard variant="white" className="space-y-6">
        <div className="flex items-center gap-2 border-b-2 border-pencil pb-4">
          <Terminal className="text-pen-blue" size={24} />
          <h3 className="text-xl font-heading uppercase">Pseudo Code</h3>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-pencil/5 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <pre className="relative bg-zinc-900 text-zinc-100 p-6 rounded-lg font-mono text-sm overflow-x-auto border-2 border-pencil shadow-inner">
            <code className="block whitespace-pre">
              {data.pseudocode}
            </code>
          </pre>
          <div className="absolute top-2 right-2 opacity-20">
            <Code2 size={40} />
          </div>
        </div>
        
        <div className="p-3 bg-paper border-2 border-dashed border-pencil text-xs italic text-pencil/60">
          Note: This is a high-level representation. Actual implementation details may vary based on the programming language.
        </div>
      </WobblyCard>
    </div>
  );
};
