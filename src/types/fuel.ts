export interface FuelType {
  id: string;
  name: string;
  price: number; // per liter
  icon: string;
  color: string;
  description: string;
}

export interface FuelAmount {
  amount: number;
  label: string;
}

export interface PaymentSession {
  id: string;
  amount: number;
  fuelType?: FuelType;
  liters?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  qrCodeData: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface FuelTransaction {
  id: string;
  sessionId: string;
  amount: number;
  fuelType: FuelType;
  liters: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  fuelDispenseStatus: 'waiting' | 'dispensing' | 'completed' | 'error';
  timestamp: Date;
}

export const FUEL_TYPES: FuelType[] = [
  {
    id: 'gasoline91',
    name: 'เบนซิน 91',
    price: 35.50,
    icon: '⛽',
    color: 'text-blue-600',
    description: 'เบนซินธรรมดา'
  },
  {
    id: 'gasoline95',
    name: 'เบนซิน 95',
    price: 36.80,
    icon: '⛽',
    color: 'text-green-600',
    description: 'เบนซินพรีเมียม'
  },
  {
    id: 'e20',
    name: 'แก๊สโซฮอล์ E20',
    price: 33.90,
    icon: '🌱',
    color: 'text-emerald-600',
    description: 'เชื้อเพลิงเอทานอล'
  },
  {
    id: 'diesel',
    name: 'ดีเซล',
    price: 32.50,
    icon: '🚛',
    color: 'text-amber-600',
    description: 'น้ำมันดีเซล'
  }
];

export const PRESET_AMOUNTS: FuelAmount[] = [
  { amount: 100, label: '100 บาท' },
  { amount: 200, label: '200 บาท' },
  { amount: 300, label: '300 บาท' },
  { amount: 500, label: '500 บาท' },
  { amount: 1000, label: '1,000 บาท' },
];