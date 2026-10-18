import React from 'react';
import { ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';

interface MemoryRowProps {
  memory: number;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryStore: () => void;
  themeId: ThemeId;
}

export const MemoryRow: React.FC<MemoryRowProps> = ({
  memory,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryStore,
  themeId,
}) => {
  const theme = THEMES[themeId];
  const hasMem = memory !== 0;

  const btnBase =
    'px-2 py-1.5 text-xs font-mono font-medium rounded-lg transition-all duration-150 active:scale-95 text-center flex-1';

  return (
    <div className="flex items-center gap-1.5 w-full py-1">
      <button
        onClick={onMemoryClear}
        disabled={!hasMem}
        title="Memory Clear (MC)"
        className={`${btnBase} ${
          hasMem
            ? theme.actionBtnClass
            : 'opacity-40 cursor-not-allowed bg-black/5 dark:bg-white/5 border border-transparent'
        }`}
      >
        MC
      </button>

      <button
        onClick={onMemoryRecall}
        disabled={!hasMem}
        title={`Memory Recall (MR: ${memory})`}
        className={`${btnBase} ${
          hasMem
            ? theme.actionBtnClass
            : 'opacity-40 cursor-not-allowed bg-black/5 dark:bg-white/5 border border-transparent'
        }`}
      >
        MR
      </button>

      <button
        onClick={onMemoryAdd}
        title="Memory Add (M+)"
        className={`${btnBase} ${theme.actionBtnClass}`}
      >
        M+
      </button>

      <button
        onClick={onMemorySubtract}
        title="Memory Subtract (M-)"
        className={`${btnBase} ${theme.actionBtnClass}`}
      >
        M-
      </button>

      <button
        onClick={onMemoryStore}
        title="Memory Store (MS)"
        className={`${btnBase} ${theme.actionBtnClass}`}
      >
        MS
      </button>
    </div>
  );
};
