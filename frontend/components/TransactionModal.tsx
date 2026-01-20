
import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, GlassButton, GlassInput } from './ui/Glass';
import { Category, Transaction, TransactionType } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import {
  X,
  CheckCircle2,
  Coins,
  Sparkles as SparklesIcon,
  Receipt,
  Flame,
  BellRing,
  Calendar as CalendarIcon,
  ChevronRight,
  Wallet,
  CreditCard,
  Building2,
  Smartphone,
  Tag,
  Plus,
  Coffee,
  Bus,
  Home,
  Zap,
  Tv,
  Gamepad2,
  GraduationCap,
  ShoppingBag,
  Apple,
  Car,
  Sparkles,
  MoreHorizontal,
  DollarSign,
  Award,
  Gift,
  FileText
} from 'lucide-react';
import { Calendar } from './ui/calendar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (t: Omit<Transaction, 'id'>) => void;
  currency: string;
  initialType?: TransactionType;
  initialData?: Transaction | null;
  availableTags?: string[];
  onDeleteTag?: (tag: string) => void;
}

// Category icons mapping
const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  [Category.FOOD]: <Coffee size={18} />,
  [Category.TRAVEL]: <Bus size={18} />,
  [Category.RENT]: <Home size={18} />,
  [Category.UTILITIES]: <Zap size={18} />,
  [Category.SUBSCRIPTIONS]: <Tv size={18} />,
  [Category.ENTERTAINMENT]: <Gamepad2 size={18} />,
  [Category.ACADEMICS]: <GraduationCap size={18} />,
  [Category.SHOPPING]: <ShoppingBag size={18} />,
  [Category.GROCERIES]: <Apple size={18} />,
  [Category.TRANSPORTATION]: <Car size={18} />,
  [Category.PERSONAL_CARE]: <Sparkles size={18} />,
  [Category.OTHER]: <MoreHorizontal size={18} />,
  [Category.INCOME]: <DollarSign size={18} />,
  [Category.INCOME_SOURCE]: <Wallet size={18} />,
  [Category.SCHOLARSHIP]: <Award size={18} />,
  [Category.GIFT]: <Gift size={18} />,
};

// Wallet/Payment method options - Cash or Bank (includes Card, UPI, Bank Transfer)
const WALLET_OPTIONS = [
  { id: 'cash', label: 'Cash', icon: <Wallet size={18} /> },
  { id: 'bank', label: 'Bank', icon: <Building2 size={18} /> },
] as const;

