import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LabelList, BarChart, Bar, LineChart, Line } from 'recharts';
import { Transaction, Category, Budget, SavingsGoal, UserProfile } from '../types';
import { GlassCard, GlassButton } from '../components/ui/Glass';
import { CreditCardWidget } from '../components/CreditCardWidget';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import { TrendingUp, TrendingDown, ArrowUpRight, Wallet, MoreHorizontal, Calendar, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  profile: UserProfile;
  onAddTransaction: (type: 'income' | 'expense') => void;
  currency: string;
  isDarkMode: boolean;
}

const CustomTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-xl">
        <p className="font-bold mb-1">{data.fullDateLabel}</p>
        <p className="text-emerald-400 font-mono">{currency}{data.amount.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<Props> = ({ transactions, budgets, goals, profile, onAddTransaction, currency, isDarkMode }) => {
  const [hoveredData, setHoveredData] = useState<any>(null);

  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenses;

  // Last 7 Days Data Generation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => t.date && t.date.startsWith(date) && t.type === 'expense');
    const dayTotal = dayTransactions.reduce((acc, t) => acc + t.amount, 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      fullDateLabel: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: dayTotal,
    };
  });

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-2 rounded-lg">
            <Wallet size={20} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-0">My Montra</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onAddTransaction('income')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <TrendingUp size={16} />
            Add Income
          </button>
          <button
            onClick={() => onAddTransaction('expense')}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 transition-all active:scale-95"
          >
            <TrendingDown size={16} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Top Grid: Credit Card + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Credit Card */}
        <div className="lg:col-span-1 h-full">
          <CreditCardWidget balance={balance} currency={currency} profile={profile} />
        </div>

        {/* Right Column: Key Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Income Stat */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 H-2 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Your Income</span>
              <Activity size={14} className="text-slate-300 ml-auto" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{currency}{income.toLocaleString()}</h3>
              <p className="text-xs text-slate-500">Your Income Amount</p>
            </div>
            <div className="mt-4">
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold">+10%</span>
            </div>
          </div>

          {/* Expenses Stat */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 H-2 rounded-full bg-yellow-500" />
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Expenses</span>
              <PieChartIcon size={14} className="text-slate-300 ml-auto" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{currency}{expenses.toLocaleString()}</h3>
              <p className="text-xs text-slate-500">Your Total Spend</p>
            </div>
            <div className="mt-4">
              <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-full font-bold">28%</span>
            </div>
          </div>

          {/* Total Money Stat */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 H-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Money</span>
              <Wallet size={14} className="text-slate-300 ml-auto" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{currency}{(balance + 1450).toLocaleString()}</h3> {/* Mocking total assets */}
              <p className="text-xs text-slate-500">Total in wallet</p>
            </div>
            <div className="mt-4">
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold">+12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Analytics + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Money Analytics (Chart) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Money Analytics</h3>
            <button className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
              Full Stats
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{currency}{balance.toLocaleString()}</h2>
            <p className="text-slate-500 text-sm">You saved 10% more than last month 👏</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={10}
                  interval={0}
                />
                <Tooltip
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={<CustomTooltip currency={currency} />}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Transaction List */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Transaction</h3>
            <ArrowUpRight size={18} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[400px]">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${CATEGORY_COLORS[t.category]}`}>
                    {t.category === 'Food' ? '🍔' : t.category === 'Transport' ? '🚗' : t.category === 'Entertainment' ? '🎬' : '📦'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{t.description}</p>
                    <p className="text-[10px] text-slate-500">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}{currency}{t.amount.toLocaleString()}
                </span>
              </div>
            ))}

            {recentTransactions.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <p>No recent transactions</p>
              </div>
            )}
          </div>

          <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};
