"use client";

import { useState } from 'react';
// import { useAuth } from '@/hooks/use-auth'; // Once auth is real, pull from here

export function useProGate() {
    // Mock 'isPro' status until the Auth context handles reading `user.tier === 'pro'`
    const [isPro] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Wraps any Pro-only action.
     * If the user is Pro, it executes. If Free, it opens the upgrade modal.
     */
    const requirePro = (action: (...args: any[]) => void) => {
        return (...args: any[]) => {
            if (isPro) {
                action(...args);
            } else {
                setShowUpgradeModal(true);
            }
        };
    };

    /**
     * Fires the checkout endpoint to generate a Stripe Checkout URL
     * and subsequently redirects the user's browser there.
     */
    const handleUpgrade = async () => {
        try {
            setIsLoading(true);

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const data = await response.json();

            if (data.url) {
                // Redirect browser to Stripe Checkout
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            // In a real app, you'd show a Toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isPro,
        showUpgradeModal,
        setShowUpgradeModal,
        requirePro,
        handleUpgrade,
        isLoading,
    };
}
