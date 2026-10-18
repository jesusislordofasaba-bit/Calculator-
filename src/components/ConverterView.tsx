import React, { useState } from 'react';
import { ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';
import { UNIT_CATEGORIES, convertUnits } from '../utils/unitsData';
import {
  ArrowDownUp,
  Ruler,
  Scale,
  Thermometer,
  HardDrive,
  Square,
  Box,
  Gauge,
  Clock,
  Compass,
  Copy,
  Check,
} from 'lucide-react';

interface ConverterViewProps {
  themeId: ThemeId;
  onPlaySound: (type?: any) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-3.5 h-3.5" />,
  Scale: <Scale className="w-3.5 h-3.5" />,
  Thermometer: <Thermometer className="w-3.5 h-3.5" />,
  HardDrive: <HardDrive className="w-3.5 h-3.5" />,
  Square: <Square className="w-3.5 h-3.5" />,
  Box: <Box className="w-3.5 h-3.5" />,
  Gauge: <Gauge className="w-3.5 h-3.5" />,
  Clock: <Clock className="w-3.5 h-3.5" />,
  Compass: <Compass className="w-3.5 h-3.5" />,
};

export const ConverterView: React.FC<ConverterViewProps> = ({
  themeId,
  onPlaySound,
}) => {
  const theme = THEMES[themeId];

  const [activeCategoryId, setActiveCategoryId] = useState<string>('length');
  const activeCategory = UNIT_CATEGORIES.find((c) => c.id === activeCategoryId) || UNIT_CATEGORIES[0];

  const [fromUnitId, setFromUnitId] = useState<string>(activeCategory.units[1]?.id || activeCategory.units[0].id);
  const [toUnitId, setToUnitId] = useState<string>(activeCategory.units[8]?.id || activeCategory.units[1].id);
  const [inputValue, setInputValue] = useState<string>('1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const numInput = parseFloat(inputValue);
  const convertedResult = isNaN(numInput)
    ? '0'
    : convertUnits(numInput, fromUnitId, toUnitId, activeCategoryId);

  const formattedResult =
    typeof convertedResult === 'number' && !isNaN(convertedResult)
      ? parseFloat(convertedResult.toPrecision(8)).toString()
      : '0';

  const handleSelectCategory = (catId: string) => {
    setActiveCategoryId(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length > 1) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
    onPlaySound('toggle');
  };

  const handleSwap = () => {
    onPlaySound('op');
    const oldFrom = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(oldFrom);
  };

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
        {UNIT_CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-amber-500 text-black font-semibold shadow-sm'
                  : 'bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {CATEGORY_ICONS[cat.iconName]}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Conversion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center relative">
        {/* From Card */}
        <div className={`p-4 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>From</span>
            <select
              value={fromUnitId}
              onChange={(e) => {
                setFromUnitId(e.target.value);
                onPlaySound('toggle');
              }}
              className="bg-black/20 dark:bg-white/10 px-2 py-1 rounded border border-white/10 outline-none text-xs font-medium cursor-pointer"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id} className="text-slate-900 bg-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`w-full bg-transparent text-2xl sm:text-3xl font-mono-numbers font-bold outline-none ${theme.displayTextClass}`}
            placeholder="0"
          />
        </div>

        {/* Swap Button for Desktop (Center) and Mobile */}
        <div className="flex justify-center -my-2 md:my-0 md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
          <button
            onClick={handleSwap}
            title="Swap Units"
            className="w-9 h-9 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>
        </div>

        {/* To Card */}
        <div className={`p-4 rounded-xl border ${theme.displayBgClass} ${theme.displayBorderClass} space-y-2`}>
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>To</span>
            <select
              value={toUnitId}
              onChange={(e) => {
                setToUnitId(e.target.value);
                onPlaySound('toggle');
              }}
              className="bg-black/20 dark:bg-white/10 px-2 py-1 rounded border border-white/10 outline-none text-xs font-medium cursor-pointer"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id} className="text-slate-900 bg-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div
              className={`text-2xl sm:text-3xl font-mono-numbers font-bold truncate ${theme.displayTextClass}`}
              title={formattedResult}
            >
              {formattedResult}
            </div>
            <button
              onClick={() => handleCopy(formattedResult, 'target')}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              title="Copy result"
            >
              {copiedId === 'target' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive All Units Equivalence Grid */}
      <div className={`rounded-xl border p-3.5 space-y-2 ${theme.displayBgClass} ${theme.displayBorderClass}`}>
        <div className="text-xs font-semibold text-neutral-400 flex items-center justify-between border-b border-white/5 pb-1.5">
          <span>All Equivalent Units in {activeCategory.name}</span>
          <span className="text-[11px] font-mono text-neutral-500">
            Based on {inputValue || '0'} {activeCategory.units.find((u) => u.id === fromUnitId)?.symbol}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 max-h-56 overflow-y-auto">
          {activeCategory.units.map((unit) => {
            const eqVal = isNaN(numInput)
              ? 0
              : convertUnits(numInput, fromUnitId, unit.id, activeCategoryId);
            const strVal =
              typeof eqVal === 'number' && !isNaN(eqVal)
                ? parseFloat(eqVal.toPrecision(6)).toString()
                : '0';

            return (
              <div
                key={unit.id}
                onClick={() => handleCopy(strVal, unit.id)}
                className="p-2 rounded-lg bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10 border border-white/5 flex flex-col justify-between cursor-pointer group transition-colors"
                title={`Click to copy: ${strVal} ${unit.symbol}`}
              >
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="truncate">{unit.name}</span>
                  <span className="font-mono text-[10px] opacity-75">{unit.symbol}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono-numbers text-xs sm:text-sm font-semibold truncate">
                    {strVal}
                  </span>
                  {copiedId === unit.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
