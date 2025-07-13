import { Fuel, Zap } from 'lucide-react';

export function FuelStationHeader() {
  return (
    <div className="text-center py-8 slide-up">
      <div className="inline-flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="p-4 rounded-full bg-primary/10 pulse-glow">
            <Fuel className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 rounded-full bg-accent">
            <Zap className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-4xl font-bold text-foreground">
            Smart Fuel Station
          </h1>
          <p className="text-lg text-primary font-medium">
            จ่ายน้ำมันอัตโนมัติด้วย QR Code
          </p>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <p className="text-muted-foreground text-lg leading-relaxed">
          ระบบจ่ายน้ำมันที่ทันสมัย สะดวก รวดเร็ว และปลอดภัย
        </p>
        <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span>ปลอดภัย 100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning"></div>
            <span>ชำระเงินรวดเร็ว</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>ไม่ต้องรอคิว</span>
          </div>
        </div>
      </div>
    </div>
  );
}