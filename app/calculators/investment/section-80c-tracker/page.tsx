'use client';

import { useState, useMemo } from 'react';
import { SliderInput } from '@/components/slider-input';
import { ResultCard } from '@/components/result-card';

export default function Section80CTrackerCalculator() {
  const [ppf, setPPF] = useState(0);
  const [elss, setELSS] = useState(0);
  const [nsc, setNSC] = useState(0);
  const [lifeInsurance, setLifeInsurance] = useState(0);
  const [sukanyaSamriddhi, setSukanyaSamriddhi] = useState(0);
  const [homeLoanPrincipal, setHomeLoanPrincipal] = useState(0);

  const SECTION_80C_LIMIT = 150000;

  const totalInvestment = ppf + elss + nsc + lifeInsurance + sukanyaSamriddhi + homeLoanPrincipal;
  const deductibleAmount = Math.min(totalInvestment, SECTION_80C_LIMIT);
  const unusedCapacity = Math.max(0, SECTION_80C_LIMIT - totalInvestment);

  const taxSavedAt30 = deductibleAmount * 0.3;
  const taxSavedAt20 = deductibleAmount * 0.2;

  return (
    <div className="space-y-8 pb-12">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 flex justify-between items-center">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          📊 For educational purposes. Consult a CA for tax planning advice.
        </p>
        <button className="text-amber-900 dark:text-amber-100 text-sm">✕</button>
      </div>

      {/* Main Calculator */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Section 80C Investments
          </h2>

          <SliderInput
            label="PPF Investment"
            value={ppf}
            onChange={setPPF}
            min={0}
            max={150000}
            step={5000}
            prefix="₹"
          />

          <SliderInput
            label="ELSS Investment"
            value={elss}
            onChange={setELSS}
            min={0}
            max={150000}
            step={5000}
            prefix="₹"
          />

          <SliderInput
            label="NSC Investment"
            value={nsc}
            onChange={setNSC}
            min={0}
            max={150000}
            step={5000}
            prefix="₹"
          />

          <SliderInput
            label="Life Insurance Premium"
            value={lifeInsurance}
            onChange={setLifeInsurance}
            min={0}
            max={150000}
            step={5000}
            prefix="₹"
          />

          <SliderInput
            label="Sukanya Samriddhi"
            value={sukanyaSamriddhi}
            onChange={setSukanyaSamriddhi}
            min={0}
            max={150000}
            step={5000}
            prefix="₹"
          />

          <SliderInput
            label="Home Loan Principal (Principal Only)"
            value={homeLoanPrincipal}
            onChange={setHomeLoanPrincipal}
            min={0}
            max={150000}
            step={5000}
            prefix="₹"
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          <ResultCard
            title="Section 80C Limit"
            value={SECTION_80C_LIMIT}
            color="primary"
            supportingValues={[
              { label: 'Total Invested', value: totalInvestment },
              { label: 'Deductible Amount', value: deductibleAmount },
            ]}
          />

          <ResultCard
            title="Unused Capacity"
            value={unusedCapacity}
            color={unusedCapacity > 0 ? 'warning' : 'success'}
            supportingValues={[
              { label: 'Utilization', value: `${((deductibleAmount / SECTION_80C_LIMIT) * 100).toFixed(1)}%` },
              { label: 'Capacity Used', value: deductibleAmount },
            ]}
          />

          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Tax Saving Estimate</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
                <span>At 20% Tax Rate</span>
                <span className="font-semibold text-success">₹{taxSavedAt20.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>At 30% Tax Rate</span>
                <span className="font-semibold text-success">₹{taxSavedAt30.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {unusedCapacity > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                💡 You have ₹{unusedCapacity.toLocaleString('en-IN')} unused capacity. Consider investing in ELSS or PPF to save more tax.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Investment Breakdown */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-heading text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
          Your Investment Breakdown
        </h3>
        <div className="space-y-3 text-sm">
          {ppf > 0 && (
            <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <span>PPF</span>
              <span className="font-semibold">₹{ppf.toLocaleString('en-IN')}</span>
            </div>
          )}
          {elss > 0 && (
            <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <span>ELSS</span>
              <span className="font-semibold">₹{elss.toLocaleString('en-IN')}</span>
            </div>
          )}
          {nsc > 0 && (
            <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <span>NSC</span>
              <span className="font-semibold">₹{nsc.toLocaleString('en-IN')}</span>
            </div>
          )}
          {lifeInsurance > 0 && (
            <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <span>Life Insurance Premium</span>
              <span className="font-semibold">₹{lifeInsurance.toLocaleString('en-IN')}</span>
            </div>
          )}
          {sukanyaSamriddhi > 0 && (
            <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <span>Sukanya Samriddhi</span>
              <span className="font-semibold">₹{sukanyaSamriddhi.toLocaleString('en-IN')}</span>
            </div>
          )}
          {homeLoanPrincipal > 0 && (
            <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <span>Home Loan Principal</span>
              <span className="font-semibold">₹{homeLoanPrincipal.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-2">
            <span>Total</span>
            <span>₹{totalInvestment.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Eligible Investments Reference */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-heading text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
          Section 80C Eligible Investments (Max ₹1,50,000)
        </h3>
        <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
          <li>✓ PPF (Public Provident Fund)</li>
          <li>✓ ELSS (Equity-Linked Saving Scheme)</li>
          <li>✓ NSC (National Savings Certificate)</li>
          <li>✓ Life Insurance Premium</li>
          <li>✓ Sukanya Samriddhi Scheme</li>
          <li>✓ Home Loan Principal Repayment</li>
          <li>✓ Employee Provident Fund (EPF)</li>
          <li>✓ Tuition fees for children</li>
        </ul>
      </div>
    </div>
  );
}
