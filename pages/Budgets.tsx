
import React, { useMemo, useState } from 'react';
import { Transaction, Category, Budget } from '../types';
import { GlassCard, GlassButton, GlassInput, GlassSelect } from '../components/ui/Glass';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import { Plus, Pencil, Trash2, PiggyBank, Sparkles } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  onSaveBudget: (budget: Budget) => void;
  onDeleteBudget: (category: Category) => void;
  currency: string;
}

export const Budgets: React.FC<Props> = ({ transactions, budgets, onSaveBudget, onDeleteBudget, currency }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [limit, setLimit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.FOOD);

  // Define which categories are considered income and should be filtered out of budgets
  const INCOME_CATEGORIES = [Category.INCOME, Category.INCOME_SOURCE, Category.SCHOLARSHIP, Category.GIFT];

  // Calculate actual spending per category for current month
  const spendingByCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [transactions]);

  const handleSave = () => {
    if (!limit || parseFloat(limit) <= 0) return;
    onSaveBudget({
      category: editingCategory || selectedCategory,
      limit: parseFloat(limit)
    });
    setIsAdding(false);
    setEditingCategory(null);
    setLimit('');
  };

  const startEdit = (b: Budget) => {
    setEditingCategory(b.category);
    setLimit(b.limit.toString());
    setIsAdding(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-slate-900 dark:text-white">Monthly Budgets</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track your spending limits for this month.</p>
        </div>
        {!isAdding && budgets.length > 0 && (
          <GlassButton onClick={() => setIsAdding(true)}>
            <Plus size={18} />
            Set Budget
          </GlassButton>
        )}
      </div>

      {isAdding && (
        <GlassCard className="animate-slide-up border-indigo-100 dark:border-indigo-500/20 bg-white/90 dark:bg-slate-900/90 shadow-xl">
          <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-white">{editingCategory ? `Edit ${editingCategory} Budget` : 'Create New Budget'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {!editingCategory && (
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                <GlassSelect 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value as Category)}
                >
                  {Object.values(Category)
                    .filter(c => !INCOME_CATEGORIES.includes(c))
                    .map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  }
                </GlassSelect>
              </div>
            )}
            <div className={editingCategory ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Monthly Limit ({currency})</label>
              <GlassInput 
                type="number" 
                placeholder="0.00" 
                value={limit} 
                onChange={(e) => setLimit(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="flex gap-2">
            <GlassButton onClick={handleSave} className="flex-1">Save Budget</GlassButton>
            <GlassButton variant="secondary" onClick={() => { setIsAdding(false); setEditingCategory(null); }} className="px-6">Cancel</GlassButton>
          </div>
        </GlassCard>
      )}

      {budgets.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
            <div className="relative bg-white dark:bg-slate-900 glass-panel p-8 rounded-[2.5rem] shadow-2xl animate-float">
              <PiggyBank className="w-16 h-16 text-indigo-500" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-lg animate-pulse">
              <Sparkles size={20} />
            </div>
          </div>
          <h2 className="text-2xl font-medium text-slate-800 dark:text-white mb-3 tracking-tight">Your money, your rules.</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
            Stop wondering where your money went and start telling it where to go. Create a budget to track your limits effortlessly.
          </p>
          <GlassButton onClick={() => setIsAdding(true)} className="px-8 py-4 text-lg shadow-indigo-100 dark:shadow-none scale-105 hover:scale-110 active:scale-95 transition-all">
            <Plus size={20} className="mr-1" />
            Create Your First Budget
          </GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const spent = spendingByCategory[budget.category] || 0;
            const remaining = budget.limit - spent;
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const isNearLimit = percentage >= 80 && percentage < 100;
            const isOverLimit = percentage >= 100;

            let barColor = 'bg-emerald-500'; // Green for on track
            if (isOverLimit) barColor = 'bg-red-500';
            else if (isNearLimit) barColor = 'bg-orange-500';

            return (
              <GlassCard key={budget.category} hoverEffect className="relative group overflow-hidden border-white/60 dark:border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${CATEGORY_COLORS[budget.category]}`}>
                      {CATEGORY_ICONS[budget.category]}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">{budget.category}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Monthly Target</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(budget)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDeleteBudget(budget.category)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 text-sm font-semibold">{currency}{spent.toFixed(2)}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs ml-1">spent</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium ${remaining < 0 ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {remaining >= 0 ? `${currency}${remaining.toFixed(2)} left` : `${currency}${Math.abs(remaining).toFixed(2)} over`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-2.5 w-full bg-slate-100/80 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full ${barColor} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.05)]`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${barColor} animate-pulse`} />
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isOverLimit ? 'text-red-500 dark:text-red-400' : isNearLimit ? 'text-orange-500 dark:text-orange-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                        {isOverLimit ? 'Exceeded' : isNearLimit ? 'Near Limit' : 'On Track'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
