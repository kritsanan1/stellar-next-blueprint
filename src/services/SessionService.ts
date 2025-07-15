export type DispensingStatus = 'waiting' | 'dispensing' | 'completed' | 'error';

export interface FuelSession {
  paymentSessionId: string;
  dispensingStatus: DispensingStatus;
  startTime?: Date;
  endTime?: Date;
  actualLitersDispensed?: number;
}

export class SessionService {
  private sessions = new Map<string, FuelSession>();

  createFuelSession(paymentSessionId: string): FuelSession {
    const session: FuelSession = {
      paymentSessionId,
      dispensingStatus: 'waiting'
    };
    
    this.sessions.set(paymentSessionId, session);
    return session;
  }

  startDispensing(paymentSessionId: string): void {
    const session = this.sessions.get(paymentSessionId);
    if (session) {
      session.dispensingStatus = 'dispensing';
      session.startTime = new Date();
      this.sessions.set(paymentSessionId, session);
    }
  }

  completeDispensing(paymentSessionId: string, actualLiters: number): void {
    const session = this.sessions.get(paymentSessionId);
    if (session) {
      session.dispensingStatus = 'completed';
      session.endTime = new Date();
      session.actualLitersDispensed = actualLiters;
      this.sessions.set(paymentSessionId, session);
    }
  }

  getSession(paymentSessionId: string): FuelSession | undefined {
    return this.sessions.get(paymentSessionId);
  }

  clearSession(paymentSessionId: string): void {
    this.sessions.delete(paymentSessionId);
  }

  // Simulate dispensing process
  async simulateDispensing(paymentSessionId: string, expectedLiters: number): Promise<void> {
    this.startDispensing(paymentSessionId);
    
    // Simulate dispensing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate actual dispensing (with small variance)
    const actualLiters = expectedLiters * (0.98 + Math.random() * 0.04);
    
    await new Promise(resolve => setTimeout(resolve, 13000)); // 13 seconds of dispensing
    
    this.completeDispensing(paymentSessionId, Number(actualLiters.toFixed(2)));
  }
}