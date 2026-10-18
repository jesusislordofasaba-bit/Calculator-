import React, { useState } from 'react';
import { ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';
import { Landmark, Receipt, Percent, Users, DollarSign } from 'lucide-react';

interface FinancialViewProps {
  themeId: ThemeId;
  onPlaySound: (type?: any) => void;
  onAddToHistory?: (expr: string, result: string) => void;
}

type FinancialTab = 'loan' | 'tip' | 'percentage';

export const FinancialView: React.FC<FinancialViewProps> = ({
  themeId,
  onPlaySound,
  onAddToHistory,
}) => {
  const theme = THEMES[themeId];
  const [activeTab, setActiveTab] = useState<FinancialTab>('loan');

  // Loan state
  const [principal, setPrincipal] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [termYears, setTermYears] = useState<number>(30);

  // Tip state
  const [billAmount, setBillAmount] = useState<number>(85);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<number>(2);

  // Percentage states
  // Tool 1: What is X% of Y?
  const [p1X, setP1X] = useState<number>(15);
  const [p1Y, setP1Y] = useState<number>(240);
  // Tool 2: X is what % of Y?
  const [p2X, setP2X] = useState<number>(45);
  const [p2Y, setP2Y] = useState<number>(180);
  // Tool 3: % Change from X to Y
  const [p3X, setP3X] = useState<number>(120);
  const [p3Y, setP3Y] = useState<number>(150);

  // Loan Calculations
  const monthlyRate = interestRate > 0 ? interestRate / 100 / 12 : 0;
  const totalMonths = termYears * 12;
  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = totalMonths > 0 ? principal / totalMonths : 0;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }
  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const principalPercent = totalPayment > 0 ? (principal / totalPayment) * 100 : 100;
  const interestPercent = 100 - principalPercent;

  // Tip Calculations
  const tipAmount = (billAmount * tipPercent) / 100;
  const totalWithTip = billAmount + tipAmount;
  const perPerson = peopleCount > 0 ? totalWithTip / peopleCount : totalWithTip;
  const tipPerPerson = peopleCount > 0 ? tipAmount / peopleCount : tipAmount;

  // Percentage Calculations
  const p1Result = (p1X / 100) * p1Y;
  const p2Result = p2Y !== 0 ? (p2X / p2Y) * 100 : 0;
  const p3Diff = p3Y - p3X;
  const p3Result = p3X !== 0 ? (p3Diff / p3X) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-black/10 dark:bg-white/5 rounded-xl border border-white/5">
        <button
          onClick={() => {
            setActiveTab('loan');
            onPlaySound('toggle');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'loan' ? theme.navActive : theme.navInactive
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Loan & Mortgage</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tip');
            onPlaySound('toggle');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'tip' ? theme.navActive : theme.navInactive
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Tip & Split Bill</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('percentage');
            onPlaySound('toggle');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'percentage' ? theme.navActive : theme.navInactive
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Percentages</span>
        </button>
      </div>

      {/* Tab 1: Loan & Mortgage */}
      {activeTab === 'loan' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass}`}>
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                Loan Amount ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                className={`w-full bg-transparent text-xl font-mono-numbers font-bold outline-none ${theme.displayTextClass}`}
              />
            </div>

            <div className={`p-3 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass}`}>
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className={`w-full bg-transparent text-xl font-mono-numbers font-bold outline-none ${theme.displayTextClass}`}
              />
            </div>

            <div className={`p-3 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass}`}>
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                Term (Years)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value) || 1)}
                className={`w-full bg-transparent text-xl font-mono-numbers font-bold outline-none ${theme.displayTextClass}`}
              />
            </div>
          </div>

          {/* Loan Summary Card */}
          <div className={`p-4 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <span className="text-xs text-neutral-400">Monthly Payment</span>
                <div className={`text-3xl sm:text-4xl font-bold font-mono-numbers ${theme.displayTextClass}`}>
                  ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400">Total Interest</span>
                <div className="text-lg font-semibold font-mono-numbers text-amber-400">
                  +${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Principal: {principalPercent.toFixed(1)}%</span>
                <span>Interest: {interestPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${principalPercent}%` }}
                  title={`Principal: $${principal.toLocaleString()}`}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${interestPercent}%` }}
                  title={`Interest: $${totalInterest.toLocaleString()}`}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-neutral-400 pt-1">
                <span>Total Cost: ${totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span>{termYears * 12} Payments</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tip & Split Bill */}
      {activeTab === 'tip' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Bill Amount */}
            <div className={`p-3.5 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass}`}>
              <label className="text-xs text-neutral-400 flex items-center gap-1 mb-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Bill Amount</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={billAmount}
                onChange={(e) => setBillAmount(Number(e.target.value) || 0)}
                className={`w-full bg-transparent text-3xl font-mono-numbers font-bold outline-none ${theme.displayTextClass}`}
              />
            </div>

            {/* Number of People */}
            <div className={`p-3.5 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass}`}>
              <label className="text-xs text-neutral-400 flex items-center gap-1 mb-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Split Between ({peopleCount} {peopleCount === 1 ? 'person' : 'people'})</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="font-mono text-xl font-bold w-8 text-center">{peopleCount}</span>
              </div>
            </div>
          </div>

          {/* Tip Presets */}
          <div className="flex items-center gap-2">
            {[10, 15, 18, 20, 25].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setTipPercent(preset);
                  onPlaySound('toggle');
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  tipPercent === preset
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10 text-neutral-300'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>

          {/* Tip Summary Result */}
          <div className={`p-4 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass} grid grid-cols-2 sm:grid-cols-4 gap-3 text-center`}>
            <div>
              <div className="text-[11px] text-neutral-400">Tip Amount</div>
              <div className="text-xl font-bold font-mono-numbers text-amber-400 mt-0.5">
                ${tipAmount.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-400">Total with Tip</div>
              <div className={`text-xl font-bold font-mono-numbers ${theme.displayTextClass} mt-0.5`}>
                ${totalWithTip.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-400">Per Person Tip</div>
              <div className="text-xl font-bold font-mono-numbers text-neutral-300 mt-0.5">
                ${tipPerPerson.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-emerald-400 font-semibold">Total / Person</div>
              <div className="text-2xl font-extrabold font-mono-numbers text-emerald-400 mt-0.5">
                ${perPerson.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Percentages */}
      {activeTab === 'percentage' && (
        <div className="flex flex-col gap-3">
          {/* Tool 1 */}
          <div className={`p-3.5 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass} flex flex-col sm:flex-row items-center justify-between gap-3`}>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span>What is</span>
              <input
                type="number"
                value={p1X}
                onChange={(e) => setP1X(Number(e.target.value) || 0)}
                className="w-16 px-2 py-1 rounded bg-black/20 dark:bg-white/10 text-center font-mono font-bold"
              />
              <span>% of</span>
              <input
                type="number"
                value={p1Y}
                onChange={(e) => setP1Y(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1 rounded bg-black/20 dark:bg-white/10 text-center font-mono font-bold"
              />
              <span>?</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block sm:hidden">Result:</span>
              <span className="text-xl font-mono-numbers font-bold text-amber-400">
                {parseFloat(p1Result.toFixed(4))}
              </span>
            </div>
          </div>

          {/* Tool 2 */}
          <div className={`p-3.5 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass} flex flex-col sm:flex-row items-center justify-between gap-3`}>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <input
                type="number"
                value={p2X}
                onChange={(e) => setP2X(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1 rounded bg-black/20 dark:bg-white/10 text-center font-mono font-bold"
              />
              <span>is what % of</span>
              <input
                type="number"
                value={p2Y}
                onChange={(e) => setP2Y(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1 rounded bg-black/20 dark:bg-white/10 text-center font-mono font-bold"
              />
              <span>?</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block sm:hidden">Result:</span>
              <span className="text-xl font-mono-numbers font-bold text-cyan-400">
                {parseFloat(p2Result.toFixed(2))}%
              </span>
            </div>
          </div>

          {/* Tool 3 */}
          <div className={`p-3.5 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass} flex flex-col sm:flex-row items-center justify-between gap-3`}>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span>Change from</span>
              <input
                type="number"
                value={p3X}
                onChange={(e) => setP3X(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1 rounded bg-black/20 dark:bg-white/10 text-center font-mono font-bold"
              />
              <span>to</span>
              <input
                type="number"
                value={p3Y}
                onChange={(e) => setP3Y(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1 rounded bg-black/20 dark:bg-white/10 text-center font-mono font-bold"
              />
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block sm:hidden">Result:</span>
              <span
                className={`text-xl font-mono-numbers font-bold ${
                  p3Result >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {p3Result >= 0 ? `+${parseFloat(p3Result.toFixed(2))}%` : `${parseFloat(p3Result.toFixed(2))}%`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
