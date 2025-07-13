import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FuelAmount, PRESET_AMOUNTS } from '@/types/fuel';
import { Fuel, Calculator } from 'lucide-react';

interface FuelAmountSelectorProps {
  onAmountSelect: (amount: number) => void;
  selectedAmount?: number;
}

export function FuelAmountSelector({ onAmountSelect, selectedAmount }: FuelAmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handlePresetSelect = (amount: number) => {
    setIsCustomMode(false);
    setCustomAmount('');
    onAmountSelect(amount);
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomAmount(numericValue);
    
    if (numericValue) {
      const amount = parseInt(numericValue);
      if (amount >= 50 && amount <= 10000) {
        onAmountSelect(amount);
      }
    }
  };

  const handleCustomModeToggle = () => {
    setIsCustomMode(!isCustomMode);
    if (!isCustomMode) {
      setCustomAmount('');
    }
  };

  return (
    <div className="space-y-6 slide-up">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Fuel className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">เลือกจำนวนเงิน</h2>
        </div>
        <p className="text-muted-foreground">กรุณาเลือกจำนวนเงินที่ต้องการจ่ายค่าน้ำมัน</p>
      </div>

      {/* Preset Amount Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {PRESET_AMOUNTS.map((preset) => (
          <Button
            key={preset.amount}
            variant={selectedAmount === preset.amount && !isCustomMode ? "default" : "outline"}
            className={`h-16 text-lg font-semibold transition-all duration-300 ${
              selectedAmount === preset.amount && !isCustomMode
                ? 'fuel-button text-primary-foreground shadow-lg scale-105'
                : 'border-2 hover:border-primary hover:bg-primary/5 hover:scale-105'
            }`}
            onClick={() => handlePresetSelect(preset.amount)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom Amount Section */}
      <Card className="p-6 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="font-medium">กำหนดจำนวนเงินเอง</span>
          </div>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="ใส่จำนวนเงิน (50-10,000 บาท)"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                onFocus={() => setIsCustomMode(true)}
                className={`h-12 text-lg pl-4 pr-12 ${
                  isCustomMode && customAmount ? 'border-primary ring-1 ring-primary' : ''
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                บาท
              </span>
            </div>
          </div>

          {customAmount && (
            <div className="text-sm text-muted-foreground">
              {parseInt(customAmount) < 50 && 'จำนวนเงินขั้นต่ำ 50 บาท'}
              {parseInt(customAmount) > 10000 && 'จำนวนเงินสูงสุด 10,000 บาท'}
              {parseInt(customAmount) >= 50 && parseInt(customAmount) <= 10000 && 
                `จำนวนเงินที่เลือก: ${parseInt(customAmount).toLocaleString()} บาท`
              }
            </div>
          )}
        </div>
      </Card>

      {/* Selected Amount Display */}
      {selectedAmount && (
        <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/20 bounce-in">
          <p className="text-sm text-muted-foreground mb-1">จำนวนเงินที่เลือก</p>
          <p className="text-3xl font-bold text-primary">
            {selectedAmount.toLocaleString()} บาท
          </p>
        </div>
      )}
    </div>
  );
}