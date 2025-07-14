import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Clock, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { FuelType } from '@/types/fuel';
import { gsapAnimations } from '@/lib/animations';

interface QRCodeDisplayProps {
  amount: number;
  fuelType?: FuelType;
  liters?: number;
  sessionId: string;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  timeRemaining: number;
  onBack: () => void;
  onRetry?: () => void;
}

export function QRCodeDisplay({ 
  amount, 
  fuelType,
  liters,
  sessionId, 
  paymentStatus, 
  timeRemaining, 
  onBack, 
  onRetry 
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCardRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      gsapAnimations.slideUp(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCardRef.current && qrGenerated) {
      gsapAnimations.qrCodeReveal(qrCardRef.current);
    }
  }, [qrGenerated]);

  useEffect(() => {
    if (statusRef.current && paymentStatus === 'pending') {
      gsapAnimations.pulseGlow(statusRef.current);
    }
  }, [paymentStatus]);

  // Generate PromptPay QR Code (simulated)
  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      // Simulated PromptPay data - in real implementation, this would be actual PromptPay format
      const promptPayData = `00020101021229370016A000000677010111011300669999999995204599953040065802TH630477B6`;
      
      await QRCode.toCanvas(canvasRef.current, promptPayData, {
        width: 280,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      
      setQrGenerated(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [amount, sessionId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusConfig = () => {
    switch (paymentStatus) {
      case 'pending':
        return {
          icon: Clock,
          label: 'รอการชำระเงิน',
          className: 'status-pending',
          description: 'กรุณาสแกน QR Code เพื่อชำระเงิน'
        };
      case 'processing':
        return {
          icon: Clock,
          label: 'กำลังตรวจสอบการชำระเงิน',
          className: 'status-pending',
          description: 'กำลังรอการยืนยันจากธนาคาร'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'ชำระเงินสำเร็จ',
          className: 'status-success',
          description: 'สามารถจ่ายน้ำมันได้แล้ว'
        };
      case 'failed':
        return {
          icon: AlertCircle,
          label: 'การชำระเงินล้มเหลว',
          className: 'bg-destructive text-destructive-foreground',
          description: 'กรุณาลองใหม่อีกครั้ง'
        };
      default:
        return {
          icon: Clock,
          label: 'รอการชำระเงิน',
          className: 'status-pending',
          description: 'กรุณาสแกน QR Code เพื่อชำระเงิน'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div ref={containerRef} className="space-y-6 opacity-0">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">สแกนเพื่อชำระเงิน</h2>
        </div>
        
        {/* Enhanced Payment Summary */}
        <div className="space-y-2">
          {fuelType && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">{fuelType.icon}</span>
              <span className="text-lg font-semibold">{fuelType.name}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-primary/5 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">จำนวนเงิน</p>
              <p className="text-xl font-bold text-primary">{amount.toLocaleString()} บาท</p>
            </div>
            {liters && (
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">ปริมาณน้ำมัน</p>
                <p className="text-xl font-bold text-primary">{liters.toFixed(2)} ลิตร</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Container */}
      <Card ref={qrCardRef} className="qr-container max-w-sm mx-auto opacity-0">
        <div className="text-center space-y-4">
          {qrGenerated ? (
            <div className="space-y-4">
              <canvas 
                ref={canvasRef} 
                className="mx-auto rounded-lg shadow-lg transition-transform hover:scale-105 duration-300"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">สแกน QR Code ด้วยแอปธนาคาร</p>
                <p className="text-xs text-muted-foreground">หรือแอป PromptPay</p>
              </div>
            </div>
          ) : (
            <div className="py-16">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-sm text-muted-foreground">กำลังสร้าง QR Code...</p>
            </div>
          )}
        </div>
      </Card>

      {/* Status Display */}
      <div className="text-center space-y-4">
        <div 
          ref={statusRef}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${statusConfig.className}`}
        >
          <StatusIcon className="w-5 h-5" />
          <span className="font-semibold">{statusConfig.label}</span>
        </div>
        
        <p className="text-muted-foreground">{statusConfig.description}</p>

        {/* Timer (only show for pending/processing) */}
        {(paymentStatus === 'pending' || paymentStatus === 'processing') && (
          <div className="space-y-2">
            <div className="text-2xl font-mono font-bold text-warning animate-pulse">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-muted-foreground">เวลาที่เหลือสำหรับการชำระเงิน</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 py-3 border-2 transition-all hover:scale-105"
        >
          กลับไปเลือกจำนวนเงิน
        </Button>
        
        {paymentStatus === 'failed' && onRetry && (
          <Button
            onClick={onRetry}
            className="px-8 py-3 fuel-button transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            ลองใหม่
          </Button>
        )}
      </div>

      {/* Session Info */}
      <div className="text-center text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        Session ID: {sessionId}
      </div>
    </div>
  );
}