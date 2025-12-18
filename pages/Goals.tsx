
import React, { useState, useEffect } from 'react';
import { SavingsGoal, PRESET_GOAL_ICONS } from '../types';
import { GOAL_ICON_COMPONENTS } from '../constants';
import { GlassCard, GlassButton, GlassInput } from '../components/ui/Glass';
import { Target, Plus, Trash2, ArrowUpRight, CheckCircle2, Rocket, Compass, Sparkles, Wand2 } from 'lucide-react';

interface Props {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateGoal: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
  currency: string;
}

export const Goals: React.FC<Props> = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal, currency }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('target');
  const [contribution, setContribution] = useState<Record<string, string>>({});
  const [isAnimatingIcon, setIsAnimatingIcon] = useState(false);

  // Reset state when opening modal
  useEffect(() => {
    if (isAdding) {
      setSelectedIcon('target');
      setName('');
      setTarget('');
    }
  }, [isAdding]);

  const handleAdd = () => {
    if (!name || !target) return;
    onAddGoal({
      name,
      targetAmount: parseFloat(target),
      currentAmount: 0,
      icon: selectedIcon
    });
    setIsAdding(false);
  };

  const handleContribute = (id: string) => {
    const amount = parseFloat(contribution[id] || '0');
    if (isNaN(amount) || amount <= 0) return;
    onUpdateGoal(id, amount);
    setContribution({ ...contribution, [id]: '' });
  };

  // Simple "AI" matcher that guesses the icon key based on the name
  const smartSelectIcon = () => {
    setIsAnimatingIcon(true);
    const lowerName = name.toLowerCase();
    let match = 'target';

    // Tech
    if (lowerName.match(/laptop|mac|pc|computer|tech|ipad|electronics/)) match = 'tech';
    else if (lowerName.match(/phone|iphone|mobile/)) match = 'phone';
    else if (lowerName.match(/camera|lens|photo|video/)) match = 'camera';
    else if (lowerName.match(/game|console|ps5|xbox|switch|playstation/)) match = 'game';
    else if (lowerName.match(/watch|apple watch|fitbit/)) match = 'watch';
    
    // Travel
    else if (lowerName.match(/trip|travel|fly|plane|flight|vacation|break|holiday/)) match = 'travel';
    else if (lowerName.match(/beach|sea|ocean|summer|resort/)) match = 'vacation';
    else if (lowerName.match(/camp|hike|tent|outdoor|nature/)) match = 'camping';
    
    // Transport
    else if (lowerName.match(/car|tesla|bmw|toyota|jeep|drive/)) match = 'car';
    else if (lowerName.match(/bike|cycle|bicycle/)) match = 'bike';

    // Lifestyle
    else if (lowerName.match(/house|rent|dorm|apartment|home|furniture|bed|sofa/)) match = 'home';
    else if (lowerName.match(/tuition|school|college|debt|loan|book|class/)) match = 'education';
    else if (lowerName.match(/concert|music|ticket|festival|guitar|piano/)) match = 'music';
    else if (lowerName.match(/shoe|sneaker|jordan|nike|adidas|boot|clothes|dress|fashion/)) match = 'fashion';
    else if (lowerName.match(/food|dinner|date|restaurant|pizza|burger/)) match = 'food';
    else if (lowerName.match(/dog|cat|pet|vet/)) match = 'pet';
    else if (lowerName.match(/gift|present|christmas|birthday/)) match = 'gift';
    else if (lowerName.match(/emergency|safe|fund/)) match = 'savings';
    else if (lowerName.match(/job|work|internship/)) match = 'work';
    else if (lowerName.match(/art|paint|draw/)) match = 'art';

    setTimeout(() => {
      setSelectedIcon(match);
      setIsAnimatingIcon(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Savings Goals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Big things start with small savings.</p>
        </div>
        {!isAdding && goals.length > 0 && (
          <GlassButton onClick={() => setIsAdding(true)}>
            <Plus size={20} />
            <span className="hidden md:inline">New Goal</span>
            <span className="md:hidden">New</span>
          </GlassButton>
        )}
      </div>

      {isAdding && (
        <GlassCard className="animate-slide-up border-indigo-100 dark:border-indigo-500/20 bg-white/90 dark:bg-slate-900/90 shadow-xl relative z-20">
          <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="text-indigo-500" size={24} />
            Set a New Target
          </h3>
          
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Goal Name</label>
                   {name.length > 2 && (
                     <button 
                       onClick={smartSelectIcon}
                       className="text-[10px] font-bold text-indigo-500 flex items-center gap-1 hover:text-indigo-600 transition-colors animate-fade-in"
                     >
                       <Wand2 size={14} /> Auto-Icon
                     </button>
                   )}
                </div>
                <div className="relative">
                   <GlassInput 
                    placeholder="e.g. New MacBook Pro" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-medium"
                    autoFocus
                   />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Target Amount ({currency})</label>
                <GlassInput 
                  type="number" 
                  placeholder="2000.00" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="font-medium"
                />
              </div>
            </div>

            {/* Icon Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Choose Icon</label>
              <div className="p-1 bg-slate-100/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar p-2">
                  {PRESET_GOAL_ICONS.map((iconKey) => {
                    const IconComponent = GOAL_ICON_COMPONENTS[iconKey] || Target;
                    return (
                      <button
                        key={iconKey}
                        onClick={() => setSelectedIcon(iconKey)}
                        className={`
                          w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                          ${selectedIcon === iconKey 
                            ? 'bg-white dark:bg-slate-700 shadow-lg scale-110 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 text-indigo-500 dark:text-indigo-400' 
                            : 'hover:bg-white/50 dark:hover:bg-white/10 opacity-70 hover:opacity-100 grayscale hover:grayscale-0 text-slate-500 dark:text-slate-400'
                          }
                          ${isAnimatingIcon && selectedIcon === iconKey ? 'animate-bounce' : ''}
                        `}
                      >
                        <IconComponent size={24} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <GlassButton onClick={handleAdd} className="flex-1 font-bold py-3">Create Goal</GlassButton>
            <GlassButton variant="secondary" onClick={() => setIsAdding(false)} className="px-8 font-bold">Cancel</GlassButton>
          </div>
        </GlassCard>
      )}

      {goals.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full" />
            <div className="relative flex gap-4">
              <div className="bg-white dark:bg-slate-800 glass-panel p-6 rounded-3xl shadow-xl animate-float border-white/50 dark:border-white/5" style={{ animationDelay: '0s' }}>
                <Rocket className="w-12 h-12 text-indigo-500" strokeWidth={1.5} />
              </div>
              <div className="bg-white dark:bg-slate-800 glass-panel p-6 rounded-3xl shadow-xl animate-float mt-8 border-white/50 dark:border-white/5" style={{ animationDelay: '1.5s' }}>
                <Compass className="w-12 h-12 text-purple-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Dreams don't have to wait.</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed font-medium">
            What are you dreaming of? A new laptop, a spring break trip, or just an emergency fund? Start small, dream big.
          </p>
          <GlassButton onClick={() => setIsAdding(true)} className="px-8 py-4 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-100 dark:shadow-none scale-105 hover:scale-110 active:scale-95 transition-all border-none text-white font-bold">
            <Plus size={24} className="mr-1" />
            Start Your Savings Journey
          </GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const isCompleted = percentage >= 100;
            const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
            const IconComponent = GOAL_ICON_COMPONENTS[goal.icon] || Target;

            return (
              <GlassCard key={goal.id} className="relative group overflow-visible flex flex-col justify-between border-white/60 dark:border-white/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 text-3xl flex items-center justify-center shadow-inner dark:shadow-none shrink-0 border border-white/50 dark:border-white/5 text-indigo-600 dark:text-indigo-400">
                        <IconComponent size={32} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight truncate mb-1">{goal.name}</h4>
                        <div className="flex items-center gap-2">
                           {isCompleted ? (
                             <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                               <Sparkles size={14} fill="currentColor" /> Completed
                             </span>
                           ) : (
                             <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                               {currency}{remaining.toLocaleString(undefined, { maximumFractionDigits: 0 })} left
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-700 dark:text-slate-200">{currency}{goal.currentAmount.toLocaleString()}</span>
                      <span className="text-slate-400 dark:text-slate-500 font-medium">of {currency}{goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5 ring-1 ring-black/5 dark:ring-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-white/5 mt-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs font-bold">{currency}</span>
                    <input 
                      type="number"
                      placeholder="Add funds..."
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-7 pr-3 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:font-medium"
                      value={contribution[goal.id] || ''}
                      onChange={(e) => setContribution({ ...contribution, [goal.id]: e.target.value })}
                    />
                  </div>
                  <button 
                    onClick={() => handleContribute(goal.id)}
                    disabled={isCompleted}
                    className={`p-2.5 rounded-xl transition-all flex items-center justify-center shadow-lg ${
                      isCompleted 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 cursor-default border border-emerald-100 dark:border-emerald-500/20' 
                        : 'bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-700 active:scale-95 shadow-indigo-500/20'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={22} /> : <ArrowUpRight size={22} />}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
