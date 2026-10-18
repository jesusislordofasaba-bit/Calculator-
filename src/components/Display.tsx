import React, { useState } from 'react';
import { AngleUnit, ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';
import { Copy, Check } from 'lucide-react';

interface DisplayProps {
  expression: string;
  currentValue: string;
  angleUnit: AngleUnit;
  onToggleAngleUnit?: () => void;
  showAngleUnit?: boolean;
  hasMemory: boolean;
  isSecondActive?: boolean;
  themeId: ThemeId;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  currentValue,
  angleUnit,
  onToggleAngleUnit,
  showAngleUnit = false,
  hasMemory,
  isSecondActive = false,
  themeId,
}) => {
  const theme = THEMES[themeId];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = currentValue || expression;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Determine adaptive font size based on length
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len <= 9) return 'text-3xl sm:text-4xl md:text-5xl';
    if (len <= 14) return 'text-2xl sm:text-3xl md:text-4xl';
    if (len <= 20) return 'text-xl sm:text-2xl md:text-3xl';
    return 'text-lg sm:text-xl md:text-2xl';
  };

  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 border transition-all duration-200 relative group overflow-hidden ${
        theme.displayBgClass
      } ${theme.displayBorderClass}`}
    >
      {/* Top Indicators Bar */}
      <div className="flex items-center justify-between min-h-[22px] mb-1.5 text-xs select-none">
        <div className="flex items-center gap-2">
          {showAngleUnit && (
            <button
              onClick={onToggleAngleUnit}
              title="Click to toggle Degree / Radian"
              className={`px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider transition-colors ${
                theme.isLcd
                  ? 'bg-black/10 text-black/80 hover:bg-black/20'
                  : 'bg-white/10 hover:bg-white/20 text-inherit/90'
              }`}
            >
              {angleUnit}
            </button>
          )}

          {isSecondActive && (
            <span
              className={`px-1.5 py-0.5 rounded font-mono font-semibold text-[10px] ${
                theme.isLcd ? 'bg-black/20 text-black' : 'bg-amber-500/30 text-amber-300'
              }`}
            >
              2ND
            </span>
          )}

          {hasMemory && (
            <span
              className={`px-1.5 py-0.5 rounded font-mono font-semibold text-[10px] ${
                theme.isLcd ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              M
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className={`opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded-md text-xs flex items-center gap-1 ${
            theme.isLcd ? 'hover:bg-black/10 text-black/70' : 'hover:bg-white/10 text-inherit/70'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-mono">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Secondary Expression Line */}
      <div
        className={`w-full overflow-x-auto whitespace-nowrap text-right font-mono text-xs sm:text-sm font-medium tracking-wide mb-1 min-h-[1.25rem] select-all ${
          theme.displaySubTextClass
        }`}
      >
        {expression || <span className="opacity-0">0</span>}
      </div>

      {/* Primary Display Number */}
      <div
        className={`w-full overflow-x-auto whitespace-nowrap text-right font-mono-numbers font-bold tracking-tight select-all leading-tight ${
          theme.isLcd ? 'font-lcd tracking-widest' : ''
        } ${theme.displayTextClass} ${getFontSize(currentValue)}`}
      >
        {currentValue || '0'}
      </div>
    </div>
  );
};
