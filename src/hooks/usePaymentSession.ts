import { useState, useEffect, useCallback } from 'react';
import { PaymentSession } from '@/types/fuel';

export function usePaymentSession() {
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [dispensingStatus, setDispensingStatus] = useState<'waiting' | 'dispensing' | 'completed'>('waiting');

  // Create payment session
  const createSession = useCallback((amount: number) => {
    const newSession: PaymentSession = {
      id: `fuel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      status: 'pending',
      qrCodeData: `promptpay_${amount}_${Date.now()}`,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    };
    
    setSession(newSession);
    setTimeRemaining(5 * 60); // 5 minutes in seconds
    setDispensingStatus('waiting');
    
    return newSession;
  }, []);

  // Simulate payment status checking
  const checkPaymentStatus = useCallback(() => {
    if (!session || session.status === 'completed' || session.status === 'failed') return;

    // Simulate random payment completion (for demo purposes)
    // In real implementation, this would check with payment gateway API
    const shouldComplete = Math.random() < 0.1; // 10% chance per check
    
    if (shouldComplete) {
      setSession(prev => prev ? { ...prev, status: 'completed' } : null);
      // Start fuel dispensing sequence
      setTimeout(() => setDispensingStatus('dispensing'), 2000);
      setTimeout(() => setDispensingStatus('completed'), 15000); // 13 seconds of dispensing
    } else {
      // Update status to processing if still pending
      setSession(prev => 
        prev?.status === 'pending' 
          ? { ...prev, status: 'processing' } 
          : prev
      );
    }
  }, [session]);

  // Timer countdown
  useEffect(() => {
    if (!session || session.status === 'completed' || session.status === 'failed') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time expired - mark as failed
          setSession(current => current ? { ...current, status: 'failed' } : null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  // Payment status polling
  useEffect(() => {
    if (!session || session.status === 'completed' || session.status === 'failed') return;

    const statusChecker = setInterval(checkPaymentStatus, 3000); // Check every 3 seconds

    return () => clearInterval(statusChecker);
  }, [session, checkPaymentStatus]);

  // Retry payment
  const retryPayment = useCallback(() => {
    if (session) {
      const newSession = createSession(session.amount);
      return newSession;
    }
    return null;
  }, [session, createSession]);

  // Clear session
  const clearSession = useCallback(() => {
    setSession(null);
    setTimeRemaining(0);
    setDispensingStatus('waiting');
  }, []);

  return {
    session,
    timeRemaining,
    dispensingStatus,
    createSession,
    retryPayment,
    clearSession
  };
}