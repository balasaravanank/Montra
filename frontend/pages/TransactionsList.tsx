import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import { Search, Filter, Trash2, ArrowUpDown } from 'lucide-react';

interface Props {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    currency: string;
}

export const TransactionsList: React.FC<Props> = ({ transactions, onDelete, currency }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter((t) => {
                const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.category.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesType = filterType === 'all' || t.type === filterType;
                return matchesSearch && matchesType;
            })
            .sort((a, b) => {
                const timeA = new Date(a.date).getTime();
                const timeB = new Date(b.date).getTime();
                return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
            });
    }, [transactions, searchTerm, filterType, sortOrder]);

    return (
        <div className="space-y-6 pb-20 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">View and manage your financial activity.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    {/* Simple Segmented Control for Filter */}
                    {['all', 'income', 'expense'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${filterType === type
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-8">

                {/* Controls: Search & Sort */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ArrowUpDown size={16} />
                        {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                    </button>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <Filter size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No transactions found.</p>
                        </div>
                    ) : (
                        filteredTransactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between group p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${CATEGORY_COLORS[t.category] || 'bg-slate-100 text-slate-500'}`}>
                                        {CATEGORY_ICONS[t.category] || '📦'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px] md:max-w-xs">{t.description}</p>
                                        <p className="text-xs text-slate-500 font-medium">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {t.category}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <span className={`text-base md:text-lg font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                        {t.type === 'income' ? '+' : '-'}{currency}{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                    <button
                                        onClick={() => onDelete(t.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
