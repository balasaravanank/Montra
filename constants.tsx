import { 
  LayoutDashboard, 
  Receipt, 
  PiggyBank, 
  Target, 
  Settings,
  Coffee,
  Bus,
  Home,
  Tv,
  Gamepad2,
  GraduationCap,
  ShoppingBag,
  MoreHorizontal,
  DollarSign,
  Wallet,
  Zap,
  Gift,
  Award,
  Apple,
  Car,
  Sparkles
} from 'lucide-react';
import React from 'react';
import { Category } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.FOOD]: <Coffee className="w-4 h-4" />,
  [Category.TRAVEL]: <Bus className="w-4 h-4" />,
  [Category.RENT]: <Home className="w-4 h-4" />,
  [Category.UTILITIES]: <Zap className="w-4 h-4" />,
  [Category.SUBSCRIPTIONS]: <Tv className="w-4 h-4" />,
  [Category.ENTERTAINMENT]: <Gamepad2 className="w-4 h-4" />,
  [Category.ACADEMICS]: <GraduationCap className="w-4 h-4" />,
  [Category.SHOPPING]: <ShoppingBag className="w-4 h-4" />,
  [Category.GROCERIES]: <Apple className="w-4 h-4" />,
  [Category.TRANSPORTATION]: <Car className="w-4 h-4" />,
  [Category.PERSONAL_CARE]: <Sparkles className="w-4 h-4" />,
  [Category.OTHER]: <MoreHorizontal className="w-4 h-4" />,
  [Category.INCOME]: <DollarSign className="w-4 h-4" />,
  [Category.INCOME_SOURCE]: <Wallet className="w-4 h-4" />,
  [Category.SCHOLARSHIP]: <Award className="w-4 h-4" />,
  [Category.GIFT]: <Gift className="w-4 h-4" />,
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.FOOD]: 'bg-orange-100 text-orange-600',
  [Category.TRAVEL]: 'bg-blue-100 text-blue-600',
  [Category.RENT]: 'bg-red-100 text-red-600',
  [Category.UTILITIES]: 'bg-yellow-100 text-yellow-600',
  [Category.SUBSCRIPTIONS]: 'bg-purple-100 text-purple-600',
  [Category.ENTERTAINMENT]: 'bg-pink-100 text-pink-600',
  [Category.ACADEMICS]: 'bg-emerald-100 text-emerald-600',
  [Category.SHOPPING]: 'bg-indigo-100 text-indigo-600',
  [Category.GROCERIES]: 'bg-lime-100 text-lime-600',
  [Category.TRANSPORTATION]: 'bg-sky-100 text-sky-600',
  [Category.PERSONAL_CARE]: 'bg-rose-100 text-rose-600',
  [Category.OTHER]: 'bg-slate-100 text-slate-600',
  [Category.INCOME]: 'bg-green-100 text-green-600',
  [Category.INCOME_SOURCE]: 'bg-teal-100 text-teal-600',
  [Category.SCHOLARSHIP]: 'bg-cyan-100 text-cyan-600',
  [Category.GIFT]: 'bg-rose-100 text-rose-600',
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'budgets', label: 'Budgets', icon: PiggyBank },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'settings', label: 'Settings', icon: Settings },
];