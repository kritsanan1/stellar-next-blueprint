import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Fuel, RotateCcw, Home } from 'lucide-react';

interface PaymentSuccessProps {
  amount: number;
  sessionId: string;
  dispensingStatus: 'waiting' | 'dispensing' | 'completed';
  onNewTransaction: () => void;
  onHome: () => void;
}

export function PaymentSuccess({ 
  amount, 
  sessionId, 
  dispensingStatus, 
  onNewTransaction, 
  onHome 
}: PaymentSuccessProps) {
  const [fuelProgress, setFuelProgress] = useState(0);
  const [isDispensing, setIsDispensing] = useState(false);

  useEffect(() => {
    if (dispensingStatus === 'dispensing') {
      setIsDispensing(true);
      // Simulate fuel dispensing progress
      const interval = setInterval(() => {
        setFuelProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsDispensing(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [dispensingStatus]);

  const getStatusText = () => {
    switch (dispensingStatus) {
      case 'waiting':
        return 'กรุณาเตรียมรถ หัวจ่ายจะเริ่มทำงาน';
      case 'dispensing':
        return 'กำลังจ่ายน้ำมัน กรุณารอสักครู่...';
      case 'completed':
        return 'จ่ายน้ำมันเสร็จสิ้น ขอบคุณที่ใช้บริการ';
      default:
        return 'กำลังเตรียมระบบ';
    }
  };

  const estimatedLiters = (amount / 35).toFixed(2); // Assuming 35 baht per liter

  return (
    <div className="space-y-8 text-center slide-up">
      {/* Success Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full success-glow bounce-in">
          <CheckCircle className="w-12 h-12 text-success-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">ชำระเงินสำเร็จ!</h1>
        <p className="text-lg text-muted-foreground">การทำธุรกรรมเสร็จสมบูรณ์</p>
      </div>

      {/* Transaction Summary */}
      <Card className="payment-card max-w-md mx-auto">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">รายละเอียดการชำระเงิน</h3>
            
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">จำนวนเงิน</span>
                <span className="text-xl font-bold text-primary">{amount.toLocaleString()} บาท</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">น้ำมันโดยประมาณ</span>
                <span className="font-semibold">{estimatedLiters} ลิตร</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Session ID</span>
                <span className="font-mono text-sm">{sessionId}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Fuel Dispensing Status */}
      <Card className="payment-card max-w-md mx-auto">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3">
            <div className={`p-3 rounded-full transition-all duration-500 ${
              isDispensing ? 'bg-warning/20 pulse-glow' : 'bg-success/20'
            }`}>
              <Fuel className={`w-8 h-8 transition-colors duration-500 ${
                isDispensing ? 'text-warning' : 'text-success'
              }`} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">สถานะการจ่ายน้ำมัน</h3>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">{getStatusText()}</p>

            {/* Progress Bar (show during dispensing) */}
            {dispensingStatus === 'dispensing' && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-success to-success-glow transition-all duration-300 ease-out"
                    style={{ width: `${fuelProgress}%` }}
                  />
                </div>
                <p className="text-sm font-medium text-foreground">{fuelProgress}%</p>
              </div>
            )}

            {/* Status Indicators */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={`p-3 rounded-lg text-center transition-all duration-300 ${
                dispensingStatus === 'waiting' 
                  ? 'bg-warning/20 text-warning font-semibold' 
                  : 'bg-muted/50 text-muted-foreground'
              }`}>
                เตรียมพร้อม
              </div>
              <div className={`p-3 rounded-lg text-center transition-all duration-300 ${
                dispensingStatus === 'dispensing' 
                  ? 'bg-warning/20 text-warning font-semibold' 
                  : 'bg-muted/50 text-muted-foreground'
              }`}>
                กำลังจ่าย
              </div>
              <div className={`p-3 rounded-lg text-center transition-all duration-300 ${
                dispensingStatus === 'completed' 
                  ? 'bg-success/20 text-success font-semibold' 
                  : 'bg-muted/50 text-muted-foreground'
              }`}>
                เสร็จสิ้น
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <Button
          onClick={onNewTransaction}
          className="flex-1 h-12 fuel-button"
          disabled={dispensingStatus === 'dispensing'}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          ทำธุรกรรมใหม่
        </Button>
        
        <Button
          variant="outline"
          onClick={onHome}
          className="flex-1 h-12 border-2"
          disabled={dispensingStatus === 'dispensing'}
        >
          <Home className="w-5 h-5 mr-2" />
          หน้าหลัก
        </Button>
      </div>

      {/* Safety Notice */}
      {dispensingStatus === 'dispensing' && (
        <Card className="p-4 bg-warning/10 border-warning/30 max-w-md mx-auto">
          <p className="text-sm text-warning-foreground font-medium">
            ⚠️ กรุณาอยู่ใกล้รถในขณะจ่ายน้ำมัน และปิดเครื่องยนต์
          </p>
        </Card>
      )}
    </div>
  );
}