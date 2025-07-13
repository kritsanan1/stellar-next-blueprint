export interface FuelAmount {
  amount: number;
  label: string;
}

export interface PaymentSession {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  qrCodeData: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface FuelTransaction {
  id: string;
  sessionId: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  fuelDispenseStatus: 'waiting' | 'dispensing' | 'completed' | 'error';
  timestamp: Date;
}

export const PRESET_AMOUNTS: FuelAmount[] = [
  { amount: 100, label: '100 บาท' },
  { amount: 200, label: '200 บาท' },
  { amount: 300, label: '300 บาท' },
  { amount: 500, label: '500 บาท' },
  { amount: 1000, label: '1,000 บาท' },
];