// NEW REGIME INCOME TAX CALCULATOR - 2025-26

export interface IncomeTaxInputs {
  salary: number;
  otherIncome: number;
  interestIncome: number;
  rentalIncome: number;
  capitalGains: number;
  businessIncome: number;
  employerNPS: number;
  age: number; // 0 = <60, 1 = 60-80, 2 = >80
  residentStatus: number; // 0 = resident, 1 = non-resident
}

const TAX_SLABS_NEW_REGIME = [
  { limit: 300000, rate: 0 },
  { limit: 600000, rate: 0.05 },
  { limit: 900000, rate: 0.1 },
  { limit: 1200000, rate: 0.15 },
  { limit: 1500000, rate: 0.2 },
  { limit: 1800000, rate: 0.25 },
  { limit: Infinity, rate: 0.3 },
];

const STANDARD_DEDUCTION = 75000;
const CESS_RATE = 0.04;

export function calculateNewRegimeTax(inputs: IncomeTaxInputs) {
  const {
    salary,
    otherIncome,
    interestIncome,
    rentalIncome,
    capitalGains,
    businessIncome,
    employerNPS,
    age,
  } = inputs;

  // Calculate gross income
  const grossIncome =
    salary +
    otherIncome +
    interestIncome +
    rentalIncome +
    capitalGains +
    businessIncome;

  // Taxable income = Gross - Standard Deduction
  let taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION);

  // Calculate tax based on slabs
  let tax = 0;
  let prevLimit = 0;

  for (const slab of TAX_SLABS_NEW_REGIME) {
    const slabIncome = Math.min(taxableIncome, slab.limit) - prevLimit;
    if (slabIncome > 0) {
      tax += slabIncome * slab.rate;
    }
    if (taxableIncome <= slab.limit) break;
    prevLimit = slab.limit;
  }

  // Check for Rebate u/s 87A (applicable if taxable income < 700,000)
  let rebate = 0;
  if (taxableIncome <= 700000) {
    rebate = Math.min(tax, 12500);
  } else if (taxableIncome <= 1000000) {
    rebate = Math.min(tax, 16875);
  }

  tax = Math.max(0, tax - rebate);

  // Add cess on tax
  const cess = tax * CESS_RATE;
  const totalTax = tax + cess;

  const takeHome = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    standardDeduction: STANDARD_DEDUCTION,
    taxableIncome,
    incomeTax: tax,
    cess,
    totalTax,
    takeHome,
    effectiveRate,
    rebateApplied: rebate > 0,
  };
}

// OLD REGIME INCOME TAX CALCULATOR

export interface OldRegimeTaxInputs {
  salary: number;
  otherIncome: number;
  rentPaid: number;
  homeLoans: {
    principalPaid: number;
    interestPaid: number;
  };
  insurance: number;
  ppf: number;
  elss: number;
  nsc: number;
  lifeInsurance: number;
  sukanyaSamriddhi: number;
  hraReceived: number;
  ltaReceived: number;
  section80D: number; // Health insurance
  section80G: number; // Charitable donations
  section80E: number; // Education loan interest
  section24B: number; // Home loan interest (additional)
  age: number;
  cityCategory: number; // 0 = metro, 1 = non-metro
  residentStatus: number;
}

const TAX_SLABS_OLD_REGIME = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 0.05 },
  { limit: 1000000, rate: 0.2 },
  { limit: Infinity, rate: 0.3 },
];

export function calculateOldRegimeTax(inputs: OldRegimeTaxInputs) {
  const {
    salary,
    otherIncome,
    rentPaid,
    homeLoans,
    insurance,
    ppf,
    elss,
    nsc,
    lifeInsurance,
    sukanyaSamriddhi,
    hraReceived,
    ltaReceived,
    section80D,
    section80G,
    section80E,
    section24B,
    cityCategory,
  } = inputs;

  // Calculate HRA exemption
  const metroLimit = hraReceived;
  const rentLimit = Math.max(0, rentPaid - salary * 0.1);
  const percentageLimit = salary * 0.5;
  const hraExemption = Math.min(metroLimit, rentLimit, percentageLimit);

  // Calculate 80C deductions (max 150,000)
  const section80C = Math.min(
    150000,
    ppf + elss + nsc + lifeInsurance + sukanyaSamriddhi + homeLoans.principalPaid
  );

  // Calculate gross income
  const grossIncome = salary + otherIncome;

  // Calculate deductions
  const totalDeductions =
    hraExemption +
    ltaReceived +
    section80C +
    section80D +
    section80G +
    section80E +
    homeLoans.interestPaid +
    section24B;

  // Taxable income
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // Calculate tax
  let tax = 0;
  let prevLimit = 0;

  for (const slab of TAX_SLABS_OLD_REGIME) {
    const slabIncome = Math.min(taxableIncome, slab.limit) - prevLimit;
    if (slabIncome > 0) {
      tax += slabIncome * slab.rate;
    }
    if (taxableIncome <= slab.limit) break;
    prevLimit = slab.limit;
  }

  const rebate = taxableIncome <= 500000 ? Math.min(tax, 12500) : 0;
  tax = Math.max(0, tax - rebate);
  const cess = tax * CESS_RATE;
  const totalTax = tax + cess;
  const takeHome = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  const unused80C = Math.max(0, 150000 - section80C);

  return {
    grossIncome,
    hraExemption,
    section80C,
    totalDeductions,
    taxableIncome,
    incomeTax: tax,
    cess,
    totalTax,
    takeHome,
    effectiveRate,
    unused80C,
    deductionDetails: {
      hra: hraExemption,
      lta: ltaReceived,
      section80C,
      section80D,
      section80G,
      section80E,
      homeInterest: homeLoans.interestPaid,
      section24B,
    },
  };
}

