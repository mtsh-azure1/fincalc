'use client';

import { useState, useMemo } from 'react';
import { SliderInput } from '@/components/slider-input';
import { ResultCard } from '@/components/result-card';
import { CalculatorChart } from '@/components/calculator-chart';
import { calculateNewRegimeTax } from '@/lib/calculator-formulas';

export default function NewRegimeIncomeTaxCalculator() {
  const [salary, setSalary] = useState(1000000);
  const [otherIncome, setOtherIncome] = useState(0);
  const [interestIncome, setInterestIncome] = useState(0);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [capitalGains, setCapitalGains] = useState(0);
  const [businessIncome, setBusinessIncome] = useState(0);
  const [employerNPS, setEmployerNPS] = useState(0);
  const [age, setAge] = useState(0);

  const result = useMemo(() => {
    return calculateNewRegimeTax({
      salary,
      otherIncome,
      interestIncome,
      rentalIncome,
      capitalGains,
      businessIncome,
      employerNPS,
      age,
      residentStatus: 0,
    });
  }, [salary, otherIncome, interestIncome, rentalIncome, capitalGains, businessIncome, employerNPS, age]);

  const chartData = [
    { name: 'Tax Paid', value: result.totalTax, color: '#EF4444' },
    { name: 'Take Home', value: result.takeHome, color: '#22C55E' },
  ];

  const comparisonData = [
    {
      name: 'Annual',
      'Income Tax': result.incomeTax,
      'Cess (4%)': result.cess,
    },
    {
      name: 'Monthly',
      'Income Tax': result.incomeTax / 12,
      'Cess (4%)': result.cess / 12,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 flex justify-between items-center">
        <p className="text-sm text-amber-900 dark:text-amber-100">
          📊 For educational purposes only. Not financial advice. Consult a SEBI-registered advisor.
        </p>
        <button className="text-amber-900 dark:text-amber-100 text-sm">✕</button>
      </div>

      {/* Main Calculator */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Income Details
          </h2>

          <SliderInput
            label="Annual Salary"
            value={salary}
            onChange={setSalary}
            min={100000}
            max={10000000}
            step={50000}
            prefix="₹"
          />

          <SliderInput
            label="Other Income"
            value={otherIncome}
            onChange={setOtherIncome}
            min={0}
            max={5000000}
            step={50000}
            prefix="₹"
          />

          <SliderInput
            label="Interest Income"
            value={interestIncome}
            onChange={setInterestIncome}
            min={0}
            max={1000000}
            step={10000}
            prefix="₹"
          />

          <SliderInput
            label="Rental Income"
            value={rentalIncome}
            onChange={setRentalIncome}
            min={0}
            max={2000000}
            step={50000}
            prefix="₹"
          />

          <SliderInput
            label="Capital Gains"
            value={capitalGains}
            onChange={setCapitalGains}
            min={0}
            max={2000000}
            step={50000}
            prefix="₹"
          />

          <SliderInput
            label="Business Income"
            value={businessIncome}
            onChange={setBusinessIncome}
            min={0}
            max={5000000}
            step={50000}
            prefix="₹"
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          <ResultCard
            title="Total Income"
            value={result.grossIncome}
            color="primary"
            supportingValues={[
              { label: 'Taxable Income', value: result.taxableIncome },
              { label: 'Effective Rate', value: `${result.effectiveRate.toFixed(2)}%` },
            ]}
          />

          <ResultCard
            title="Total Tax Liability"
            value={result.totalTax}
            color="error"
            supportingValues={[
              { label: 'Income Tax', value: result.incomeTax },
              { label: 'Cess @ 4%', value: result.cess },
            ]}
          />

          <ResultCard
            title="Take Home"
            value={result.takeHome}
            color="success"
            supportingValues={[
              { label: 'Monthly', value: result.takeHome / 12 },
              { label: 'Tax Saved', value: '₹0' },
            ]}
          />

          {result.rebateApplied && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
              <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                ✓ You qualify for Rebate under Section 87A
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <CalculatorChart type="bar" data={comparisonData} title="Annual vs Monthly Tax" height={300} />
        <CalculatorChart
          type="pie"
          data={[
            { name: 'Take Home', value: result.takeHome },
            { name: 'Tax Paid', value: result.totalTax },
          ]}
          title="Income Distribution"
          height={300}
        />
      </div>

      {/* How to Use */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-heading text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
          How to Use This Calculator
        </h3>
        <ol className="space-y-3 text-neutral-700 dark:text-neutral-300 list-decimal list-inside">
          <li>Enter your annual salary from your employer</li>
          <li>Add any other sources of income (interest, rental, capital gains, etc.)</li>
          <li>The calculator automatically applies the standard deduction of ₹75,000</li>
          <li>See your total tax liability, including cess</li>
          <li>View your take-home income and effective tax rate</li>
        </ol>
      </div>

      {/* Formula Used */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-heading text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
          Formula Used
        </h3>
        <div className="space-y-4 font-mono text-sm text-neutral-700 dark:text-neutral-300">
          <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded">
            Taxable Income = Gross Income - Standard Deduction (₹75,000)
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded">
            Income Tax = Applied on taxable income based on slab rates
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded">
            Health & Education Cess = Income Tax × 4%
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded">
            Total Tax = Income Tax + Cess
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded">
            Effective Tax Rate = (Total Tax / Gross Income) × 100
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-heading text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              What is the Standard Deduction in New Regime?
            </h4>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
              The standard deduction in the new regime (FY 2025-26) is ₹75,000. This is deducted from your gross income to arrive at taxable income.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              Who gets Rebate under Section 87A?
            </h4>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
              Individuals with taxable income up to ₹7,00,000 are eligible for rebate. The rebate amount is ₹12,500, subject to the tax liability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
