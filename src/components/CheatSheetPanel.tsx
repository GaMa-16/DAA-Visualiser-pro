import React from 'react';
import { WobblyCard } from './ui/WobblyComponents';
import { COMPLEXITY_DATA } from '../constants/complexities';
import { Info, Zap, Clock, Maximize, GitBranch } from 'lucide-react';

interface CheatSheetPanelProps {
  algorithmId: string;
  algorithmName: string;
}

export const CheatSheetPanel: React.FC<CheatSheetPanelProps> = ({ algorithmId, algorithmName }) => {
  const data = COMPLEXITY_DATA[algorithmId];

  if (!data) {
    return (
      <WobblyCard variant="muted" className="p-6 text-center italic opacity-60">
        Complexity data not available for this algorithm.
      </WobblyCard>
    );
  }

  return (
    <WobblyCard variant="white" className="space-y-6 overflow-hidden">
      <div className="flex items-center gap-2 border-b-2 border-pencil pb-4">
        <Info className="text-marker-blue" size={24} />
        <h3 className="text-xl font-heading uppercase">Cheat Sheet: {algorithmName}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-postit-yellow border-2 border-pencil wobbly-border-sm">
          <div className="flex items-center gap-2 mb-2 opacity-60">
            <Zap size={16} />
            <span className="text-xs font-bold uppercase">Best Case</span>
          </div>
          <p className="text-2xl font-heading text-marker-blue">{data.best}</p>
        </div>

        <div className="p-4 bg-postit-yellow border-2 border-pencil wobbly-border-sm">
          <div className="flex items-center gap-2 mb-2 opacity-60">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase">Average Case</span>
          </div>
          <p className="text-2xl font-heading text-marker-red">{data.average}</p>
        </div>

        <div className="p-4 bg-postit-yellow border-2 border-pencil wobbly-border-sm">
          <div className="flex items-center gap-2 mb-2 opacity-60">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase">Worst Case</span>
          </div>
          <p className="text-2xl font-heading text-marker-red">{data.worst}</p>
        </div>

        <div className="p-4 bg-postit-yellow border-2 border-pencil wobbly-border-sm">
          <div className="flex items-center gap-2 mb-2 opacity-60">
            <Maximize size={16} />
            <span className="text-xs font-bold uppercase">Space Complexity</span>
          </div>
          <p className="text-2xl font-heading text-pencil">{data.space}</p>
        </div>
      </div>

      {data.recurrence && (
        <div className="p-4 bg-muted-paper border-2 border-dashed border-pencil wobbly-border-sm">
          <div className="flex items-center gap-2 mb-2 opacity-60">
            <GitBranch size={16} />
            <span className="text-xs font-bold uppercase">Recurrence Relation / Logic</span>
          </div>
          <code className="text-lg font-mono block bg-white p-2 border border-pencil/20">
            {data.recurrence}
          </code>
        </div>
      )}

      <div className="text-[10px] uppercase opacity-40 italic">
        * n = input size, V = vertices, E = edges, W = capacity, m = string length
      </div>
    </WobblyCard>
  );
};
