
import React, { useState, useEffect } from 'react';
import { View, Transaction, Category, Budget, SavingsGoal, UserSettings } from './types';
import { NAV_ITEMS } from './constants';
import { Dashboard } from './pages/Dashboard';
import { TransactionsList } from './pages/TransactionsList';
import { Budgets } from './pages/Budgets';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { Auth } from './pages/Auth';
import { TransactionModal } from './components/TransactionModal';
import { GlassCard } from './components/ui/Glass';
import { Plus, LogOut } from 'lucide-react';

const DEFAULT_SETTINGS: UserSettings = {
  currency: '$',
  theme: 'vibrant',
  isDarkMode: false,
  profile: {
    name: '',
    school: '',
    year: 'Freshman'
  }
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('montra_auth') === 'true';
  });
  const [currentView, setCurrentView] = useState<View>(() => {
    const auth = localStorage.getItem('montra_auth') === 'true';
    return auth ? 'dashboard' : 'login';
  });
  const [isModalOpen, setModalOpen] = useState(false);
  
  // State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('montra_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('montra_budgets');
    if (saved) return JSON.parse(saved);
    return [
      { category: Category.UTILITIES, limit: 150 },
      { category: Category.SHOPPING, limit: 200 },
      { category: Category.GROCERIES, limit: 250 },
      { category: Category.TRANSPORTATION, limit: 80 },
      { category: Category.PERSONAL_CARE, limit: 50 }
    ];
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('montra_goals');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: "Spring Break '25", targetAmount: 1200, currentAmount: 450, icon: '✈️' },
      { id: '2', name: 'New MacBook Pro', targetAmount: 2000, currentAmount: 800, icon: '💻' }
    ];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('montra_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  // Persist State
  useEffect(() => {
    localStorage.setItem('montra_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('montra_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('montra_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('montra_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('montra_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  const handleLogin = (name: string) => {
    setIsAuthenticated(true);
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, name }
    }));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: crypto.randomUUID() };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const saveBudget = (budget: Budget) => {
    setBudgets(prev => {
      const existing = prev.findIndex(b => b.category === budget.category);
      if (existing > -1) {
        const updated = [...prev];
        updated[existing] = budget;
        return updated;
      }
      return [...prev, budget];
    });
  };

  const deleteBudget = (category: Category) => {
    setBudgets(prev => prev.filter(b => b.category !== category));
  };

  const addGoal = (g: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...g, id: crypto.randomUUID() };
    setGoals([...goals, newGoal]);
  };

  const updateGoalAmount = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const resetData = () => {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setSettings(DEFAULT_SETTINGS);
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const renderView = () => {
    if (!isAuthenticated) {
      return (
        <Auth 
          onLogin={handleLogin} 
          currentView={currentView === 'signup' ? 'signup' : 'login'} 
          onSwitch={(view) => setCurrentView(view as View)} 
        />
      );
    }

    switch(currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} onAddTransaction={() => setModalOpen(true)} studentName={settings.profile.name} currency={settings.currency} />;
      case 'transactions':
        return <TransactionsList transactions={transactions} onDelete={deleteTransaction} currency={settings.currency} />;
      case 'budgets':
        return (
          <Budgets 
            transactions={transactions} 
            budgets={budgets} 
            onSaveBudget={saveBudget} 
            onDeleteBudget={deleteBudget} 
            currency={settings.currency}
          />
        );
      case 'goals':
        return (
          <Goals 
            goals={goals}
            onAddGoal={addGoal}
            onUpdateGoal={updateGoalAmount}
            onDeleteGoal={deleteGoal}
            currency={settings.currency}
          />
        );
      case 'settings':
         return (
          <Settings 
            settings={settings} 
            onUpdateSettings={setSettings} 
            onResetData={resetData}
            transactions={transactions}
          />
        );
      default:
        return <Dashboard transactions={transactions} onAddTransaction={() => setModalOpen(true)} studentName={settings.profile.name} currency={settings.currency} />;
    }
  };

  const showNav = isAuthenticated && currentView !== 'login' && currentView !== 'signup';

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${settings.isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50/50'} ${settings.theme === 'vibrant' ? 'vibrant-mode' : ''}`}>
      
      {/* Desktop Sidebar */}
      {showNav && (
        <aside className="hidden md:flex flex-col w-64 h-full glass-panel border-r border-white/40 dark:border-white/5 z-10 animate-fade-in">
          <div className="p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-lg">M</span>
              Montra
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-white dark:bg-white/10 shadow-sm text-slate-900 dark:text-white' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="p-4 space-y-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
            <GlassCard className="bg-gradient-to-br from-indigo-500 to-purple-600 border-none text-white p-4">
              <p className="text-xs font-medium text-white/80 mb-1">Pro Tip</p>
              <p className="text-xs leading-relaxed opacity-90">Track daily to get better AI insights!</p>
            </GlassCard>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden relative">
        <div className="h-full overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/40 dark:border-white/5 pb-safe z-40">
          <div className="flex justify-around items-center p-2">
            {NAV_ITEMS.map((item) => {
               const isActive = currentView === item.id;
               return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-400'
                  }`}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
               );
            })}
          </div>
        </nav>
      )}

      {/* Floating Action Button (Mobile) */}
      {showNav && (
        <button 
          onClick={() => setModalOpen(true)}
          className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-slate-900 dark:bg-indigo-600 text-white rounded-full shadow-lg shadow-slate-900/20 flex items-center justify-center active:scale-90 transition-transform z-50"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Transaction Modal */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={addTransaction} 
        currency={settings.currency}
      />
    </div>
  );
};

export default App;
