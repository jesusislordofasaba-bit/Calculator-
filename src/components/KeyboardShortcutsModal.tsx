import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeId: ThemeId;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  themeId,
}) => {
  if (!isOpen) return null;
  const theme = THEMES[themeId];

  const shortcuts = [
    { key: '0 – 9', desc: 'Number input' },
    { key: '+ - * /', desc: 'Basic arithmetic (+, −, ×, ÷)' },
    { key: 'Enter or =', desc: 'Calculate evaluation' },
    { key: 'Backspace', desc: 'Delete previous character' },
    { key: 'Escape', desc: 'All clear (C)' },
    { key: '.', desc: 'Decimal point' },
    { key: '( and )', desc: 'Parentheses grouping' },
    { key: '^', desc: 'Exponentiation (xʸ)' },
    { key: '%', desc: 'Percentage calculation' },
    { key: 'p', desc: 'Pi constant (π)' },
    { key: 'e', desc: "Euler's constant (e)" },
    { key: 's / c / t', desc: 'sin / cos / tan functions' },
    { key: 'r', desc: 'Square root (√)' },
    { key: 'l / n', desc: 'log₁₀ / natural log ln' },
    { key: '!', desc: 'Factorial (n!)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl relative ${theme.calcBodyClass}`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold tracking-tight">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="p-2 rounded-lg bg-black/10 dark:bg-white/5 border border-white/5 flex items-center justify-between"
            >
              <kbd className="px-1.5 py-0.5 rounded bg-black/20 dark:bg-white/10 font-mono text-[11px] font-semibold text-amber-400 border border-white/10">
                {sc.key}
              </kbd>
              <span className="text-neutral-300 text-[11px] text-right ml-2">{sc.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${theme.actionBtnClass}`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
