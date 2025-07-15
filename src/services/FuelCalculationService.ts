import { FuelType } from '@/types/fuel';

export interface FuelCalculation {
  amount: number;
  liters: number;
  fuelType: FuelType;
}

export class FuelCalculationService {
  static calculateLitersFromAmount(amount: number, fuelType: FuelType): number {
    if (amount <= 0 || fuelType.price <= 0) return 0;
    return Number((amount / fuelType.price).toFixed(2));
  }

  static calculateAmountFromLiters(liters: number, fuelType: FuelType): number {
    if (liters <= 0 || fuelType.price <= 0) return 0;
    return Number((liters * fuelType.price).toFixed(2));
  }

  static validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 10000; // Max 10,000 baht
  }

  static validateLiters(liters: number): boolean {
    return liters > 0 && liters <= 200; // Max 200 liters
  }

  static createCalculation(
    amount: number, 
    fuelType: FuelType, 
    mode: 'amount' | 'liters' = 'amount'
  ): FuelCalculation {
    if (mode === 'amount') {
      return {
        amount,
        liters: this.calculateLitersFromAmount(amount, fuelType),
        fuelType
      };
    } else {
      const calculatedAmount = this.calculateAmountFromLiters(amount, fuelType);
      return {
        amount: calculatedAmount,
        liters: amount, // In this case, amount is actually liters
        fuelType
      };
    }
  }
}