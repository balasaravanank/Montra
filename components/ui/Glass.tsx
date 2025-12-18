
import React, { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => (
  <div className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${hoverEffect ? 'hover:shadow-lg hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const GlassButton: React.FC<GlassButtonProps> = ({ className = '', variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white/50 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/15 border border-slate-200/50 dark:border-white/10',
    danger: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/30'
  };

  return (
    <button 
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

export const GlassInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full bg-white/40 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-indigo-500/20 focus:border-slate-400 dark:focus:border-indigo-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 ${className}`}
    {...props}
  />
);

export const GlassSelect: React.FC<SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', ...props }) => (
    <div className="relative">
      <select 
        className={`w-full appearance-none bg-white/40 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-indigo-500/20 focus:border-slate-400 dark:focus:border-indigo-500/50 transition-all text-slate-700 dark:text-slate-200 ${className}`}
        {...props}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
);
