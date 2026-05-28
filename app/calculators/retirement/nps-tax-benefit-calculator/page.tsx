'use client';

import { useState, useMemo } from 'react';
import { SliderInput } from '@/components/slider-input';
import { ResultCard } from '@/components/result-card';

export default function NPSTaxBenefitCalculator() {
  const [employeeContribution, setEmployeeContribution] = useState(50000);
  const [employerContribution, setEmployerContribution] = useState(50000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(20);
  const [age, setAge] = useState(0); // 0 = <60, 1 = 60-80, 2 = >80

  const totalAnnualContribution = employeeContribution + employerContribution;
  const extraDeductionSection80CCD1B = Math.min(50000, employeeContribution); // Extra ₹50k benefit
  const totalDeductibleAmount = employeeContribution + extraDeductionSection80CCD1B;

  // Simple compound growth calculation
  const corpusValue = useMemo(() => {
    let value = 0;
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;

    for (let i = 1; i <= months; i++) {
      value = (value + totalAnnualContribution / 12) * (1 + monthlyRate);
    }
    return value;
  }, [totalAnnualContribution, annualReturn, years]);

  const taxSavedAt20 = totalDeductibleAmount * 0.2;
  const taxSavedAt30 = totalDeductibleAmount * 0.3;

  return (
    <div className="space-y-8 pb-12">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 flex justify-between items-center">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          📊 NPS projections are estimates. Actual returns depend on market performance. Consult an NPS advisor.
        </p>
        <button className="text-amber-900 dark:text-amber-100 text-sm">✕</button>
      </div>

      {/* Main Calculator */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            NPS Tax Benefits
          </h2>

          <SliderInput
            label="Annual Employee Contribution"
            value={employeeContribution}
            onChange={setEmployeeContribution}
            min={0}
            max={150000}
            step={5000}
            prefix="₹"
          />

          <SliderInput
            label="Employer Contribution (Optional)"
            value={employerContribution}
            onChange={setEmployerContribution}
            min={0}
            max={150000}
            step={5000}
            prefix="₹"
          />

          <SliderInput
            label="Expected Annual Return"
            value={annualReturn}
            onChange={setAnnualReturn}
            min={1}
            max={20}
            step={0.5}
            suffix="%"
          />

          <SliderInput
            label="Years of Investment"
            value={years}
            onChange={setYears}
            min={1}
            max={40}
            step={1}
            suffix="yrs"
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          <ResultCard
            title="Projected Corpus"
            value={corpusValue}
            color="success"
            supportingValues={[
              { label: 'Total Contribution', value: totalAnnualContribution * years },
              { label: 'Growth', value: corpusValue - totalAnnualContribution * years },
            ]}
          />

          <ResultCard
            title="Total Tax Deductible"
            value={totalDeductibleAmount}
            color="primary"
            supportingValues={[
              { label: 'Section 80CCD(1)', value: employeeContribution },
              { label: 'Section 80CCD(1B)', value: extraDeductionSection80CCD1B },
            ]}
          />

          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Annual Tax Saving</h3>
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

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
            <p className="text-sm text-green-900 dark:text-green-100 font-medium">
              ✓ NPS is one of the best long-term retirement planning tools with significant tax benefits.
            </p>
          </div>
        </div>
      </div>

      {/* Key Facts */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-heading text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
          NPS Tax Benefits Overview
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-3">
            <span className="text-primary-600 dark:text-primary-400 text-lg">●</span>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-50">Section 80CCD(1)</p>
              <p className="text-neutral-600 dark:text-neutral-400">Deduction up to ₹1.5 lakh on employee contribution</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-primary-600 dark:text-primary-400 text-lg">●</span>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-50">Section 80CCD(1B)</p>
              <p className="text-neutral-600 dark:text-neutral-400">EXTRA ₹50,000 deduction on employee contribution</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-primary-600 dark:text-primary-400 text-lg">●</span>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-50">Long-term Growth</p>
              <p className="text-neutral-600 dark:text-neutral-400">Power of compounding over 20-30+ years</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-primary-600 dark:text-primary-400 text-lg">●</span>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-50">Flexible Withdrawal</p>
              <p className="text-neutral-600 dark:text-neutral-400">Partial withdrawal allowed after 7 years</p>
            </div>
          </div>
        </div>
      </div>

      {/* NPS Allocation Strategies */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-heading text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
          Suggested NPS Fund Allocation by Age
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700">
            <span>Age 25-35 (Aggressive)</span>
            <span className="font-semibold">80% Equity / 20% Debt</span>
          </div>
          <div className="flex justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700">
            <span>Age 35-50 (Balanced)</span>
            <span className="font-semibold">60% Equity / 40% Debt</span>
          </div>
          <div className="flex justify-between">
            <span>Age 50+ (Conservative)</span>
            <span className="font-semibold">40% Equity / 60% Debt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
