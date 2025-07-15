import { useCallback } from 'react';
import { FuelType } from '@/types/fuel';
import { FuelCalculationService } from '@/services/FuelCalculationService';
import { useFuelStationContext } from '@/context/FuelStationContext';
import { validateAmount, validateLiters } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';

export function useFuelCalculation() {
  const { state, dispatch } = useFuelStationContext();
  const { toast } = useToast();

  const selectAmount = useCallback((amount: number, fuelType?: FuelType, liters?: number) => {
    // Validate amount
    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      toast({
        title: 'จำนวนเงินไม่ถูกต้อง',
        description: amountValidation.error,
        variant: 'destructive'
      });
      return false;
    }

    // Validate liters if provided
    if (liters !== undefined) {
      const litersValidation = validateLiters(liters);
      if (!litersValidation.isValid) {
        toast({
          title: 'จำนวนลิตรไม่ถูกต้อง',
          description: litersValidation.error,
          variant: 'destructive'
        });
        return false;
      }
    }

    dispatch({
      type: 'SELECT_AMOUNT',
      amount,
      fuelType,
      liters
    });

    return true;
  }, [dispatch, toast]);

  const setCalculationMode = useCallback((mode: 'amount' | 'liters') => {
    dispatch({ type: 'SET_CALCULATION_MODE', mode });
  }, [dispatch]);

  const calculateFromAmount = useCallback((amount: number, fuelType: FuelType) => {
    if (!FuelCalculationService.validateAmount(amount)) {
      return null;
    }

    return FuelCalculationService.createCalculation(amount, fuelType, 'amount');
  }, []);

  const calculateFromLiters = useCallback((liters: number, fuelType: FuelType) => {
    if (!FuelCalculationService.validateLiters(liters)) {
      return null;
    }

    return FuelCalculationService.createCalculation(liters, fuelType, 'liters');
  }, []);

  const getEstimatedLiters = useCallback((amount: number, fuelType?: FuelType) => {
    if (!fuelType) return 0;
    return FuelCalculationService.calculateLitersFromAmount(amount, fuelType);
  }, []);

  const getEstimatedAmount = useCallback((liters: number, fuelType?: FuelType) => {
    if (!fuelType) return 0;
    return FuelCalculationService.calculateAmountFromLiters(liters, fuelType);
  }, []);

  return {
    // State
    selectedAmount: state.selectedAmount,
    selectedFuelType: state.selectedFuelType,
    selectedLiters: state.selectedLiters,
    calculationMode: state.calculationMode,

    // Actions
    selectAmount,
    setCalculationMode,

    // Calculations
    calculateFromAmount,
    calculateFromLiters,
    getEstimatedLiters,
    getEstimatedAmount,

    // Validation
    validateAmount: (amount: number) => FuelCalculationService.validateAmount(amount),
    validateLiters: (liters: number) => FuelCalculationService.validateLiters(liters)
  };
}