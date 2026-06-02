import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  // Setup the tool context state: 'oracle', 'rawi', or 'spark'
  const [activeTool, setActiveTool] = useState<'oracle' | 'rawi' | 'spark'>('oracle');

  const subjects = [
    { id: 'sub-1', num: '01', title: 'Mathematical Vectors', desc: 'Uncover personal spatial intelligence parameters using directional mechanics.' },
    { id: 'sub-2', num: '02', title: 'Computational Logic', desc: 'Deconstruct systematic ambiguity frameworks through declarative code execution.' },
    { id: 'sub-3', num: '03', title: 'Quantum Physics', desc: 'Map parallel interest vectors to establish continuous learning behaviors.' },
    { id: 'sub-4', num: '04', title: 'Cognitive Science', desc: 'Study behavioral alignment schemas to dismantle hidden ambiguity constraints.' },
    { id: 'sub-5', num: '05', title: 'Advanced Linguistics', desc: 'Deconstruct contextual dialogue matrices to optimize path mapping filters.' },
    { id: 'sub-6', num: '06', title: 'Algorithmic Systems', desc: 'Design deep optimization branches tailored specifically around how your brain learns.' }
  ];

  return (
    <div 
      className="curriculum-view-container min-h-screen tech-grid p-4 sm:p-8 md:p-12 transition-all duration-700" 
      data-active-tool={activeTool}
      data-tool={activeTool}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PRESENTATIONAL MASTER CONTROL HERO */}
        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-white/5 animate-fade-up">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl font-extrabold font-display tracking-tight text-white">
              EDUCIS
            </h1>
            <p className="text-sm text-cyan-400/80 font-mono">
              STATUS: <span className="uppercase tracking-wider text-white bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{activeTool} engine online</span>
            </p>
          </div>

          {/* ENGINE CONTROLLER CHIPS */}
          <div className="flex bg-black/40 p-1.5 rounded-full border border-white/5 gap-1 shadow-inner backdrop-blur-xl">
            <button 
              type="button"
              onClick={() => setActiveTool('oracle')}
              className={`category-chip ${activeTool === 'oracle' ? 'active' : ''}`}
            >
              Oracle Vision
            </button>
            <button 
              type="button"
              onClick={() => setActiveTool('rawi')}
              className={`category-chip ${activeTool === 'rawi' ? 'active' : ''}`}
            >
              Rawi Insights
            </button>
            <button 
              type="button"
              onClick={() => setActiveTool('spark')}
              className={`category-chip ${activeTool === 'spark' ? 'active' : ''}`}
            >
              Spark Nexus
            </button>
          </div>
        </div>

        {/* CORE 6-SUBJECT MATRIX MAP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
          {subjects.map((sub) => (
            <div 
              key={sub.id} 
              className={`hud-card glass rounded-xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[250px] ${
                activeTool === 'rawi' ? 'hud-card-rawi' : activeTool === 'spark' ? 'hud-card-spark' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono px-2.5 py-1 bg-white/5 rounded text-white/60 tracking-wider">
                    MODULE {sub.num}
                  </span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    activeTool === 'rawi' ? 'bg-[#d4a843] shadow-[0_0_12px_#d4a843]' :
                    activeTool === 'spark' ? 'bg-[#8b5cf6] shadow-[0_0_12px_#8b5cf6]' :
                    'bg-[#00d4ff] shadow-[0_0_12px_#00d4ff]'
                  }`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white font-display tracking-tight">
                  {sub.title}
                </h3>
                <p className="text-sm text-slate-400/80 leading-relaxed">
                  {sub.desc}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="shimmer h-1.5 w-full bg-white/5 rounded-full overflow-hidden" />
                <Button 
                  className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono tracking-wider transition-all duration-300"
                  variant="outline"
                >
                  ENGAGE BLUEPRINT
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
