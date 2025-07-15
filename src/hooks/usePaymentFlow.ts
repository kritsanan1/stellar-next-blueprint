import { useEffect, useCallback, useRef } from 'react';
import { PaymentService, MockPaymentGateway, PaymentSessionData } from '@/services/PaymentService';
import { SessionService } from '@/services/SessionService';
import { useFuelStationContext } from '@/context/FuelStationContext';
import { PAYMENT_CONFIG } from '@/utils/constants';
import { useToast } from '@/hooks/use-toast';

export function usePaymentFlow() {
  const { state, dispatch } = useFuelStationContext();
  const { toast } = useToast();
  
  // Service instances
  const paymentServiceRef = useRef(new PaymentService(new MockPaymentGateway()));
  const sessionServiceRef = useRef(new SessionService());
  
  // Timer refs
  const countdownTimerRef = useRef<NodeJS.Timeout>();
  const statusCheckTimerRef = useRef<NodeJS.Timeout>();

  // Create payment session
  const createPaymentSession = useCallback(async (amount: number) => {
    try {
      dispatch({ type: 'SET_LOADING', loading: true });
      dispatch({ type: 'SET_ERROR', error: undefined });
      
      const session = await paymentServiceRef.current.createPaymentSession(amount);
      
      dispatch({ type: 'SET_PAYMENT_SESSION', session });
      dispatch({ type: 'SET_STEP', step: 'payment' });
      
      // Create fuel session
      sessionServiceRef.current.createFuelSession(session.id);
      
      toast({
        title: 'สร้าง QR Code สำเร็จ',
        description: 'กรุณาสแกน QR Code เพื่อชำระเงิน'
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
      dispatch({ type: 'SET_ERROR', error: errorMessage });
      
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, [dispatch, toast]);

  // Check payment status
  const checkPaymentStatus = useCallback(async () => {
    if (!state.paymentSession || 
        state.paymentSession.status === 'completed' || 
        state.paymentSession.status === 'failed') {
      return;
    }

    try {
      const status = await paymentServiceRef.current.checkPaymentStatus(state.paymentSession.id);
      
      if (status !== state.paymentSession.status) {
        dispatch({ type: 'UPDATE_PAYMENT_STATUS', status });
        
        if (status === 'completed') {
          // Start fuel dispensing simulation
          const expectedLiters = state.selectedLiters || 
            (state.selectedAmount / (state.selectedFuelType?.price || 35));
          
          sessionServiceRef.current.simulateDispensing(
            state.paymentSession.id, 
            expectedLiters
          );
          
          toast({
            title: 'ชำระเงินสำเร็จ',
            description: 'กำลังเตรียมจ่ายน้ำมัน'
          });
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  }, [state.paymentSession, state.selectedAmount, state.selectedFuelType, state.selectedLiters, dispatch, toast]);

  // Retry payment
  const retryPayment = useCallback(async () => {
    if (state.selectedAmount > 0) {
      await createPaymentSession(state.selectedAmount);
      return true;
    }
    return false;
  }, [state.selectedAmount, createPaymentSession]);

  // Clear session
  const clearSession = useCallback(() => {
    dispatch({ type: 'CLEAR_SESSION' });
    
    if (state.paymentSession) {
      sessionServiceRef.current.clearSession(state.paymentSession.id);
    }
    
    // Clear timers
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    if (statusCheckTimerRef.current) {
      clearInterval(statusCheckTimerRef.current);
    }
  }, [dispatch, state.paymentSession]);

  // Timer countdown effect
  useEffect(() => {
    if (!state.paymentSession || 
        state.paymentSession.status === 'completed' || 
        state.paymentSession.status === 'failed') {
      return;
    }

    countdownTimerRef.current = setInterval(() => {
      dispatch({ type: 'SET_TIME_REMAINING', time: Math.max(0, state.timeRemaining - 1) });
      
      if (state.timeRemaining <= 1) {
        dispatch({ type: 'UPDATE_PAYMENT_STATUS', status: 'expired' });
        toast({
          title: 'หมดเวลาชำระเงิน',
          description: 'กรุณาเริ่มการชำระเงินใหม่',
          variant: 'destructive'
        });
      }
    }, 1000);

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [state.paymentSession, state.timeRemaining, dispatch, toast]);

  // Payment status checking effect
  useEffect(() => {
    if (!state.paymentSession || 
        state.paymentSession.status === 'completed' || 
        state.paymentSession.status === 'failed') {
      return;
    }

    statusCheckTimerRef.current = setInterval(
      checkPaymentStatus, 
      PAYMENT_CONFIG.STATUS_CHECK_INTERVAL
    );

    return () => {
      if (statusCheckTimerRef.current) {
        clearInterval(statusCheckTimerRef.current);
      }
    };
  }, [state.paymentSession, checkPaymentStatus]);

  // Monitor dispensing status
  useEffect(() => {
    if (!state.paymentSession) return;

    const checkDispensingStatus = () => {
      const session = sessionServiceRef.current.getSession(state.paymentSession!.id);
      if (session && session.dispensingStatus !== state.dispensingStatus) {
        dispatch({ type: 'SET_DISPENSING_STATUS', status: session.dispensingStatus });
        
        if (session.dispensingStatus === 'dispensing') {
          toast({
            title: 'เริ่มจ่ายน้ำมัน',
            description: 'กำลังจ่ายน้ำมันให้คุณ'
          });
        } else if (session.dispensingStatus === 'completed') {
          dispatch({ type: 'SET_STEP', step: 'success' });
          toast({
            title: 'จ่ายน้ำมันเสร็จสิ้น',
            description: 'ขอบคุณที่ใช้บริการ'
          });
        }
      }
    };

    const timer = setInterval(checkDispensingStatus, 1000);
    return () => clearInterval(timer);
  }, [state.paymentSession, state.dispensingStatus, dispatch, toast]);

  return {
    createPaymentSession,
    retryPayment,
    clearSession,
    isLoading: state.isLoading,
    error: state.error
  };
}