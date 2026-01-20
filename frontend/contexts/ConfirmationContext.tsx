import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ConfirmationModal, ConfirmationVariant } from '../components/ui/ConfirmationModal';

interface ConfirmationOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmationVariant;
}

interface ConfirmationContextType {
    confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const ConfirmationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmationOptions>({
        title: '',
        message: '',
    });

    // Store the resolve function of the promise so we can call it later
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((options: ConfirmationOptions) => {
        setOptions(options);
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (resolver) {
            resolver(true);
        }
        setIsOpen(false);
        setResolver(null);
    }, [resolver]);

    const handleCancel = useCallback(() => {
        if (resolver) {
            resolver(false);
        }
        setIsOpen(false);
        setResolver(null);
    }, [resolver]);

    return (
        <ConfirmationContext.Provider value={{ confirm }}>
            {children}
            <ConfirmationModal
                isOpen={isOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title={options.title}
                message={options.message}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                variant={options.variant}
            />
        </ConfirmationContext.Provider>
    );
};

export const useConfirmation = () => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirmation must be used within a ConfirmationProvider');
    }
    return context;
};
