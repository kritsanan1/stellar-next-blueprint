import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FuelType } from '@/types/fuel';
import { PaymentSessionData, PaymentStatus } from '@/services/PaymentService';
import { DispensingStatus } from '@/services/SessionService';

export type AppStep = 'amount-selection' | 'payment' | 'success';

export interface FuelStationState {
  // Current workflow step
  currentStep: AppStep;
  
  // Selection state
  selectedAmount: number;
  selectedFuelType?: FuelType;
  selectedLiters?: number;
  calculationMode: 'amount' | 'liters';
  
  // Payment state
  paymentSession?: PaymentSessionData;
  timeRemaining: number;
  
  // Dispensing state
  dispensingStatus: DispensingStatus;
  
  // UI state
  isLoading: boolean;
  error?: string;
}

export type FuelStationAction =
  | { type: 'SET_STEP'; step: AppStep }
  | { type: 'SELECT_AMOUNT'; amount: number; fuelType?: FuelType; liters?: number }
  | { type: 'SET_CALCULATION_MODE'; mode: 'amount' | 'liters' }
  | { type: 'SET_PAYMENT_SESSION'; session: PaymentSessionData }
  | { type: 'UPDATE_PAYMENT_STATUS'; status: PaymentStatus }
  | { type: 'SET_TIME_REMAINING'; time: number }
  | { type: 'SET_DISPENSING_STATUS'; status: DispensingStatus }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error?: string }
  | { type: 'CLEAR_SESSION' }
  | { type: 'RESET_STATE' };

const initialState: FuelStationState = {
  currentStep: 'amount-selection',
  selectedAmount: 0,
  calculationMode: 'amount',
  timeRemaining: 0,
  dispensingStatus: 'waiting',
  isLoading: false
};

function fuelStationReducer(state: FuelStationState, action: FuelStationAction): FuelStationState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
      
    case 'SELECT_AMOUNT':
      return {
        ...state,
        selectedAmount: action.amount,
        selectedFuelType: action.fuelType,
        selectedLiters: action.liters
      };
      
    case 'SET_CALCULATION_MODE':
      return { ...state, calculationMode: action.mode };
      
    case 'SET_PAYMENT_SESSION':
      return { 
        ...state, 
        paymentSession: action.session,
        timeRemaining: 300 // 5 minutes
      };
      
    case 'UPDATE_PAYMENT_STATUS':
      return state.paymentSession 
        ? { ...state, paymentSession: { ...state.paymentSession, status: action.status } }
        : state;
        
    case 'SET_TIME_REMAINING':
      return { ...state, timeRemaining: action.time };
      
    case 'SET_DISPENSING_STATUS':
      return { ...state, dispensingStatus: action.status };
      
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
      
    case 'SET_ERROR':
      return { ...state, error: action.error };
      
    case 'CLEAR_SESSION':
      return {
        ...state,
        paymentSession: undefined,
        timeRemaining: 0,
        dispensingStatus: 'waiting',
        error: undefined
      };
      
    case 'RESET_STATE':
      return {
        ...initialState,
        selectedAmount: 0,
        selectedFuelType: undefined,
        selectedLiters: undefined
      };
      
    default:
      return state;
  }
}

interface FuelStationContextType {
  state: FuelStationState;
  dispatch: React.Dispatch<FuelStationAction>;
}

const FuelStationContext = createContext<FuelStationContextType | undefined>(undefined);

export function FuelStationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fuelStationReducer, initialState);
  
  return (
    <FuelStationContext.Provider value={{ state, dispatch }}>
      {children}
    </FuelStationContext.Provider>
  );
}

export function useFuelStationContext() {
  const context = useContext(FuelStationContext);
  if (!context) {
    throw new Error('useFuelStationContext must be used within a FuelStationProvider');
  }
  return context;
}