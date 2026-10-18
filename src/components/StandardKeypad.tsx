import React from 'react';
import { ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';
import { Delete } from 'lucide-react';

interface StandardKeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onDecimal: () => void;
  onClear: () => void;
  onClearEntry: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onEquals: () => void;
  onFunction: (fn: string) => void;
  themeId: ThemeId;
}

export const StandardKeypad: React.FC<StandardKeypadProps> = ({
  onDigit,
  onOperator,
  onDecimal,
  onClear,
  onClearEntry,
  onBackspace,
  onToggleSign,
  onEquals,
  onFunction,
  themeId,
}) => {
  const theme = THEMES[themeId];

  const keyBase =
    'h-12 sm:h-14 rounded-xl text-base sm:text-lg font-medium transition-all duration-100 flex items-center justify-center select-none cursor-pointer focus:outline-none';

  return (
    <div className="grid grid-cols-4 gap-2 w-full pt-2">
      {/* Row 1 */}
      <button
        onClick={() => onFunction('%')}
        className={`${keyBase} ${theme.actionBtnClass}`}
        title="Percent"
      >
        %
      </button>
      <button
        onClick={onClearEntry}
        className={`${keyBase} ${theme.actionBtnClass} text-sm`}
        title="Clear Entry"
      >
        CE
      </button>
      <button
        onClick={onClear}
        className={`${keyBase} ${theme.actionBtnClass} text-sm font-semibold`}
        title="All Clear"
      >
        C
      </button>
      <button
        onClick={onBackspace}
        className={`${keyBase} ${theme.actionBtnClass}`}
        title="Backspace"
      >
        <Delete className="w-5 h-5" />
      </button>

      {/* Row 2 */}
      <button
        onClick={() => onFunction('1/x')}
        className={`${keyBase} ${theme.actionBtnClass} text-sm font-mono`}
        title="Reciprocal 1/x"
      >
        ¹/𝑥
      </button>
      <button
        onClick={() => onFunction('sqr')}
        className={`${keyBase} ${theme.actionBtnClass} text-sm font-mono`}
        title="Square x²"
      >
        𝑥²
      </button>
      <button
        onClick={() => onFunction('sqrt')}
        className={`${keyBase} ${theme.actionBtnClass} text-sm font-mono`}
        title="Square Root √x"
      >
        ²√𝑥
      </button>
      <button
        onClick={() => onOperator('÷')}
        className={`${keyBase} ${theme.opBtnClass} text-xl`}
        title="Divide"
      >
        ÷
      </button>

      {/* Row 3 */}
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
        className={`${keyBase} ${theme.opBtnClass} text-xl`}
        title="Multiply"
      >
        ×
      </button>

      {/* Row 4 */}
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
        className={`${keyBase} ${theme.opBtnClass} text-xl`}
        title="Subtract"
      >
        −
      </button>

      {/* Row 5 */}
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
        className={`${keyBase} ${theme.opBtnClass} text-xl`}
        title="Add"
      >
        +
      </button>

      {/* Row 6 */}
      <button
        onClick={onToggleSign}
        className={`${keyBase} ${theme.actionBtnClass} text-sm font-mono`}
        title="Positive / Negative"
      >
        ±
      </button>
      <button onClick={() => onDigit('0')} className={`${keyBase} ${theme.numBtnClass} font-mono-numbers`}>
        0
      </button>
      <button
        onClick={onDecimal}
        className={`${keyBase} ${theme.numBtnClass} font-mono-numbers text-xl`}
        title="Decimal Point"
      >
        .
      </button>
      <button
        onClick={onEquals}
        className={`${keyBase} ${theme.equalsBtnClass} text-xl font-bold`}
        title="Calculate (Enter)"
      >
        =
      </button>
    </div>
  );
};
