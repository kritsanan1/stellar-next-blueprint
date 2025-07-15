import { z } from 'zod';

// Validation schemas
export const amountSchema = z.number()
  .min(1, 'จำนวนเงินต้องมากกว่า 0 บาท')
  .max(10000, 'จำนวนเงินต้องไม่เกิน 10,000 บาท');

export const litersSchema = z.number()
  .min(0.1, 'จำนวนลิตรต้องมากกว่า 0.1 ลิตร')
  .max(200, 'จำนวนลิตรต้องไม่เกิน 200 ลิตร');

export const sessionIdSchema = z.string()
  .min(1, 'Session ID is required')
  .regex(/^fuel_\d+_[a-z0-9]+$/, 'Invalid session ID format');

// Validation functions
export function validateAmount(amount: number): { isValid: boolean; error?: string } {
  try {
    amountSchema.parse(amount);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid amount' };
  }
}

export function validateLiters(liters: number): { isValid: boolean; error?: string } {
  try {
    litersSchema.parse(liters);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid liters' };
  }
}

export function validateSessionId(sessionId: string): { isValid: boolean; error?: string } {
  try {
    sessionIdSchema.parse(sessionId);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid session ID' };
  }
}