import { useState, useEffect, useCallback, useRef } from 'react';

export interface TimerConfig {
  initialTime: number;
  onTick?: (timeRemaining: number) => void;
  onExpire?: () => void;
  interval?: number;
}

export function useTimer(config: TimerConfig) {
  const [timeRemaining, setTimeRemaining] = useState(config.initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const configRef = useRef(config);
  
  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const start = useCallback(() => {
    if (isRunning || isExpired) return;
    
    setIsRunning(true);
    setIsExpired(false);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1);
        
        // Call onTick callback
        configRef.current.onTick?.(newTime);
        
        // Check if expired
        if (newTime <= 0) {
          setIsExpired(true);
          setIsRunning(false);
          configRef.current.onExpire?.();
          
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        }
        
        return newTime;
      });
    }, config.interval || 1000);
  }, [isRunning, isExpired, config.interval]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const reset = useCallback((newTime?: number) => {
    setIsRunning(false);
    setIsExpired(false);
    setTimeRemaining(newTime ?? config.initialTime);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [config.initialTime]);

  const stop = useCallback(() => {
    pause();
    setTimeRemaining(0);
    setIsExpired(true);
  }, [pause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format time for display
  const formatTime = useCallback((seconds: number = timeRemaining): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  return {
    timeRemaining,
    isRunning,
    isExpired,
    start,
    pause,
    reset,
    stop,
    formatTime
  };
}