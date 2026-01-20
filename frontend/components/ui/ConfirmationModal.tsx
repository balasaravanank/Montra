import React from 'react';
import { AlertTriangle, Info, Trash2, X } from 'lucide-react';

export type ConfirmationVariant = 'danger' | 'warning' | 'info';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmationVariant;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}) => {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: <Trash2 size={24} className="text-red-500" />,
                    iconBg: 'bg-red-100 dark:bg-red-500/20',
                    buttonBg: 'bg-red-500 hover:bg-red-600 shadow-red-500/30',
                    focusRing: 'focus:ring-red-500',
                };
            case 'warning':
                return {
                    icon: <AlertTriangle size={24} className="text-amber-500" />,
                    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
                    buttonBg: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30',
                    focusRing: 'focus:ring-amber-500',
                };
            case 'info':
            default:
                return {
                    icon: <Info size={24} className="text-indigo-500" />,
                    iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
                    buttonBg: 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30',
                    focusRing: 'focus:ring-indigo-500',
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all animate-scale-in border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${styles.iconBg}`}>
                        {styles.icon}
                    </div>

                    {/* Text */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-5 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-5 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${styles.buttonBg}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
