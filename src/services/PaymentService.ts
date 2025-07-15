export interface PaymentGateway {
  createPayment(amount: number): Promise<string>;
  checkPaymentStatus(sessionId: string): Promise<PaymentStatus>;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';

export interface PaymentSessionData {
  id: string;
  amount: number;
  status: PaymentStatus;
  qrCodeData: string;
  createdAt: Date;
  expiresAt: Date;
}

export class PaymentService {
  private gateway: PaymentGateway;

  constructor(gateway: PaymentGateway) {
    this.gateway = gateway;
  }

  async createPaymentSession(amount: number): Promise<PaymentSessionData> {
    const sessionId = this.generateSessionId();
    const qrCodeData = await this.gateway.createPayment(amount);
    
    return {
      id: sessionId,
      amount,
      status: 'pending',
      qrCodeData,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    };
  }

  async checkPaymentStatus(sessionId: string): Promise<PaymentStatus> {
    return this.gateway.checkPaymentStatus(sessionId);
  }

  isSessionExpired(session: PaymentSessionData): boolean {
    return new Date() > session.expiresAt;
  }

  private generateSessionId(): string {
    return `fuel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Mock implementation for demo
export class MockPaymentGateway implements PaymentGateway {
  async createPayment(amount: number): Promise<string> {
    return `promptpay_${amount}_${Date.now()}`;
  }

  async checkPaymentStatus(): Promise<PaymentStatus> {
    // Simulate random payment completion (10% chance per check)
    const shouldComplete = Math.random() < 0.1;
    return shouldComplete ? 'completed' : 'processing';
  }
}