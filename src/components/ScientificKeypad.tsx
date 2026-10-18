import React from 'react';
import { AngleUnit, ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';
import { Delete } from 'lucide-react';

interface ScientificKeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onDecimal: () => void;
  onClear: () => void;
  onClearEntry: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onEquals: () => void;
  onFunction: (fn: string) => void;
  isSecond: boolean;
  onToggleSecond: () => void;
  angleUnit: AngleUnit;
  onToggleAngleUnit: () => void;
  themeId: ThemeId;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onDigit,
  onOperator,
  onDecimal,
  onClear,
  onClearEntry,
  onBackspace,
  onToggleSign,
  onEquals,
  onFunction,
  isSecond,
  onToggleSecond,
  angleUnit,
  onToggleAngleUnit,
  themeId,
}) => {
  const theme = THEMES[themeId];

  const keyBase =
    'h-10 sm:h-12 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-100 flex items-center justify-center select-none cursor-pointer focus:outline-none';

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full pt-2">
      {/* Row 1: Mode Switches and Parentheses */}
      <button
        onClick={onToggleSecond}
        className={`${keyBase} ${
          isSecond ? 'bg-amber-500 text-black font-bold' : theme.actionBtnClass
        }`}
        title="2nd Function Shift"
      >
        2ⁿᵈ
      </button>
      <button
        onClick={onToggleAngleUnit}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
        title="Degree / Radian Toggle"
      >
        {angleUnit.toUpperCase()}
      </button>
      <button
        onClick={() => onFunction('(')}
        className={`${keyBase} ${theme.actionBtnClass}`}
        title="Open Parenthesis"
      >
        (
      </button>
      <button
        onClick={() => onFunction(')')}
        className={`${keyBase} ${theme.actionBtnClass}`}
        title="Close Parenthesis"
      >
        )
      </button>
      <button
        onClick={onBackspace}
        className={`${keyBase} ${theme.actionBtnClass}`}
        title="Backspace"
      >
        <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Row 2: Trig Functions & Clear */}
      <button
        onClick={() => onFunction(isSecond ? 'asin' : 'sin')}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
      >
        {isSecond ? 'sin⁻¹' : 'sin'}
      </button>
      <button
        onClick={() => onFunction(isSecond ? 'acos' : 'cos')}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
      >
        {isSecond ? 'cos⁻¹' : 'cos'}
      </button>
      <button
        onClick={() => onFunction(isSecond ? 'atan' : 'tan')}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
      >
        {isSecond ? 'tan⁻¹' : 'tan'}
      </button>
      <button
        onClick={onClearEntry}
        className={`${keyBase} ${theme.actionBtnClass} font-semibold`}
        title="Clear Entry"
      >
        CE
      </button>
      <button
        onClick={onClear}
        className={`${keyBase} ${theme.actionBtnClass} font-bold text-rose-400`}
        title="All Clear"
      >
        C
      </button>

      {/* Row 3: Hyperbolic & Logs */}
      <button
        onClick={() => onFunction(isSecond ? 'sinh' : 'ln')}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
      >
        {isSecond ? 'sinh' : 'ln'}
      </button>
      <button
        onClick={() => onFunction(isSecond ? 'cosh' : 'log')}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
      >
        {isSecond ? 'cosh' : 'log₁₀'}
      </button>
      <button
        onClick={() => onFunction(isSecond ? 'exp' : 'fact')}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
      >
        {isSecond ? 'eˣ' : 'n!'}
      </button>
      <button
        onClick={() => onFunction(isSecond ? '10^x' : 'sqrt')}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
      >
        {isSecond ? '10ˣ' : '√𝑥'}
      </button>
      <button
        onClick={() => onOperator('÷')}
        className={`${keyBase} ${theme.opBtnClass} text-base sm:text-lg`}
      >
        ÷
      </button>

      {/* Row 4: Powers & 7, 8, 9, Multiply */}
      <button
        onClick={() => onFunction(isSecond ? 'cbrt' : 'pow')}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
      >
        {isSecond ? '³√𝑥' : '𝑥ʸ'}
      </button>
      <button onClick={() => onDigit('7')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        7
      </button>
      <button onClick={() => onDigit('8')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        8
      </button>
      <button onClick={() => onDigit('9')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        9
      </button>
      <button
        onClick={() => onOperator('×')}
        className={`${keyBase} ${theme.opBtnClass} text-base sm:text-lg`}
      >
        ×
      </button>

      {/* Row 5: Constants & 4, 5, 6, Subtract */}
      <button
        onClick={() => onFunction('pi')}
        className={`${keyBase} ${theme.actionBtnClass} font-serif`}
        title="Pi (π ≈ 3.14159)"
      >
        π
      </button>
      <button onClick={() => onDigit('4')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        4
      </button>
      <button onClick={() => onDigit('5')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        5
      </button>
      <button onClick={() => onDigit('6')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        6
      </button>
      <button
        onClick={() => onOperator('−')}
        className={`${keyBase} ${theme.opBtnClass} text-base sm:text-lg`}
      >
        −
      </button>

      {/* Row 6: Euler / Abs & 1, 2, 3, Add */}
      <button
        onClick={() => onFunction('e')}
        className={`${keyBase} ${theme.actionBtnClass} font-serif`}
        title="Euler's Number (e ≈ 2.71828)"
      >
        e
      </button>
      <button onClick={() => onDigit('1')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        1
      </button>
      <button onClick={() => onDigit('2')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        2
      </button>
      <button onClick={() => onDigit('3')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        3
      </button>
      <button
        onClick={() => onOperator('+')}
        className={`${keyBase} ${theme.opBtnClass} text-base sm:text-lg`}
      >
        +
      </button>

      {/* Row 7: Mod / Rand & Sign, 0, Decimal, Equals */}
      <button
        onClick={() => onFunction(isSecond ? 'rand' : 'mod')}
        className={`${keyBase} ${theme.actionBtnClass} font-mono text-[11px]`}
        title={isSecond ? 'Random number between 0 and 1' : 'Modulo operator'}
      >
        {isSecond ? 'rnd' : 'mod'}
      </button>
      <button
        onClick={onToggleSign}
        className={`${keyBase} ${theme.actionBtnClass} font-mono`}
        title="Negate"
      >
        ±
      </button>
      <button onClick={() => onDigit('0')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        0
      </button>
      <button
        onClick={onDecimal}
        className={`${keyBase} ${theme.numBtnClass} font-mono-numbers text-lg`}
      >
        .
      </button>
      <button
        onClick={onEquals}
        className={`${keyBase} ${theme.equalsBtnClass} text-lg font-bold`}
        title="Calculate"
      >
        =
      </button>
    </div>
  );
};
