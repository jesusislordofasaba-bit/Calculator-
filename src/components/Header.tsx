import React from 'react';
import { CalculatorMode, ThemeId } from '../types/calculator';
import { THEMES } from '../utils/themeConfig';
import {
  Volume2,
  VolumeX,
  History,
  Keyboard,
  Palette,
  Calculator,
  Binary,
  ArrowLeftRight,
  Landmark,
  FlaskConical,
} from 'lucide-react';

interface HeaderProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  historyOpen: boolean;
  onToggleHistory: () => void;
  onOpenShortcuts: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  currentTheme,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
  historyOpen,
  onToggleHistory,
  onOpenShortcuts,
  historyCount,
}) => {
  const theme = THEMES[currentTheme];
  const [themeMenuOpen, setThemeMenuOpen] = React.useState(false);

  const modes: { id: CalculatorMode; label: string; icon: React.ReactNode }[] = [
    { id: 'standard', label: 'Standard', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'scientific', label: 'Scientific', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'programmer', label: 'Programmer', icon: <Binary className="w-3.5 h-3.5" /> },
    { id: 'converter', label: 'Converter', icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
    { id: 'financial', label: 'Financial', icon: <Landmark className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="w-full border-b border-inherit px-4 sm:px-6 py-3 flex items-center justify-between gap-4 select-none">
      {/* Zone 1: Brand title */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm"
          style={{ backgroundColor: theme.accentColor, color: currentTheme === 'nordic' ? '#ffffff' : '#000000' }}
        >
          ∑
        </div>
        <span className="text-base sm:text-lg font-bold tracking-tight whitespace-nowrap">
          OmniCalc <span className="opacity-60 text-xs font-mono font-normal uppercase">Pro</span>
        </span>
      </div>

      {/* Zone 2: Mode Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1 p-1 bg-black/10 dark:bg-white/5 rounded-xl border border-white/5">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 ${
                isActive
                  ? theme.navActive
                  : theme.navInactive
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative">
        {/* Mobile Mode dropdown button */}
        <div className="md:hidden">
          <select
            value={currentMode}
            onChange={(e) => onSelectMode(e.target.value as CalculatorMode)}
            className="text-xs font-medium px-2 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 border border-white/10 outline-none"
          >
            {modes.map((m) => (
              <option key={m.id} value={m.id} className="text-slate-900 bg-white">
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute keyboard sound' : 'Enable keyboard sound'}
          className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-inherit/80 hover:text-inherit transition-colors"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 opacity-50" />}
        </button>

        {/* Keyboard Shortcuts Guide */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard shortcuts"
          className="hidden sm:flex p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-inherit/80 hover:text-inherit transition-colors"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Theme Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            title="Change theme"
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-inherit/80 hover:text-inherit transition-colors flex items-center gap-1"
            aria-label="Select theme"
          >
            <Palette className="w-4 h-4" />
          </button>

          {themeMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl z-50 text-xs backdrop-blur-md"
              onMouseLeave={() => setThemeMenuOpen(false)}
            >
              <div className="px-3 py-1 font-semibold text-slate-400 border-b border-slate-800 mb-1">Themes</div>
              {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                const t = THEMES[tId];
                return (
                  <button
                    key={tId}
                    onClick={() => {
                      onSelectTheme(tId);
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      currentTheme === tId ? 'text-amber-400 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: t.accentColor }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* History Tape Drawer Button */}
        <button
          onClick={onToggleHistory}
          title="Calculation History Tape"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            historyOpen
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'hover:bg-black/10 dark:hover:bg-white/10 border-transparent text-inherit/90'
          }`}
          aria-label="Calculation history"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tape</span>
          {historyCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 dark:bg-white/10 font-mono">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
