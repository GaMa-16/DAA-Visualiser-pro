import React, { useState, useEffect } from 'react';
import { WobblyCard, WobblyButton } from './ui/WobblyComponents';

interface Point {
  x: number;
  y: number;
  id: number;
}

interface GeometryVisualizerProps {
  algorithm: 'closest-pair' | 'convex-hull';
}

export const GeometryVisualizer: React.FC<GeometryVisualizerProps> = ({ algorithm }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const generateRandomPoints = () => {
    const newPoints = Array.from({ length: 12 }, (_, i) => ({
      x: Math.floor(Math.random() * 280) + 10,
      y: Math.floor(Math.random() * 180) + 10,
      id: i
    }));
    setPoints(newPoints);
    if (algorithm === 'closest-pair') solveClosestPair(newPoints);
    else solveConvexHull(newPoints);
  };

  const solveClosestPair = (pts: Point[]) => {
    const newSteps: any[] = [];
    const sorted = [...pts].sort((a, b) => a.x - b.x);
    newSteps.push({ pts: sorted, desc: "Sorting points by X-coordinate.", highlights: [] });

    const dist = (p1: Point, p2: Point) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

    const findClosest = (p: Point[]): { d: number, pair: [Point, Point] } => {
      if (p.length <= 3) {
        let minD = Infinity;
        let minPair: [Point, Point] = [p[0], p[1]];
        for (let i = 0; i < p.length; i++) {
          for (let j = i + 1; j < p.length; j++) {
            const d = dist(p[i], p[j]);
            if (d < minD) {
              minD = d;
              minPair = [p[i], p[j]];
            }
          }
        }
        newSteps.push({ pts: p, minD, minPair, desc: `Base case: Brute force for ${p.length} points. Min distance: ${minD.toFixed(2)}`, highlights: minPair.map(pt => pt.id) });
        return { d: minD, pair: minPair };
      }

      const mid = Math.floor(p.length / 2);
      const midPoint = p[mid];
      newSteps.push({ pts: p, midLine: midPoint.x, desc: `Dividing at X = ${midPoint.x}`, highlights: [] });

      const left = findClosest(p.slice(0, mid));
      const right = findClosest(p.slice(mid));

      let d = Math.min(left.d, right.d);
      let minPair = left.d < right.d ? left.pair : right.pair;

      newSteps.push({ pts: p, d, minPair, desc: `Conquering: Min distance from halves is ${d.toFixed(2)}`, highlights: minPair.map(pt => pt.id) });

      const strip = p.filter(pt => Math.abs(pt.x - midPoint.x) < d).sort((a, b) => a.y - b.y);
      newSteps.push({ pts: strip, d, desc: `Checking strip of width 2d around X = ${midPoint.x}`, highlights: strip.map(pt => pt.id) });

      for (let i = 0; i < strip.length; i++) {
        for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) < d; j++) {
          const dStrip = dist(strip[i], strip[j]);
          if (dStrip < d) {
            d = dStrip;
            minPair = [strip[i], strip[j]];
            newSteps.push({ pts: p, d, minPair, desc: `Found closer pair in strip! New min distance: ${d.toFixed(2)}`, highlights: minPair.map(pt => pt.id) });
          }
        }
      }

      return { d, pair: minPair };
    };

    findClosest(sorted);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const solveConvexHull = (pts: Point[]) => {
    const newSteps: any[] = [];
    if (pts.length < 3) return;

    const orientation = (p: Point, q: Point, r: Point) => {
      const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
      if (val === 0) return 0; // collinear
      return (val > 0) ? 1 : 2; // clock or counterclock
    };

    // Jarvis March
    const hull: Point[] = [];
    let l = 0;
    for (let i = 1; i < pts.length; i++) if (pts[i].x < pts[l].x) l = i;

    let p = l, q;
    newSteps.push({ hull: [], currentP: pts[p], desc: "Starting Jarvis March from leftmost point.", highlights: [pts[p].id] });

    do {
      hull.push(pts[p]);
      q = (p + 1) % pts.length;
      newSteps.push({ hull: [...hull], currentP: pts[p], desc: `Finding next point on hull from ${pts[p].id}`, highlights: [pts[p].id] });

      for (let i = 0; i < pts.length; i++) {
        if (orientation(pts[p], pts[i], pts[q]) === 2) {
          q = i;
          newSteps.push({ hull: [...hull], currentP: pts[p], nextQ: pts[q], desc: `Candidate point ${pts[i].id} is more counter-clockwise.`, highlights: [pts[p].id, pts[i].id] });
        }
      }
      p = q;
    } while (p !== l);

    newSteps.push({ hull: [...hull], desc: "Convex Hull complete!", highlights: hull.map(pt => pt.id) });
    setSteps(newSteps);
    setCurrentStep(0);
  };

  useEffect(() => {
    generateRandomPoints();
  }, [algorithm]);

  const stepData = steps[currentStep] || {};

  return (
    <div className="space-y-8">
      <WobblyCard variant="muted" className="flex justify-between items-center">
        <h3 className="text-xl font-heading uppercase">{algorithm.replace('-', ' ')}</h3>
        <WobblyButton size="sm" onClick={generateRandomPoints}>Regenerate Points</WobblyButton>
      </WobblyCard>

      <div className="grid md:grid-cols-2 gap-8">
        <WobblyCard className="h-[350px] relative overflow-hidden bg-white border-2 border-pencil wobbly-border-sm">
          {/* Points */}
          {points.map(pt => {
            const isHighlighted = stepData.highlights?.includes(pt.id);
            const isOnHull = stepData.hull?.find((h: Point) => h.id === pt.id);
            return (
              <div 
                key={pt.id}
                className={`absolute w-4 h-4 rounded-full border-2 border-pencil transition-all duration-300 flex items-center justify-center
                  ${isHighlighted ? 'bg-marker-red scale-150 z-20' : isOnHull ? 'bg-pen-blue scale-125 z-10' : 'bg-pencil/20'}
                `}
                style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
              >
                <span className="text-[8px] font-bold text-white">{pt.id}</span>
              </div>
            );
          })}

          {/* Closest Pair Line */}
          {algorithm === 'closest-pair' && stepData.minPair && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line 
                x1={stepData.minPair[0].x + 8} y1={stepData.minPair[0].y + 8}
                x2={stepData.minPair[1].x + 8} y2={stepData.minPair[1].y + 8}
                stroke="#FF4444" strokeWidth="2" strokeDasharray="4"
              />
            </svg>
          )}

          {/* Convex Hull Lines */}
          {algorithm === 'convex-hull' && stepData.hull && stepData.hull.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <polyline 
                points={stepData.hull.map((p: Point) => `${p.x + 8},${p.y + 8}`).join(' ')}
                fill="none" stroke="#2563EB" strokeWidth="2"
              />
              {currentStep === steps.length - 1 && (
                <line 
                  x1={stepData.hull[stepData.hull.length-1].x + 8} y1={stepData.hull[stepData.hull.length-1].y + 8}
                  x2={stepData.hull[0].x + 8} y2={stepData.hull[0].y + 8}
                  stroke="#2563EB" strokeWidth="2"
                />
              )}
            </svg>
          )}
        </WobblyCard>

        <WobblyCard variant="yellow" decoration="tape">
          <h3 className="text-2xl font-heading mb-4">Logic Trace</h3>
          <p className="text-xl italic mb-6 min-h-[80px]">"{stepData.desc}"</p>
          <div className="flex justify-between items-center">
            <WobblyButton size="sm" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>Prev</WobblyButton>
            <span className="font-bold">{currentStep + 1} / {steps.length}</span>
            <WobblyButton size="sm" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}>Next</WobblyButton>
          </div>
        </WobblyCard>
      </div>
    </div>
  );
};
