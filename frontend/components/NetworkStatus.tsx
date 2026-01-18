import React, { useEffect, useState, useRef } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';

export const NetworkStatus = ({ className }: { className?: string }) => {
    const isOnline = useOnlineStatus();
    const [showOffline, setShowOffline] = useState(false);
    const [showBackOnline, setShowBackOnline] = useState(false);
    const wasOnline = useRef(true);

    // Default positioning classes if none provided
    const containerClasses = className || "fixed bottom-20 left-1/2 transform -translate-x-1/2 md:bottom-24";

    useEffect(() => {
        if (!isOnline && wasOnline.current) {
            // Just went offline - show for 5 seconds
            setShowOffline(true);
            const timer = setTimeout(() => setShowOffline(false), 5000);
            wasOnline.current = false;
            return () => clearTimeout(timer);
        } else if (isOnline && !wasOnline.current) {
            // Just came back online - show for 5 seconds
            setShowOffline(false);
            setShowBackOnline(true);
            const timer = setTimeout(() => setShowBackOnline(false), 5000);
            wasOnline.current = true;
            return () => clearTimeout(timer);
        }
    }, [isOnline]);

    if (showOffline) {
        return (
            <div className={`${containerClasses} z-50 animate-in fade-in slide-in-from-bottom-4`}>
                <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/10 text-sm font-medium">
                    <WifiOff size={16} className="text-red-400" />
                    <span>You are offline</span>
                </div>
            </div>
        );
    }

    if (showBackOnline) {
        return (
            <div className={`${containerClasses} z-50 animate-in fade-in slide-in-from-bottom-4`}>
                <div className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/10 text-sm font-medium">
                    <Wifi size={16} />
                    <span>Back online</span>
                </div>
            </div>
        );
    }

    return null;
};
