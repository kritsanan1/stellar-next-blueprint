import { useState } from 'react';
import { FuelStationHeader } from '@/components/FuelStationHeader';
import { FuelAmountSelector } from '@/components/FuelAmountSelector';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { PaymentSuccess } from '@/components/PaymentSuccess';
import { usePaymentSession } from '@/hooks/usePaymentSession';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

type AppStep = 'amount-selection' | 'payment' | 'success';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('amount-selection');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  
  const { 
    session, 
    timeRemaining, 
    dispensingStatus, 
    createSession, 
    retryPayment, 
    clearSession 
  } = usePaymentSession();

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleProceedToPayment = () => {
    if (selectedAmount > 0) {
      createSession(selectedAmount);
      setCurrentStep('payment');
    }
  };

  const handleBackToAmountSelection = () => {
    clearSession();
    setCurrentStep('amount-selection');
    setSelectedAmount(0);
  };

  const handleRetryPayment = () => {
    if (retryPayment()) {
      // Payment session recreated, stay on payment step
    }
  };

  const handlePaymentComplete = () => {
    setCurrentStep('success');
  };

  const handleNewTransaction = () => {
    clearSession();
    setCurrentStep('amount-selection');
    setSelectedAmount(0);
  };

  const handleGoHome = () => {
    clearSession();
    setCurrentStep('amount-selection');
    setSelectedAmount(0);
  };

  // Auto advance to success when payment is completed
  if (session?.status === 'completed' && currentStep === 'payment') {
    handlePaymentComplete();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <FuelStationHeader />

        {/* Main Content */}
        <div className="space-y-8">
          {currentStep === 'amount-selection' && (
            <>
              <FuelAmountSelector
                onAmountSelect={handleAmountSelect}
                selectedAmount={selectedAmount}
              />
              
              {selectedAmount > 0 && (
                <div className="text-center bounce-in">
                  <Button
                    onClick={handleProceedToPayment}
                    size="lg"
                    className="payment-button text-lg px-12 py-6"
                  >
                    ดำเนินการชำระเงิน
                  </Button>
                </div>
              )}
            </>
          )}

          {currentStep === 'payment' && session && (
            <QRCodeDisplay
              amount={session.amount}
              sessionId={session.id}
              paymentStatus={session.status}
              timeRemaining={timeRemaining}
              onBack={handleBackToAmountSelection}
              onRetry={handleRetryPayment}
            />
          )}

          {currentStep === 'success' && session && (
            <PaymentSuccess
              amount={session.amount}
              sessionId={session.id}
              dispensingStatus={dispensingStatus}
              onNewTransaction={handleNewTransaction}
              onHome={handleGoHome}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 py-8 border-t border-border">
          <div className="flex justify-center items-center gap-2 text-muted-foreground">
            <Home className="w-4 h-4" />
            <span className="text-sm">
              Smart Fuel Station System - Powered by QR Technology
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            ระบบปลอดภัยด้วยการเข้ารหัส SSL และการตรวจสอบแบบ Real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
