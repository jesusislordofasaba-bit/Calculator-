import React, { useState } from 'react';
import { NumberBase, WordSize, ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';
import {
  clampToWordSize,
  formatBinary,
  formatHex,
  formatOctal,
  getBit,
  parseFromBase,
  toSigned,
  toggleBit,
} from '../utils/programmerMath';
import { Delete, RotateCcw } from 'lucide-react';

interface ProgrammerViewProps {
  themeId: ThemeId;
  onPlaySound: (type?: any) => void;
  onAddToHistory?: (expr: string, result: string) => void;
}

export const ProgrammerView: React.FC<ProgrammerViewProps> = ({
  themeId,
  onPlaySound,
  onAddToHistory,
}) => {
  const theme = THEMES[themeId];

  const [currentVal, setCurrentVal] = useState<bigint>(0n);
  const [activeBase, setActiveBase] = useState<NumberBase>('DEC');
  const [wordSize, setWordSize] = useState<WordSize>(64);
  const [inputBuffer, setInputBuffer] = useState<string>('0');
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [previousVal, setPreviousVal] = useState<bigint | null>(null);

  // Update base values
  const hexStr = formatHex(currentVal, wordSize);
  const decSigned = toSigned(currentVal, wordSize).toString();
  const octStr = formatOctal(currentVal, wordSize);
  const binStr = formatBinary(currentVal, wordSize);

  // Handle switching active base
  const handleSelectBase = (base: NumberBase) => {
    setActiveBase(base);
    onPlaySound('toggle');
    switch (base) {
      case 'HEX':
        setInputBuffer(hexStr);
        break;
      case 'DEC':
        setInputBuffer(decSigned);
        break;
      case 'OCT':
        setInputBuffer(octStr);
        break;
      case 'BIN':
        setInputBuffer(clampToWordSize(currentVal, wordSize).toString(2));
        break;
    }
  };

  // Word size change
  const handleSelectWordSize = (size: WordSize) => {
    setWordSize(size);
    const clamped = clampToWordSize(currentVal, size);
    setCurrentVal(clamped);
    onPlaySound('toggle');
  };

  // Direct bit click
  const handleToggleBit = (bitIndex: number) => {
    if (bitIndex >= wordSize) return;
    const nextVal = toggleBit(currentVal, bitIndex, wordSize);
    setCurrentVal(nextVal);
    onPlaySound('num');
    syncInputBuffer(nextVal, activeBase);
  };

  const syncInputBuffer = (val: bigint, base: NumberBase) => {
    switch (base) {
      case 'HEX':
        setInputBuffer(formatHex(val, wordSize));
        break;
      case 'DEC':
        setInputBuffer(toSigned(val, wordSize).toString());
        break;
      case 'OCT':
        setInputBuffer(formatOctal(val, wordSize));
        break;
      case 'BIN':
        setInputBuffer(clampToWordSize(val, wordSize).toString(2));
        break;
    }
  };

  // Digit/Char input
  const handleInputChar = (ch: string) => {
    onPlaySound('num');
    let nextStr = inputBuffer === '0' ? ch : inputBuffer + ch;
    // Validate based on base
    if (activeBase === 'BIN' && !['0', '1'].includes(ch)) return;
    if (activeBase === 'OCT' && !['0', '1', '2', '3', '4', '5', '6', '7'].includes(ch)) return;
    if (activeBase === 'DEC' && !/^[0-9]$/.test(ch)) return;
    if (activeBase === 'HEX' && !/^[0-9A-Fa-f]$/.test(ch)) return;

    setInputBuffer(nextStr);
    const parsed = parseFromBase(nextStr, activeBase, wordSize);
    setCurrentVal(parsed);
  };

  const handleBackspace = () => {
    onPlaySound('num');
    const sliced = inputBuffer.slice(0, -1);
    const nextStr = sliced.length === 0 ? '0' : sliced;
    setInputBuffer(nextStr);
    const parsed = parseFromBase(nextStr, activeBase, wordSize);
    setCurrentVal(parsed);
  };

  const handleClear = () => {
    onPlaySound('clear');
    setCurrentVal(0n);
    setInputBuffer('0');
    setPendingOp(null);
    setPreviousVal(null);
  };

  // Bitwise operations
  const handleBitwiseOp = (op: string) => {
    onPlaySound('op');
    if (op === 'NOT') {
      const inverted = clampToWordSize(~currentVal, wordSize);
      setCurrentVal(inverted);
      syncInputBuffer(inverted, activeBase);
      onAddToHistory?.(`NOT(${currentVal.toString()})`, inverted.toString());
      return;
    }
    if (op === 'NEG') {
      const negated = clampToWordSize(-currentVal, wordSize);
      setCurrentVal(negated);
      syncInputBuffer(negated, activeBase);
      return;
    }
    if (op === 'LSH') {
      const shifted = clampToWordSize(currentVal << 1n, wordSize);
      setCurrentVal(shifted);
      syncInputBuffer(shifted, activeBase);
      return;
    }
    if (op === 'RSH') {
      const shifted = clampToWordSize(currentVal >> 1n, wordSize);
      setCurrentVal(shifted);
      syncInputBuffer(shifted, activeBase);
      return;
    }
    if (op === 'ROL') {
      const msb = (currentVal >> BigInt(wordSize - 1)) & 1n;
      const shifted = clampToWordSize((currentVal << 1n) | msb, wordSize);
      setCurrentVal(shifted);
      syncInputBuffer(shifted, activeBase);
      return;
    }
    if (op === 'ROR') {
      const lsb = currentVal & 1n;
      const shifted = clampToWordSize((currentVal >> 1n) | (lsb << BigInt(wordSize - 1)), wordSize);
      setCurrentVal(shifted);
      syncInputBuffer(shifted, activeBase);
      return;
    }

    // Binary bitwise op: AND, OR, XOR, NAND, NOR
    setPreviousVal(currentVal);
    setPendingOp(op);
    setInputBuffer('0');
  };

  const handleEquals = () => {
    if (!pendingOp || previousVal === null) return;
    onPlaySound('equals');
    let res: bigint;
    const a = previousVal;
    const b = currentVal;

    switch (pendingOp) {
      case 'AND':
        res = a & b;
        break;
      case 'OR':
        res = a | b;
        break;
      case 'XOR':
        res = a ^ b;
        break;
      case 'NAND':
        res = ~(a & b);
        break;
      case 'NOR':
        res = ~(a | b);
        break;
      default:
        res = b;
    }
    const clamped = clampToWordSize(res, wordSize);
    setCurrentVal(clamped);
    syncInputBuffer(clamped, activeBase);
    onAddToHistory?.(`${a.toString()} ${pendingOp} ${b.toString()}`, clamped.toString());
    setPendingOp(null);
    setPreviousVal(null);
  };

  // Validity checks for keypad buttons
  const isCharAllowed = (ch: string) => {
    if (activeBase === 'BIN') return ch === '0' || ch === '1';
    if (activeBase === 'OCT') return ['0', '1', '2', '3', '4', '5', '6', '7'].includes(ch);
    if (activeBase === 'DEC') return /^[0-9]$/.test(ch);
    return true; // HEX allows 0-9 and A-F
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Base Display Matrix */}
      <div className={`rounded-xl p-3 border space-y-1.5 ${theme.displayBgClass} ${theme.displayBorderClass}`}>
        {(['HEX', 'DEC', 'OCT', 'BIN'] as NumberBase[]).map((base) => {
          const isActive = activeBase === base;
          let valString = '';
          if (base === 'HEX') valString = hexStr;
          else if (base === 'DEC') valString = decSigned;
          else if (base === 'OCT') valString = octStr;
          else if (base === 'BIN') valString = binStr;

          return (
            <button
              key={base}
              onClick={() => handleSelectBase(base)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs sm:text-sm font-mono transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'hover:bg-white/5 text-neutral-300/80 border border-transparent'
              }`}
            >
              <span className="font-semibold text-neutral-400 w-12">{base}</span>
              <span className="truncate max-w-[260px] sm:max-w-md font-mono-numbers text-right">
                {valString || '0'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Word Size & Shift Bar */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 bg-black/10 dark:bg-white/5 p-1 rounded-lg border border-white/5">
          {([64, 32, 16, 8] as WordSize[]).map((size) => (
            <button
              key={size}
              onClick={() => handleSelectWordSize(size)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
                wordSize === size ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {size === 64 ? 'QWORD' : size === 32 ? 'DWORD' : size === 16 ? 'WORD' : 'BYTE'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleBitwiseOp('LSH')}
            className={`px-2 py-1 rounded text-[11px] font-mono border ${theme.actionBtnClass}`}
            title="Left Shift (<< 1)"
          >
            Lsh
          </button>
          <button
            onClick={() => handleBitwiseOp('RSH')}
            className={`px-2 py-1 rounded text-[11px] font-mono border ${theme.actionBtnClass}`}
            title="Right Shift (>> 1)"
          >
            Rsh
          </button>
          <button
            onClick={() => handleBitwiseOp('ROL')}
            className={`px-2 py-1 rounded text-[11px] font-mono border ${theme.actionBtnClass}`}
            title="Rotate Left"
          >
            RoL
          </button>
          <button
            onClick={() => handleBitwiseOp('ROR')}
            className={`px-2 py-1 rounded text-[11px] font-mono border ${theme.actionBtnClass}`}
            title="Rotate Right"
          >
            RoR
          </button>
        </div>
      </div>

      {/* 64-Bit Interactive Bit Matrix */}
      <div className={`p-2.5 rounded-xl border space-y-1.5 ${theme.displayBgClass} ${theme.displayBorderClass}`}>
        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono px-1">
          <span>63</span>
          <span>47</span>
          <span>31</span>
          <span>15</span>
          <span>0</span>
        </div>

        {/* High 32 bits (63 down to 32) */}
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 8 }).map((_, groupIdx) => {
            const startBit = 63 - groupIdx * 4;
            return (
              <div key={groupIdx} className="flex gap-0.5 justify-center">
                {[0, 1, 2, 3].map((subIdx) => {
                  const bitIdx = startBit - subIdx;
                  const isEnabled = bitIdx < wordSize;
                  const bitVal = isEnabled ? getBit(currentVal, bitIdx) : 0;
                  return (
                    <button
                      key={bitIdx}
                      disabled={!isEnabled}
                      onClick={() => handleToggleBit(bitIdx)}
                      className={`w-3.5 h-4 sm:w-4 sm:h-5 rounded text-[9px] font-mono flex items-center justify-center transition-all ${
                        !isEnabled
                          ? 'opacity-20 cursor-not-allowed bg-black/20 text-neutral-600'
                          : bitVal === 1
                          ? 'bg-amber-500 text-black font-bold shadow-sm'
                          : 'bg-white/10 hover:bg-white/20 text-neutral-400'
                      }`}
                    >
                      {bitVal}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Low 32 bits (31 down to 0) */}
        <div className="grid grid-cols-8 gap-1 pt-1 border-t border-white/5">
          {Array.from({ length: 8 }).map((_, groupIdx) => {
            const startBit = 31 - groupIdx * 4;
            return (
              <div key={groupIdx} className="flex gap-0.5 justify-center">
                {[0, 1, 2, 3].map((subIdx) => {
                  const bitIdx = startBit - subIdx;
                  const isEnabled = bitIdx < wordSize;
                  const bitVal = isEnabled ? getBit(currentVal, bitIdx) : 0;
                  return (
                    <button
                      key={bitIdx}
                      disabled={!isEnabled}
                      onClick={() => handleToggleBit(bitIdx)}
                      className={`w-3.5 h-4 sm:w-4 sm:h-5 rounded text-[9px] font-mono flex items-center justify-center transition-all ${
                        !isEnabled
                          ? 'opacity-20 cursor-not-allowed bg-black/20 text-neutral-600'
                          : bitVal === 1
                          ? 'bg-amber-500 text-black font-bold shadow-sm'
                          : 'bg-white/10 hover:bg-white/20 text-neutral-400'
                      }`}
                    >
                      {bitVal}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Programmer Logic & Hex Keypad */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1: Bitwise logic */}
        <button
          onClick={() => handleBitwiseOp('AND')}
          className={`h-10 sm:h-11 rounded-lg text-xs font-mono font-medium ${
            pendingOp === 'AND' ? 'bg-amber-500 text-black font-bold' : theme.actionBtnClass
          }`}
        >
          AND
        </button>
        <button
          onClick={() => handleBitwiseOp('OR')}
          className={`h-10 sm:h-11 rounded-lg text-xs font-mono font-medium ${
            pendingOp === 'OR' ? 'bg-amber-500 text-black font-bold' : theme.actionBtnClass
          }`}
        >
          OR
        </button>
        <button
          onClick={() => handleBitwiseOp('NOT')}
          className={`h-10 sm:h-11 rounded-lg text-xs font-mono font-medium ${theme.actionBtnClass}`}
        >
          NOT
        </button>
        <button
          onClick={() => handleBitwiseOp('XOR')}
          className={`h-10 sm:h-11 rounded-lg text-xs font-mono font-medium ${
            pendingOp === 'XOR' ? 'bg-amber-500 text-black font-bold' : theme.actionBtnClass
          }`}
        >
          XOR
        </button>
        <button
          onClick={handleClear}
          className={`h-10 sm:h-11 rounded-lg text-xs font-mono font-bold text-rose-400 ${theme.actionBtnClass}`}
        >
          C
        </button>

        {/* Row 2: Hex A, B, 7, 8, 9 */}
        <button
          disabled={!isCharAllowed('A')}
          onClick={() => handleInputChar('A')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono font-bold ${
            isCharAllowed('A') ? theme.actionBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          A
        </button>
        <button
          disabled={!isCharAllowed('B')}
          onClick={() => handleInputChar('B')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono font-bold ${
            isCharAllowed('B') ? theme.actionBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          B
        </button>
        <button
          disabled={!isCharAllowed('7')}
          onClick={() => handleInputChar('7')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('7') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          7
        </button>
        <button
          disabled={!isCharAllowed('8')}
          onClick={() => handleInputChar('8')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('8') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          8
        </button>
        <button
          disabled={!isCharAllowed('9')}
          onClick={() => handleInputChar('9')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('9') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          9
        </button>

        {/* Row 3: Hex C, D, 4, 5, 6 */}
        <button
          disabled={!isCharAllowed('C')}
          onClick={() => handleInputChar('C')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono font-bold ${
            isCharAllowed('C') ? theme.actionBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          C
        </button>
        <button
          disabled={!isCharAllowed('D')}
          onClick={() => handleInputChar('D')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono font-bold ${
            isCharAllowed('D') ? theme.actionBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          D
        </button>
        <button
          disabled={!isCharAllowed('4')}
          onClick={() => handleInputChar('4')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('4') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          4
        </button>
        <button
          disabled={!isCharAllowed('5')}
          onClick={() => handleInputChar('5')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('5') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          5
        </button>
        <button
          disabled={!isCharAllowed('6')}
          onClick={() => handleInputChar('6')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('6') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          6
        </button>

        {/* Row 4: Hex E, F, 1, 2, 3 */}
        <button
          disabled={!isCharAllowed('E')}
          onClick={() => handleInputChar('E')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono font-bold ${
            isCharAllowed('E') ? theme.actionBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          E
        </button>
        <button
          disabled={!isCharAllowed('F')}
          onClick={() => handleInputChar('F')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono font-bold ${
            isCharAllowed('F') ? theme.actionBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          F
        </button>
        <button
          disabled={!isCharAllowed('1')}
          onClick={() => handleInputChar('1')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('1') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          1
        </button>
        <button
          disabled={!isCharAllowed('2')}
          onClick={() => handleInputChar('2')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('2') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          2
        </button>
        <button
          disabled={!isCharAllowed('3')}
          onClick={() => handleInputChar('3')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('3') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          3
        </button>

        {/* Row 5: NEG, 0, Backspace, Equals */}
        <button
          onClick={() => handleBitwiseOp('NEG')}
          className={`h-10 sm:h-11 rounded-lg text-xs font-mono font-medium ${theme.actionBtnClass}`}
          title="2's Complement (NEG)"
        >
          NEG
        </button>
        <button
          onClick={() => handleBitwiseOp('NOR')}
          className={`h-10 sm:h-11 rounded-lg text-xs font-mono font-medium ${
            pendingOp === 'NOR' ? 'bg-amber-500 text-black font-bold' : theme.actionBtnClass
          }`}
        >
          NOR
        </button>
        <button
          disabled={!isCharAllowed('0')}
          onClick={() => handleInputChar('0')}
          className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-mono ${
            isCharAllowed('0') ? theme.numBtnClass : 'opacity-25 cursor-not-allowed bg-black/10'
          }`}
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className={`h-10 sm:h-11 rounded-lg flex items-center justify-center ${theme.actionBtnClass}`}
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={handleEquals}
          className={`h-10 sm:h-11 rounded-lg text-sm font-bold ${theme.equalsBtnClass}`}
        >
          =
        </button>
      </div>
    </div>
  );
};
