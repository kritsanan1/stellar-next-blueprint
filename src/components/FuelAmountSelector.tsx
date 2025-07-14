import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FuelAmount, FuelType, PRESET_AMOUNTS, FUEL_TYPES } from '@/types/fuel';
import { Fuel, Calculator, Droplets } from 'lucide-react';
import { gsapAnimations } from '@/lib/animations';

interface FuelAmountSelectorProps {
  onAmountSelect: (amount: number, fuelType?: FuelType, liters?: number) => void;
  selectedAmount?: number;
}

export function FuelAmountSelector({ onAmountSelect, selectedAmount }: FuelAmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>(FUEL_TYPES[0]);
  const [calculationMode, setCalculationMode] = useState<'amount' | 'liters'>('amount');
  const [liters, setLiters] = useState<string>('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fuelCardsRef = useRef<HTMLDivElement[]>([]);
  const presetButtonsRef = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      gsapAnimations.slideUp(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (fuelCardsRef.current.length > 0) {
      gsapAnimations.staggerCards(fuelCardsRef.current);
    }
  }, []);

  const handlePresetSelect = (amount: number) => {
    setIsCustomMode(false);
    setCustomAmount('');
    setLiters('');
    setCalculationMode('amount');
    
    const calculatedLiters = amount / selectedFuelType.price;
    onAmountSelect(amount, selectedFuelType, calculatedLiters);
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setCustomAmount(numericValue);
    
    if (numericValue) {
      const amount = parseFloat(numericValue);
      if (amount >= 50 && amount <= 10000) {
        const calculatedLiters = amount / selectedFuelType.price;
        onAmountSelect(amount, selectedFuelType, calculatedLiters);
      }
    }
  };

  const handleLitersChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setLiters(numericValue);
    
    if (numericValue) {
      const literAmount = parseFloat(numericValue);
      if (literAmount > 0 && literAmount <= 300) {
        const calculatedAmount = literAmount * selectedFuelType.price;
        onAmountSelect(calculatedAmount, selectedFuelType, literAmount);
      }
    }
  };

  const handleFuelTypeSelect = (fuelType: FuelType) => {
    setSelectedFuelType(fuelType);
    
    // Recalculate based on current mode
    if (calculationMode === 'amount' && customAmount) {
      const amount = parseFloat(customAmount);
      const calculatedLiters = amount / fuelType.price;
      onAmountSelect(amount, fuelType, calculatedLiters);
    } else if (calculationMode === 'liters' && liters) {
      const literAmount = parseFloat(liters);
      const calculatedAmount = literAmount * fuelType.price;
      onAmountSelect(calculatedAmount, fuelType, literAmount);
    }
  };

  const handleModeSwitch = (mode: 'amount' | 'liters') => {
    setCalculationMode(mode);
    setIsCustomMode(true);
    setCustomAmount('');
    setLiters('');
  };

  return (
    <div ref={containerRef} className="space-y-8 opacity-0">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Fuel className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">เลือกน้ำมันและจำนวน</h2>
        </div>
        <p className="text-muted-foreground">เลือกประเภทน้ำมันและจำนวนที่ต้องการ</p>
      </div>

      {/* Fuel Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">ประเภทน้ำมัน</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FUEL_TYPES.map((fuelType, index) => (
            <Card
              key={fuelType.id}
              ref={el => { if (el) fuelCardsRef.current[index] = el as HTMLDivElement; }}
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg opacity-0 ${
                selectedFuelType.id === fuelType.id 
                  ? 'border-2 border-primary bg-primary/5 shadow-lg' 
                  : 'border-2 border-transparent hover:border-primary/50'
              }`}
              onClick={() => handleFuelTypeSelect(fuelType)}
            >
              <div className="text-center space-y-2">
                <div className="text-3xl">{fuelType.icon}</div>
                <h4 className="font-semibold text-sm">{fuelType.name}</h4>
                <div className="space-y-1">
                  <Badge variant="secondary" className="text-xs">
                    {fuelType.price.toFixed(2)} บาท/ลิตร
                  </Badge>
                  <p className="text-xs text-muted-foreground">{fuelType.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Calculation Mode Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border bg-background p-1">
          <Button
            variant={calculationMode === 'amount' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeSwitch('amount')}
            className="px-6"
          >
            <Calculator className="w-4 h-4 mr-2" />
            ตามเงิน
          </Button>
          <Button
            variant={calculationMode === 'liters' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeSwitch('liters')}
            className="px-6"
          >
            <Droplets className="w-4 h-4 mr-2" />
            ตามลิตร
          </Button>
        </div>
      </div>

      {/* Amount Selection */}
      {calculationMode === 'amount' && (
        <div className="space-y-6">
          {/* Preset Amount Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PRESET_AMOUNTS.map((preset, index) => (
              <Button
                key={preset.amount}
                ref={el => { if (el) presetButtonsRef.current[index] = el; }}
                variant={selectedAmount === preset.amount && !isCustomMode ? "default" : "outline"}
                className={`h-16 text-lg font-semibold transition-all duration-300 ${
                  selectedAmount === preset.amount && !isCustomMode
                    ? 'fuel-button text-primary-foreground shadow-lg scale-105'
                    : 'border-2 hover:border-primary hover:bg-primary/5'
                }`}
                onClick={() => handlePresetSelect(preset.amount)}
              >
                <div className="text-center">
                  <div>{preset.label}</div>
                  <div className="text-xs opacity-75">
                    ≈ {(preset.amount / selectedFuelType.price).toFixed(1)} ลิตร
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <Card className="p-6 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="font-medium">กำหนดจำนวนเงินเอง</span>
              </div>
              
              <div className="relative">
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

              {customAmount && (
                <div className="text-sm">
                  {parseFloat(customAmount) < 50 && (
                    <p className="text-destructive">จำนวนเงินขั้นต่ำ 50 บาท</p>
                  )}
                  {parseFloat(customAmount) > 10000 && (
                    <p className="text-destructive">จำนวนเงินสูงสุด 10,000 บาท</p>
                  )}
                  {parseFloat(customAmount) >= 50 && parseFloat(customAmount) <= 10000 && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">
                        จำนวนเงิน: {parseFloat(customAmount).toLocaleString()} บาท
                      </p>
                      <p className="text-primary font-medium">
                        ได้น้ำมัน: {(parseFloat(customAmount) / selectedFuelType.price).toFixed(2)} ลิตร
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Liters Selection */}
      {calculationMode === 'liters' && (
        <Card className="p-6 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              <span className="font-medium">กำหนดจำนวนลิตร</span>
            </div>
            
            <div className="relative">
              <Input
                type="text"
                placeholder="ใส่จำนวนลิตร (1-300 ลิตร)"
                value={liters}
                onChange={(e) => handleLitersChange(e.target.value)}
                className={`h-12 text-lg pl-4 pr-12 ${
                  liters ? 'border-primary ring-1 ring-primary' : ''
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ลิตร
              </span>
            </div>

            {liters && (
              <div className="text-sm">
                {parseFloat(liters) <= 0 && (
                  <p className="text-destructive">จำนวนลิตรต้องมากกว่า 0</p>
                )}
                {parseFloat(liters) > 300 && (
                  <p className="text-destructive">จำนวนลิตรสูงสุด 300 ลิตร</p>
                )}
                {parseFloat(liters) > 0 && parseFloat(liters) <= 300 && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      จำนวนลิตร: {parseFloat(liters).toLocaleString()} ลิตร
                    </p>
                    <p className="text-primary font-medium">
                      ราคา: {(parseFloat(liters) * selectedFuelType.price).toLocaleString()} บาท
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Selected Summary */}
      {selectedAmount && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="text-2xl">{selectedFuelType.icon}</div>
              <h3 className="text-lg font-semibold">{selectedFuelType.name}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">จำนวนเงิน</p>
                <p className="text-2xl font-bold text-primary">
                  {selectedAmount.toLocaleString()} บาท
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">ปริมาณน้ำมัน</p>
                <p className="text-2xl font-bold text-primary">
                  {(selectedAmount / selectedFuelType.price).toFixed(2)} ลิตร
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-primary/20">
              <p className="text-xs text-muted-foreground">
                ราคา {selectedFuelType.price.toFixed(2)} บาท/ลิตร
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}