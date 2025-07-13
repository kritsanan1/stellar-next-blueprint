import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Clock, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

interface QRCodeDisplayProps {
  amount: number;
  sessionId: string;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  timeRemaining: number;
  onBack: () => void;
  onRetry?: () => void;
}

export function QRCodeDisplay({ 
  amount, 
  sessionId, 
  paymentStatus, 
  timeRemaining, 
  onBack, 
  onRetry 
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

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
          className: 'status-pending pulse-glow',
          description: 'กรุณาสแกน QR Code เพื่อชำระเงิน'
        };
      case 'processing':
        return {
          icon: Clock,
          label: 'กำลังตรวจสอบการชำระเงิน',
          className: 'status-pending pulse-glow',
          description: 'กำลังรอการยืนยันจากธนาคาร'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'ชำระเงินสำเร็จ',
          className: 'status-success bounce-in',
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
    <div className="space-y-6 slide-up">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">สแกนเพื่อชำระเงิน</h2>
        </div>
        <p className="text-lg font-semibold text-primary">
          จำนวนเงิน: {amount.toLocaleString()} บาท
        </p>
      </div>

      {/* QR Code Container */}
      <Card className="qr-container max-w-sm mx-auto fade-in-scale">
        <div className="text-center space-y-4">
          {qrGenerated ? (
            <div className="space-y-4">
              <canvas 
                ref={canvasRef} 
                className="mx-auto rounded-lg shadow-lg"
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
        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${statusConfig.className}`}>
          <StatusIcon className="w-5 h-5" />
          <span className="font-semibold">{statusConfig.label}</span>
        </div>
        
        <p className="text-muted-foreground">{statusConfig.description}</p>

        {/* Timer (only show for pending/processing) */}
        {(paymentStatus === 'pending' || paymentStatus === 'processing') && (
          <div className="space-y-2">
            <div className="text-2xl font-mono font-bold text-warning">
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
          className="px-8 py-3 border-2"
        >
          กลับไปเลือกจำนวนเงิน
        </Button>
        
        {paymentStatus === 'failed' && onRetry && (
          <Button
            onClick={onRetry}
            className="px-8 py-3 fuel-button"
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