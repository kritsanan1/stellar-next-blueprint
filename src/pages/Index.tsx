import { FuelStationHeader } from '@/components/FuelStationHeader';
import { FuelAmountSelector } from '@/components/FuelAmountSelector';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { PaymentSuccess } from '@/components/PaymentSuccess';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { FuelType } from '@/types/fuel';
import { FuelStationProvider, useFuelStationContext } from '@/context/FuelStationContext';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { useFuelCalculation } from '@/hooks/useFuelCalculation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Main app component wrapped with context
const Index = () => {
  return (
    <ErrorBoundary>
      <FuelStationProvider>
        <FuelStationApp />
      </FuelStationProvider>
    </ErrorBoundary>
  );
};

// Actual app logic component
const FuelStationApp = () => {
  const { state, dispatch } = useFuelStationContext();
  const { createPaymentSession, retryPayment, clearSession, isLoading } = usePaymentFlow();
  const { selectAmount } = useFuelCalculation();

  const handleAmountSelect = (amount: number, fuelType?: FuelType, liters?: number) => {
    selectAmount(amount, fuelType, liters);
  };

  const handleProceedToPayment = async () => {
    if (state.selectedAmount > 0) {
      await createPaymentSession(state.selectedAmount);
    }
  };

  const handleBackToAmountSelection = () => {
    clearSession();
    dispatch({ type: 'SET_STEP', step: 'amount-selection' });
    dispatch({ type: 'SELECT_AMOUNT', amount: 0 });
  };

  const handleRetryPayment = async () => {
    await retryPayment();
  };

  const handleNewTransaction = () => {
    clearSession();
    dispatch({ type: 'RESET_STATE' });
  };

  const handleGoHome = () => {
    clearSession();
    dispatch({ type: 'RESET_STATE' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <FuelStationHeader />
          <div className="mt-8">
            <LoadingSpinner size="lg" text="กำลังประมวลผล..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <FuelStationHeader />

        {/* Main Content */}
        <div className="space-y-8">
          {state.currentStep === 'amount-selection' && (
            <>
              <FuelAmountSelector
                onAmountSelect={handleAmountSelect}
                selectedAmount={state.selectedAmount}
              />
              
              {state.selectedAmount > 0 && (
                <div className="text-center bounce-in">
                  <Button
                    onClick={handleProceedToPayment}
                    size="lg"
                    className="payment-button text-lg px-12 py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        กำลังสร้าง QR Code...
                      </>
                    ) : (
                      'ดำเนินการชำระเงิน'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}

          {state.currentStep === 'payment' && state.paymentSession && (
            <QRCodeDisplay
              amount={state.paymentSession.amount}
              fuelType={state.selectedFuelType}
              liters={state.selectedLiters}
              sessionId={state.paymentSession.id}
              paymentStatus={state.paymentSession.status}
              timeRemaining={state.timeRemaining}
              onBack={handleBackToAmountSelection}
              onRetry={handleRetryPayment}
            />
          )}

          {state.currentStep === 'success' && state.paymentSession && (
            <PaymentSuccess
              amount={state.paymentSession.amount}
              sessionId={state.paymentSession.id}
              dispensingStatus={state.dispensingStatus}
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