// TDS CALCULATOR

export interface TDSInputs {
  paymentType: string; // '192' | '194A' | '194C' | etc
  amount: number;
  panAvailable: boolean;
  residentStatus: number; // 0 = resident, 1 = non-resident
  previousDeduction: number;
}

const TDS_RATES: Record<string, number> = {
  '192': 0.1, // Salary
  '194A': 0.1, // Interest on deposits
  '194C': 0.01, // Contractors
  '194H': 0.05, // Commission/brokerage
  '194J': 0.1, // Professional fees
  '194IA': 0.05, // Property transaction
  '194IB': 0.05, // Property transaction (seller)
  '194S': 0.01, // Crypto (VDA)
};

const TDS_RATE_NO_PAN = 0.2; // 20% if PAN not available

export function calculateTDS(inputs: TDSInputs) {
  const { paymentType, amount, panAvailable, previousDeduction } = inputs;

  const baseRate = TDS_RATES[paymentType] || 0.1;
  const applicableRate = panAvailable ? baseRate : TDS_RATE_NO_PAN;

  const tdsAmount = amount * applicableRate;
  const netAmount = amount - tdsAmount;

  return {
    amount,
    applicableRate: applicableRate * 100,
    tdsAmount,
    netAmount,
    panRequired: !panAvailable,
    section206AB: !panAvailable,
  };
}

// F&O TURNOVER CALCULATOR

export interface FAndOInputs {
  intradayTrades: number;
  futuresTurnover: number;
  optionsPremium: number;
  optionsProfit: number;
  brokerage: number;
  stt: number;
  otherCharges: number;
}

export function calculateFAndOTurnover(inputs: FAndOInputs) {
  const { intradayTrades, futuresTurnover, optionsPremium, optionsProfit, brokerage, stt, otherCharges } = inputs;

  // Futures turnover = Sum of absolute P&L
  const futuresTurnoverAmount = futuresTurnover;

  // Options turnover = Absolute profit/loss + premium received
  const optionsTurnoverAmount = Math.abs(optionsProfit) + optionsPremium;

  // Total turnover
  const totalTurnover = futuresTurnoverAmount + optionsTurnoverAmount;

  // Net P&L
  const grossPL = optionsProfit + futuresTurnover;
  const netPL = grossPL - stt - brokerage - otherCharges;

  // Tax audit applicability (if turnover > 1 crore)
  const auditApplicable = totalTurnover > 10000000;

  return {
    totalTurnover,
    futuresTurnover: futuresTurnoverAmount,
    optionsTurnover: optionsTurnoverAmount,
    grossPL,
    netPL,
    charges: stt + brokerage + otherCharges,
    auditApplicable,
    auditThreshold: 10000000,
  };
}

// CRYPTO TAX CALCULATOR

export interface CryptoTaxInputs {
  gains: number;
  losses: number;
  transactions: number;
}

const CRYPTO_TAX_RATE = 0.3; // 30% flat
const CRYPTO_TDS_RATE = 0.01; // 1% on transactions

export function calculateCryptoTax(inputs: CryptoTaxInputs) {
  const { gains, losses, transactions } = inputs;

  // No set-off allowed for crypto losses
  const taxableGains = Math.max(0, gains);

  // Tax on gains
  const incomeTax = taxableGains * CRYPTO_TAX_RATE;

  // TDS on transactions (1%)
  const tdsDeducted = transactions * CRYPTO_TDS_RATE;

  // Total tax liability
  const totalTaxLiability = incomeTax;

  return {
    gains,
    losses,
    taxableGains,
    incomeTax,
    tdsDeducted,
    totalTaxLiability,
    effectiveRate: gains > 0 ? (incomeTax / gains) * 100 : 0,
    lossesNotDeductible: losses,
  };
}

// CAPITAL GAINS TAX CALCULATOR

export interface CapitalGainInputs {
  buyDate: Date;
  sellDate: Date;
  costPrice: number;
  sellPrice: number;
  improvementCost: number;
  brokerage: number;
  assetType: string; // 'equity' | 'debt' | 'real_estate' | 'crypto'
}

export function calculateCapitalGainsTax(inputs: CapitalGainInputs) {
  const { buyDate, sellDate, costPrice, sellPrice, improvementCost, brokerage, assetType } = inputs;

  // Determine if STCG or LTCG
  const holdingPeriod = (sellDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24);
  const isLongTerm = holdingPeriod > 365; // Simplified, actual rules vary

  // Calculate indexed cost for real estate
  let indexedCost = costPrice + improvementCost;
  if (isLongTerm && assetType === 'real_estate') {
    // Simplified indexation
    const ciiRatio = 1.2; // Simplified
    indexedCost = (costPrice + improvementCost) * ciiRatio;
  }

  // Calculate gain
  const totalExpenses = indexedCost + brokerage;
  const gain = Math.max(0, sellPrice - totalExpenses);

  // Tax rates
  let taxRate = 0;
  if (assetType === 'equity') {
    taxRate = isLongTerm ? 0.1 : 0.15; // Simplified
  } else if (assetType === 'debt') {
    taxRate = isLongTerm ? 0.2 : 0.3;
  } else if (assetType === 'real_estate') {
    taxRate = isLongTerm ? 0.2 : 0.3;
  }

  const tax = gain * taxRate;

  return {
    holdingPeriod,
    isLongTerm,
    costPrice,
    indexedCost,
    sellPrice,
    totalExpenses,
    gain,
    taxRate: taxRate * 100,
    tax,
    netProceeds: sellPrice - tax,
  };
}
