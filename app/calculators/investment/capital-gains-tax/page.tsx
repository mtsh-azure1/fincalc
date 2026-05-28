'use client';

import { useState } from 'react';
import { SliderInput } from '@/components/slider-input';
import { ResultCard } from '@/components/result-card';

export default function CapitalGainsTaxCalculator() {
  const [buyDate, setBuyDate] = useState('2020-01-01');
  const [sellDate, setSellDate] = useState('2025-01-01');
  const [costPrice, setCostPrice] = useState(100000);
  const [sellPrice, setSellPrice] = useState(250000);
  const [improvementCost, setImprovementCost] = useState(0);
  const [brokerage, setBrokerage] = useState(5000);
  const [assetType, setAssetType] = useState('equity');

  const buyDateObj = new Date(buyDate);
  const sellDateObj = new Date(sellDate);
  const holdingDays = Math.floor((sellDateObj.getTime() - buyDateObj.getTime()) / (1000 * 60 * 60 * 24));
  const isLongTerm = holdingDays > 365;

  const indexedCost = assetType === 'real_estate' && isLongTerm 
    ? (costPrice + improvementCost) * 1.2 
    : costPrice + improvementCost;

  const totalExpenses = indexedCost + brokerage;
  const gain = Math.max(0, sellPrice - totalExpenses);

  let taxRate = 0;
  if (assetType === 'equity') {
    taxRate = isLongTerm ? 0.1 : 0.15;
  } else if (assetType === 'debt') {
    taxRate = isLongTerm ? 0.2 : 0.3;
  } else if (assetType === 'real_estate') {
    taxRate = isLongTerm ? 0.2 : 0.3;
  }

  const tax = gain * taxRate;
  const netProceeds = sellPrice - tax;

  return (
    <div className="space-y-8 pb-12">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 flex justify-between items-center">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          📊 Indexation and tax rates simplified. Consult a CA for real estate capital gains calculations.
        </p>
        <button className="text-amber-900 dark:text-amber-100 text-sm">✕</button>
      </div>

      {/* Main Calculator */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Capital Gains Details
          </h2>

          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
              Asset Type
            </label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
            >
              <option value="equity">Stocks / Mutual Funds (Equity)</option>
              <option value="debt">Bonds / Fixed Deposits (Debt)</option>
              <option value="real_estate">Real Estate</option>
              <option value="crypto">Crypto</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
              Buy Date
            </label>
            <input
              type="date"
              value={buyDate}
              onChange={(e) => setBuyDate(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
              Sell Date
            </label>
            <input
              type="date"
              value={sellDate}
              onChange={(e) => setSellDate(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
            />
          </div>

          <SliderInput
            label="Cost Price / Acquisition Cost"
            value={costPrice}
            onChange={setCostPrice}
            min={10000}
            max={10000000}
            step={10000}
            prefix="₹"
          />

          <SliderInput
            label="Sale Price"
            value={sellPrice}
            onChange={setSellPrice}
            min={10000}
            max={10000000}
            step={10000}
            prefix="₹"
          />

          {assetType === 'real_estate' && (
            <SliderInput
              label="Improvement Cost"
              value={improvementCost}
              onChange={setImprovementCost}
              min={0}
              max={5000000}
              step={50000}
              prefix="₹"
            />
          )}

          <SliderInput
            label="Brokerage / Transaction Cost"
            value={brokerage}
            onChange={setBrokerage}
            min={0}
            max={500000}
            step={5000}
            prefix="₹"
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          <ResultCard
            title={isLongTerm ? 'LTCG Tax' : 'STCG Tax'}
            value={tax}
            color="error"
            supportingValues={[
              { label: 'Holding Period', value: isLongTerm ? 'Long-term' : 'Short-term' },
              { label: 'Tax Rate', value: `${(taxRate * 100).toFixed(0)}%` },
            ]}
          />

          <ResultCard
            title="Capital Gain"
            value={gain}
            color={gain > 0 ? 'success' : 'error'}
            supportingValues={[
              { label: 'Sale Price', value: sellPrice },
              { label: 'Indexed Cost', value: indexedCost },
            ]}
          />

          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sale Price</span>
                <span className="font-semibold">₹{sellPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-error">
                <span>Capital Gains Tax</span>
                <span className="font-semibold">-₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 flex justify-between font-bold">
                <span>Net Proceeds</span>
                <span className="text-success">₹{netProceeds.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {holdingDays > 365 && holdingDays < 400 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                💡 Your holding period is {holdingDays} days. Holding for 1 year makes gains long-term with lower tax.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
