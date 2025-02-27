
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BUY_RATE = 0.3; // Fixed buy rate at 0.3%

const ProfitCalculator = () => {
  const [turnover, setTurnover] = useState<number>(100000);
  const [sellRate, setSellRate] = useState<number>(1.0);
  const [firstHalfProfit, setFirstHalfProfit] = useState<number>(0);
  const [secondHalfProfit, setSecondHalfProfit] = useState<number>(0);
  const [yearlyProfit, setYearlyProfit] = useState<number>(0);

  // Calculate profits whenever inputs change
  useEffect(() => {
    // Formula: profit = percentage * turnover * (sell rate - buy rate)
    const first6MonthsPercentage = 0.3; // 30%
    const second6MonthsPercentage = 0.15; // 15%
    
    const rateDifference = (sellRate - BUY_RATE) / 100; // Convert to decimal
    
    const first6MonthsProfit = turnover * rateDifference * first6MonthsPercentage;
    const second6MonthsProfit = turnover * rateDifference * second6MonthsPercentage;
    
    setFirstHalfProfit(first6MonthsProfit);
    setSecondHalfProfit(second6MonthsProfit);
    setYearlyProfit(first6MonthsProfit + second6MonthsProfit);
  }, [turnover, sellRate]);

  const handleTurnoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTurnover(value);
    }
  };

  const handleSellRateChange = (value: number[]) => {
    setSellRate(value[0]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="text-center mb-10 animate-slideIn">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Partnership Profit Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate potential profits based on turnover and sell rate, with our fixed buy rate of 0.3%.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 calculator-card">
          <div className="space-y-6">
            <div>
              <Label htmlFor="turnover" className="input-label">
                Turnover
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="turnover"
                  type="number"
                  min="0"
                  className="input-field pl-8"
                  value={turnover}
                  onChange={handleTurnoverChange}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="sellRate" className="input-label">
                  Sell Rate
                </Label>
                <span className="text-sm font-medium">{formatPercentage(sellRate)}</span>
              </div>
              <Slider
                id="sellRate"
                min={0.4}
                max={5.0}
                step={0.1}
                value={[sellRate]}
                onValueChange={handleSellRateChange}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0.4%</span>
                <span>5.0%</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Buy Rate (Fixed)</span>
                <span className="font-medium">{formatPercentage(BUY_RATE)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Rate Difference</span>
                <span className="font-medium">{formatPercentage(sellRate - BUY_RATE)}</span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 calculator-card result-card">
          <h3 className="text-xl font-medium mb-6">Profit Breakdown</h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm text-gray-500 mb-1">First 6 Months (30%)</h4>
              <p className="text-2xl font-semibold">{formatCurrency(firstHalfProfit)}</p>
              <div className="text-xs text-gray-500 mt-1">
                30% × {formatCurrency(turnover)} × {(sellRate - BUY_RATE).toFixed(2)}%
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm text-gray-500 mb-1">Second 6 Months (15%)</h4>
              <p className="text-2xl font-semibold">{formatCurrency(secondHalfProfit)}</p>
              <div className="text-xs text-gray-500 mt-1">
                15% × {formatCurrency(turnover)} × {(sellRate - BUY_RATE).toFixed(2)}%
              </div>
            </div>
            
            <div className="p-4 bg-gray-100 rounded-lg border-t-4 border-black">
              <h4 className="text-sm text-gray-600 mb-1">Total Yearly Profit</h4>
              <p className="text-3xl font-bold">{formatCurrency(yearlyProfit)}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mt-10 text-center text-sm text-gray-500 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
        <p>
          The profit calculation is based on your partner's turnover and the difference between your sell rate and our fixed buy rate of 0.3%.
          <br />
          First 6 months: 30% of (turnover × rate difference) | Second 6 months: 15% of (turnover × rate difference)
        </p>
      </div>
    </div>
  );
};

export default ProfitCalculator;
