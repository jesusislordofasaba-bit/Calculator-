import React, { useState } from 'react';
import { HistoryItem, ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';
import {
  Trash2,
  Copy,
  Download,
  X,
  Check,
  CornerDownLeft,
} from 'lucide-react';

interface HistoryTapeProps {
  history: HistoryItem[];
  onSelectResult: (result: string) => void;
  onSelectExpression: (expr: string) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onClose: () => void;
  themeId: ThemeId;
}

export const HistoryTape: React.FC<HistoryTapeProps> = ({
  history,
  onSelectResult,
  onSelectExpression,
  onClearHistory,
  onDeleteItem,
  onClose,
  themeId,
}) => {
  const theme = THEMES[themeId];
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tapeCopied, setTapeCopied] = useState(false);

  const handleCopyItem = (item: HistoryItem) => {
    navigator.clipboard.writeText(`${item.expression} = ${item.result}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCopyEntireTape = () => {
    if (history.length === 0) return;
    const text = history
      .map(
        (h) =>
          `[${new Date(h.timestamp).toLocaleTimeString()}] ${h.expression} = ${h.result}`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setTapeCopied(true);
    setTimeout(() => setTapeCopied(false), 1600);
  };

  const handleDownloadCsv = () => {
    if (history.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Mode,Expression,Result']
        .concat(
          history.map(
            (h) =>
              `"${new Date(h.timestamp).toISOString()}","${h.mode}","${h.expression.replace(/"/g, '""')}","${h.result}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omni_calc_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`h-full flex flex-col rounded-2xl border ${theme.calcBodyClass} overflow-hidden shadow-2xl transition-all duration-200`}
    >
      {/* Tape Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-inherit bg-black/5 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Calculation Tape
          </span>
          {history.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-black/20 dark:bg-white/10">
              {history.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <>
              <button
                onClick={handleCopyEntireTape}
                title="Copy entire tape"
                className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                {tapeCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={handleDownloadCsv}
                title="Download CSV"
                className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClearHistory}
                title="Clear all tape"
                className="p-1.5 rounded-md hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-white transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tape Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 text-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-500">
              =
            </div>
            <p className="font-medium text-neutral-300">No calculations yet</p>
            <p className="text-[11px] text-neutral-500 max-w-[200px]">
              Perform calculations to see them recorded here on your paper tape.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border border-white/5 bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10 transition-colors group relative`}
            >
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                <span className="font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
                <span className="uppercase text-[9px] font-mono opacity-70">
                  {item.mode}
                </span>
              </div>

              {/* Expression */}
              <div
                onClick={() => onSelectExpression(item.expression)}
                className="font-mono text-xs text-neutral-400 hover:text-amber-400 cursor-pointer truncate"
                title="Click to insert expression"
              >
                {item.expression}
              </div>

              {/* Result */}
              <div className="flex items-center justify-between mt-1">
                <div
                  onClick={() => onSelectResult(item.result)}
                  className={`font-mono-numbers text-base font-bold cursor-pointer hover:underline truncate ${theme.displayTextClass}`}
                  title="Click to use result"
                >
                  = {item.result}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onSelectResult(item.result)}
                    title="Insert result into calculator"
                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-amber-400"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopyItem(item)}
                    title="Copy calculation"
                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    title="Delete item"
                    className="p-1 rounded hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