export const TransactionModal: React.FC<Props> = ({ isOpen, onClose, onSave, currency, initialType = 'expense', initialData, availableTags = [], onDeleteTag }) => {
  // Helper to get local date string YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();

    if (isToday) {
      return `Today, ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const dateInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [source, setSource] = useState('');
  const [type, setType] = useState<TransactionType>(initialType);
  const [category, setCategory] = useState<Category | string>(Category.FOOD);
  const [wallet, setWallet] = useState<'cash' | 'bank'>('bank');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  // UI States
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showWalletPicker, setShowWalletPicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit Mode: Populate fields
        setDescription(initialData.description);
        setAmount(initialData.amount.toString());
        // Convert ISO date back to YYYY-MM-DD
        const d = new Date(initialData.date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setDate(`${year}-${month}-${day}`);

        setType(initialData.type);
        setCategory(initialData.category);
        setSource(initialData.source || '');
        // Map legacy wallet values to new simplified options
        const legacyWallet = initialData.wallet;
        if (legacyWallet === 'card' || legacyWallet === 'upi' || legacyWallet === 'bank') {
          setWallet('bank');
        } else {
          setWallet(legacyWallet === 'cash' ? 'cash' : 'bank');
        }
        setTags(initialData.tags || []);

      } else {
        // Create Mode: Reset or set defaults
        if (initialType) {
          setType(initialType);
          if (initialType === 'income') {
            setCategory(Category.INCOME);
          } else {
            setCategory(Category.FOOD);
          }
        }

        if (!description && !amount) {
          setDate(getTodayString());
          setTags([]);
          setCustomTag('');
          setWallet('bank');
          setSource('');
          setDescription('');
          setAmount('');
        }
      }
    }
  }, [isOpen, initialType, initialData]);


  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date) return;

    let finalDateIso = '';
    const todayStr = getTodayString();

    if (date === todayStr) {
      finalDateIso = new Date().toISOString();
    } else {
      finalDateIso = new Date(`${date}T12:00:00`).toISOString();
    }

    onSave({
      description: description || category.toString(),
      amount: parseFloat(amount),
      type,
      category,
      date: finalDateIso,
      source: type === 'income' ? source : undefined,
      wallet,
      tags: tags.length > 0 ? tags : undefined
    });

    // Reset and close immediately
    setDescription('');
    setAmount('');
    setSource('');
    setDate(getTodayString());
    setTags([]);
    setCustomTag('');
    setWallet('bank');
    onClose();
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(Category.INCOME);
    } else {
      setCategory(Category.FOOD);
    }
  };

  const toggleTag = (tag: string) => {
    setTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const INCOME_CATEGORIES = [Category.INCOME, Category.INCOME_SOURCE, Category.SCHOLARSHIP, Category.GIFT];
  const EXPENSE_CATEGORIES = Object.values(Category).filter(c => !INCOME_CATEGORIES.includes(c));
  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const selectedWallet = WALLET_OPTIONS.find(w => w.id === wallet);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md transform transition-all">
        <style>
          {`
            @keyframes confetti-burst {
              0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
              100% { transform: translate(calc(-50% + var(--tw-translate-x)), calc(-50% + var(--tw-translate-y))) scale(1); opacity: 0; }
            }
            @keyframes coin-spin-3d {
              0% { transform: rotateY(0deg); }
              100% { transform: rotateY(1080deg); }
            }
            @keyframes float-up-fade {
              0% { transform: translate(-50%, 0); opacity: 0; }
              20% { opacity: 1; }
              100% { transform: translate(-50%, -100px); opacity: 0; }
            }
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes ping-soft {
              0% { transform: scale(1); opacity: 0.8; }
              100% { transform: scale(1.8); opacity: 0; }
            }
            @keyframes toast-in {
              0% { transform: translateY(-100%) scale(0.9); opacity: 0; }
              100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            @keyframes slide-up {
              0% { transform: translateY(100%); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            .confetti-particle {
              animation: confetti-burst 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
            }
            .animate-coin-spin-3d {
              animation: coin-spin-3d 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              transform-style: preserve-3d;
            }
            .animate-float-up-fade {
              animation: float-up-fade 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            .shimmer-bar::after {
              content: '';
              position: absolute;
              top: 0; left: 0; right: 0; bottom: 0;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
              animation: shimmer 1.5s infinite;
            }
            .animate-toast-in {
              animation: toast-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .animate-slide-up-modal {
              animation: slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards;
            }
          `}
        </style>

        <div className={`bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 animate-slide-up-modal max-h-[90vh] sm:max-h-[85vh] md:max-h-[82vh] lg:max-h-[80vh] overflow-y-auto hide-scrollbar scale-100`}>
          <div>
            {/* Header */}
            <div className="flex justify-between items-center px-5 sm:px-6 pt-4 sm:pt-5 pb-2">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
              <button
                onClick={handleSubmit}
                disabled={!amount}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${amount
                  ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  }`}
              >
                Save
              </button>
            </div>

            {/* Amount Input */}
            <div className="text-center py-4 px-5 sm:px-6">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1 uppercase tracking-wider">Amount</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex-shrink-0">{currency}</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && amount && date) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  autoFocus
                  className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none text-left min-w-[60px] max-w-[200px] placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  style={{ width: `${Math.max(60, (amount?.toString().length || 1) * 24)}px` }}
                />
              </div>
            </div>

            {/* Type Toggle */}
            <div className="px-5 sm:px-6 pb-4">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${type === 'expense'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  onClick={() => handleTypeChange('expense')}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${type === 'income'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  onClick={() => handleTypeChange('income')}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Form Fields - Stack Layout */}
            <div className="px-5 sm:px-6 space-y-0.5 border-t border-slate-100 dark:border-slate-800">
              {/* Date */}
              <div
                className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-5 sm:-mx-6 px-5 sm:px-6 transition-colors"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{formatDisplayDate(date)}</span>
                  <CalendarIcon size={18} className="text-slate-400" />
                </div>
              </div>

              {/* Wallet */}
              <div
                className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-5 sm:-mx-6 px-5 sm:px-6 transition-colors"
                onClick={() => setShowWalletPicker(!showWalletPicker)}
              >
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Wallet</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{selectedWallet?.label}</span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>

              {/* Wallet Picker */}
              {showWalletPicker && (
                <div className="grid grid-cols-2 gap-3 py-3 animate-fade-in">
                  {WALLET_OPTIONS.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setWallet(w.id);
                        setShowWalletPicker(false);
                      }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${wallet === w.id
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                      {w.icon}
                      <span className="text-xs font-medium">{w.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Category */}
              <div
                className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-5 sm:-mx-6 px-5 sm:px-6 transition-colors"
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">{CATEGORY_ICON_MAP[category] || <MoreHorizontal size={18} />}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{category}</span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>

              {/* Category Picker */}
              {showCategoryPicker && (
                <div className="grid grid-cols-4 gap-2 py-3 animate-fade-in max-h-48 overflow-y-auto custom-scrollbar">
                  {currentCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all ${category === cat
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                      {CATEGORY_ICON_MAP[cat] || <MoreHorizontal size={18} />}
                      <span className="text-[10px] font-medium truncate w-full text-center">{cat}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Source (Income only) */}
              {type === 'income' && (
                <div className="py-3.5 border-b border-slate-100 dark:border-slate-800 -mx-5 sm:-mx-6 px-5 sm:px-6">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Source</span>
                  <input
                    type="text"
                    placeholder="e.g. Salary, Freelance..."
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && amount && date) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Tags */}
              <div className="py-3.5 border-b border-slate-100 dark:border-slate-800 -mx-5 sm:-mx-6 px-5 sm:px-6 animated-fade-in">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">Tags</span>

                {/* Custom Tag Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                    className="flex-1 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                  />
                </div>

                {/* Available Tags (Presets + Custom) */}
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    return (
                      <div
                        key={tag}
                        className={`flex items-center gap-1 pl-3 pr-2 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${tags.includes(tag)
                          ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        onClick={() => toggleTag(tag)}
                      >
                        <Plus size={12} className={tags.includes(tag) ? 'rotate-45' : ''} />
                        <span>{tag}</span>
                        {onDeleteTag && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTag(tag);
                              // Also remove from selection if currently selected
                              if (tags.includes(tag)) {
                                toggleTag(tag);
                              }
                            }}
                            className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-red-500 transition-colors group"
                            title="Delete tag"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Selected Custom Tags that are NOT in availableTags (rare case if sync is delayed, or pure custom) */}
                {tags.filter(t => !availableTags.includes(t)).length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3 mt-2 md:mt-3">
                    {tags.filter(t => !availableTags.includes(t)).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30"
                      >
                        <Plus size={12} className="rotate-45" />
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="py-3.5 -mx-5 sm:-mx-6 px-5 sm:px-6">
                <textarea
                  placeholder="Add details (optional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full text-sm text-slate-600 dark:text-slate-300 bg-transparent border-none outline-none resize-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Button (Visible "at last") */}
            <div className="p-4 pt-2 pb-6 w-full">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!amount}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${amount
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
              >
                Log Transaction
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Overlay */}
      {showCalendar && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-scale-in max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Date Selection */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-3 gap-2">
                {(() => {
                  const todayStr = getTodayString();
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
                  const twoDaysAgo = new Date();
                  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                  const twoDaysAgoStr = `${twoDaysAgo.getFullYear()}-${String(twoDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(twoDaysAgo.getDate()).padStart(2, '0')}`;

                  const activeClass = "px-3 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors";
                  const inactiveClass = "px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors";

                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setDate(todayStr);
                          setShowCalendar(false);
                        }}
                        className={date === todayStr ? activeClass : inactiveClass}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDate(yesterdayStr);
                          setShowCalendar(false);
                        }}
                        className={date === yesterdayStr ? activeClass : inactiveClass}
                      >
                        Yesterday
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDate(twoDaysAgoStr);
                          setShowCalendar(false);
                        }}
                        className={date === twoDaysAgoStr ? activeClass : inactiveClass}
                      >
                        2 days ago
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>

            <Calendar
              mode="single"
              selected={new Date(date)}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  const year = selectedDate.getFullYear();
                  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                  const day = String(selectedDate.getDate()).padStart(2, '0');
                  setDate(`${year}-${month}-${day}`);
                  setShowCalendar(false);
                }
              }}
              className="p-4"
            />
          </div>
        </div>
      )}
    </div>
  );
};
