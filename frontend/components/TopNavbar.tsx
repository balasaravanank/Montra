import React from 'react';
import { UserProfile, View } from '../types';
import { NAV_ITEMS } from '../constants';
import { Globe, LogOut } from 'lucide-react';

interface TopNavbarProps {
    currentView: View;
    onNavClick: (view: View) => void;
    onLogout: () => void;
    profile: UserProfile;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ currentView, onNavClick, onLogout, profile }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#01051B]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-20 flex items-center justify-between px-4 md:px-8 transition-all duration-300">

            {/* Left: Logo & Navigation */}
            <div className="flex items-center gap-12">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavClick('dashboard')}>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/20">
                        M
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Montra</span>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_ITEMS.map((item) => {
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavClick(item.id as View)}
                                className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive
                                    ? 'text-slate-900 dark:text-white font-bold'
                                    : 'text-slate-500 dark:text-slate-400'
                                    }`}
                            >
                                {item.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-6">

                {/* Language Selector (Visual Only) */}
                <div className="hidden md:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">
                    <Globe size={18} />
                    <span>EN</span>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-white/10">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{profile.name || 'Montra User'}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">hello@{profile.name ? profile.name.toLowerCase().replace(' ', '') : 'user'}.id</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden">
                        {/* Simple Avatar Placeholder */}
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || 'User'}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        onClick={onLogout}
                        className="md:hidden p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};
