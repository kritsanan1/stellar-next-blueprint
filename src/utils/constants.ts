// Application constants

export const PAYMENT_CONFIG = {
  TIMEOUT_SECONDS: 300, // 5 minutes
  STATUS_CHECK_INTERVAL: 3000, // 3 seconds
  MAX_AMOUNT: 10000, // 10,000 baht
  MIN_AMOUNT: 1, // 1 baht
  MAX_LITERS: 200, // 200 liters
  MIN_LITERS: 0.1 // 0.1 liters
} as const;

export const DISPENSING_CONFIG = {
  START_DELAY: 2000, // 2 seconds before dispensing starts
  DISPENSING_DURATION: 13000, // 13 seconds of dispensing
  VARIANCE_FACTOR: 0.04 // 4% variance in actual vs expected liters
} as const;

export const ANIMATION_CONFIG = {
  FADE_DURATION: 300,
  SCALE_DURATION: 200,
  SLIDE_DURATION: 400,
  BOUNCE_DURATION: 600
} as const;

export const UI_MESSAGES = {
  PAYMENT_PENDING: 'รอการชำระเงิน',
  PAYMENT_PROCESSING: 'กำลังตรวจสอบการชำระเงิน',
  PAYMENT_COMPLETED: 'ชำระเงินสำเร็จ',
  PAYMENT_FAILED: 'การชำระเงินล้มเหลว',
  PAYMENT_EXPIRED: 'หมดเวลาชำระเงิน',
  DISPENSING_WAITING: 'กำลังเตรียมจ่ายน้ำมัน',
  DISPENSING_ACTIVE: 'กำลังจ่ายน้ำมัน',
  DISPENSING_COMPLETED: 'จ่ายน้ำมันเสร็จสิ้น',
  VALIDATION_AMOUNT_REQUIRED: 'กรุณาเลือกจำนวนเงิน',
  VALIDATION_FUEL_TYPE_REQUIRED: 'กรุณาเลือกประเภทน้ำมัน'
} as const;

export const STATUS_COLORS = {
  pending: 'text-warning-foreground bg-warning',
  processing: 'text-warning-foreground bg-warning',
  completed: 'text-success-foreground bg-success',
  failed: 'text-destructive-foreground bg-destructive',
  expired: 'text-muted-foreground bg-muted'
} as const;