import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorMode, ThemeId, AngleUnit, HistoryItem } from './types/calculator';
import { THEMES } from './utils/themeConfig';
import { evaluateExpression, formatNumberForDisplay } from './utils/mathEngine';
import { playKeySound } from './utils/sound';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { MemoryRow } from './components/MemoryRow';
import { StandardKeypad } from './components/StandardKeypad';
import { ScientificKeypad } from './components/ScientificKeypad';
import { ProgrammerView } from './components/ProgrammerView';
import { ConverterView } from './components/ConverterView';
import { FinancialView } from './components/FinancialView';
import { HistoryTape } from './components/HistoryTape';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

export default function App() {
  // Mode & Theme
  const [mode, setMode] = useState<CalculatorMode>(() => {
    return (localStorage.getItem('omni_calc_mode') as CalculatorMode) || 'standard';
  });

  const [themeId, setThemeId] = useState<ThemeId>(() => {
    return (localStorage.getItem('omni_calc_theme') as ThemeId) || 'oled';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('omni_calc_sound');
    return saved !== null ? saved === 'true' : true;
  });

  // History & Tape
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('omni_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [historyOpen, setHistoryOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Calculation State
  const [expression, setExpression] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [overwriteNext, setOverwriteNext] = useState<boolean>(false);
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('deg');
  const [isSecond, setIsSecond] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('omni_calc_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('omni_calc_theme', themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem('omni_calc_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('omni_calc_history', JSON.stringify(history));
  }, [history]);

  const sound = useCallback(
    (type: 'num' | 'op' | 'equals' | 'clear' | 'toggle' = 'num') => {
      playKeySound(type, soundEnabled);
    },
    [soundEnabled]
  );

  const addHistoryItem = useCallback(
    (expr: string, res: string, calcMode: CalculatorMode = mode) => {
      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        expression: expr,
        result: res,
        mode: calcMode,
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 99)]); // Keep last 100
    },
    [mode]
  );

  // Keypad Handlers
  const handleDigit = useCallback(
    (digit: string) => {
      sound('num');
      if (overwriteNext || currentValue === '0') {
        setCurrentValue(digit);
        setOverwriteNext(false);
      } else {
        if (currentValue.length < 24) {
          setCurrentValue((prev) => prev + digit);
        }
      }
    },
    [currentValue, overwriteNext, sound]
  );

  const handleDecimal = useCallback(() => {
    sound('num');
    if (overwriteNext) {
      setCurrentValue('0.');
      setOverwriteNext(false);
    } else if (!currentValue.includes('.')) {
      setCurrentValue((prev) => prev + '.');
    }
  }, [currentValue, overwriteNext, sound]);

  const handleOperator = useCallback(
    (op: string) => {
      sound('op');
      if (expression && !overwriteNext) {
        // Evaluate running expression
        const fullExpr = `${expression} ${currentValue}`;
        const { result, error } = evaluateExpression(fullExpr, angleUnit);
        if (error || isNaN(result)) {
          setCurrentValue(error || 'Error');
          setExpression('');
          setOverwriteNext(true);
          return;
        }
        const formatted = formatNumberForDisplay(result);
        setCurrentValue(formatted);
        setExpression(`${formatted} ${op}`);
      } else {
        setExpression(`${currentValue} ${op}`);
      }
      setOverwriteNext(true);
    },
    [currentValue, expression, overwriteNext, angleUnit, sound]
  );

  const handleEquals = useCallback(() => {
    if (!expression && !overwriteNext) {
      sound('equals');
      return;
    }
    sound('equals');

    let fullExpr = '';
    if (expression.endsWith('=') || expression.endsWith('=')) {
      fullExpr = currentValue;
    } else {
      fullExpr = `${expression} ${currentValue}`.trim();
    }

    const { result, error } = evaluateExpression(fullExpr, angleUnit);
    if (error || isNaN(result)) {
      setCurrentValue(error || 'Error');
      setExpression('');
      setOverwriteNext(true);
      return;
    }

    const formatted = formatNumberForDisplay(result);
    addHistoryItem(fullExpr, formatted);
    setExpression(`${fullExpr} =`);
    setCurrentValue(formatted);
    setOverwriteNext(true);
  }, [expression, currentValue, overwriteNext, angleUnit, addHistoryItem, sound]);

  const handleClear = useCallback(() => {
    sound('clear');
    setCurrentValue('0');
    setExpression('');
    setOverwriteNext(false);
  }, [sound]);

  const handleClearEntry = useCallback(() => {
    sound('clear');
    setCurrentValue('0');
  }, [sound]);

  const handleBackspace = useCallback(() => {
    sound('num');
    if (overwriteNext) {
      setCurrentValue('0');
      setOverwriteNext(false);
      return;
    }
    if (currentValue.length > 1) {
      setCurrentValue((prev) => prev.slice(0, -1));
    } else {
      setCurrentValue('0');
    }
  }, [currentValue, overwriteNext, sound]);

  const handleToggleSign = useCallback(() => {
    sound('num');
    if (currentValue === '0' || currentValue === 'Error') return;
    if (currentValue.startsWith('-')) {
      setCurrentValue((prev) => prev.slice(1));
    } else {
      setCurrentValue((prev) => '-' + prev);
    }
  }, [currentValue, sound]);

  const handleFunction = useCallback(
    (fn: string) => {
      sound('op');
      const num = parseFloat(currentValue.replace(/,/g, ''));

      switch (fn) {
        case '%': {
          const res = num / 100;
          setCurrentValue(formatNumberForDisplay(res));
          setOverwriteNext(true);
          break;
        }
        case '1/x': {
          if (num === 0) {
            setCurrentValue('Cannot divide by zero');
          } else {
            const res = 1 / num;
            const formatted = formatNumberForDisplay(res);
            addHistoryItem(`1 / (${num})`, formatted);
            setExpression(`1 / (${num}) =`);
            setCurrentValue(formatted);
          }
          setOverwriteNext(true);
          break;
        }
        case 'sqr': {
          const res = num * num;
          const formatted = formatNumberForDisplay(res);
          addHistoryItem(`sqr(${num})`, formatted);
          setExpression(`sqr(${num}) =`);
          setCurrentValue(formatted);
          setOverwriteNext(true);
          break;
        }
        case 'sqrt': {
          if (num < 0) {
            setCurrentValue('Invalid input');
          } else {
            const res = Math.sqrt(num);
            const formatted = formatNumberForDisplay(res);
            addHistoryItem(`√(${num})`, formatted);
            setExpression(`√(${num}) =`);
            setCurrentValue(formatted);
          }
          setOverwriteNext(true);
          break;
        }
        case 'cbrt': {
          const res = Math.cbrt(num);
          const formatted = formatNumberForDisplay(res);
          addHistoryItem(`³√(${num})`, formatted);
          setExpression(`³√(${num}) =`);
          setCurrentValue(formatted);
          setOverwriteNext(true);
          break;
        }
        case 'sin':
        case 'cos':
        case 'tan':
        case 'asin':
        case 'acos':
        case 'atan':
        case 'sinh':
        case 'cosh':
        case 'tanh': {
          const exprToEval = `${fn}(${num})`;
          const { result, error } = evaluateExpression(exprToEval, angleUnit);
          if (error) {
            setCurrentValue(error);
          } else {
            const formatted = formatNumberForDisplay(result);
            addHistoryItem(exprToEval, formatted);
            setExpression(`${exprToEval} =`);
            setCurrentValue(formatted);
          }
          setOverwriteNext(true);
          break;
        }
        case 'ln': {
          if (num <= 0) {
            setCurrentValue('Invalid input');
          } else {
            const res = Math.log(num);
            const formatted = formatNumberForDisplay(res);
            addHistoryItem(`ln(${num})`, formatted);
            setExpression(`ln(${num}) =`);
            setCurrentValue(formatted);
          }
          setOverwriteNext(true);
          break;
        }
        case 'log': {
          if (num <= 0) {
            setCurrentValue('Invalid input');
          } else {
            const res = Math.log10(num);
            const formatted = formatNumberForDisplay(res);
            addHistoryItem(`log(${num})`, formatted);
            setExpression(`log(${num}) =`);
            setCurrentValue(formatted);
          }
          setOverwriteNext(true);
          break;
        }
        case '10^x': {
          const res = Math.pow(10, num);
          const formatted = formatNumberForDisplay(res);
          addHistoryItem(`10^(${num})`, formatted);
          setExpression(`10^(${num}) =`);
          setCurrentValue(formatted);
          setOverwriteNext(true);
          break;
        }
        case 'exp': {
          const res = Math.exp(num);
          const formatted = formatNumberForDisplay(res);
          addHistoryItem(`e^(${num})`, formatted);
          setExpression(`e^(${num}) =`);
          setCurrentValue(formatted);
          setOverwriteNext(true);
          break;
        }
        case 'fact': {
          if (num < 0 || !Number.isInteger(num)) {
            setCurrentValue('Invalid input');
          } else {
            const { result, error } = evaluateExpression(`${num}!`);
            if (error) {
              setCurrentValue(error);
            } else {
              const formatted = formatNumberForDisplay(result);
              addHistoryItem(`${num}!`, formatted);
              setExpression(`${num}! =`);
              setCurrentValue(formatted);
            }
          }
          setOverwriteNext(true);
          break;
        }
        case 'pow': {
          setExpression(`${currentValue} ^`);
          setOverwriteNext(true);
          break;
        }
        case 'pi': {
          setCurrentValue(formatNumberForDisplay(Math.PI));
          setOverwriteNext(true);
          break;
        }
        case 'e': {
          setCurrentValue(formatNumberForDisplay(Math.E));
          setOverwriteNext(true);
          break;
        }
        case 'rand': {
          setCurrentValue(formatNumberForDisplay(Math.random()));
          setOverwriteNext(true);
          break;
        }
        case 'mod': {
          setExpression(`${currentValue} %`);
          setOverwriteNext(true);
          break;
        }
        case '(': {
          setExpression((prev) => (prev ? `${prev} (` : '('));
          setOverwriteNext(true);
          break;
        }
        case ')': {
          setExpression((prev) => `${prev} ${currentValue} )`);
          setOverwriteNext(true);
          break;
        }
      }
    },
    [currentValue, angleUnit, addHistoryItem, sound]
  );

  // Memory Handlers
  const handleMemoryClear = () => {
    sound('clear');
    setMemory(0);
  };
  const handleMemoryRecall = () => {
    sound('num');
    setCurrentValue(formatNumberForDisplay(memory));
    setOverwriteNext(true);
  };
  const handleMemoryAdd = () => {
    sound('op');
    const num = parseFloat(currentValue.replace(/,/g, '')) || 0;
    setMemory((prev) => prev + num);
    setOverwriteNext(true);
  };
  const handleMemorySubtract = () => {
    sound('op');
    const num = parseFloat(currentValue.replace(/,/g, '')) || 0;
    setMemory((prev) => prev - num);
    setOverwriteNext(true);
  };
  const handleMemoryStore = () => {
    sound('op');
    const num = parseFloat(currentValue.replace(/,/g, '')) || 0;
    setMemory(num);
    setOverwriteNext(true);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing inside form inputs
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleDigit(key);
      } else if (key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (key === '+' || key === '-') {
        e.preventDefault();
        handleOperator(key === '-' ? '−' : '+');
      } else if (key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (key === '%') {
        e.preventDefault();
        handleFunction('%');
      } else if (key === '(' || key === ')') {
        e.preventDefault();
        handleFunction(key);
      } else if (key === '^') {
        e.preventDefault();
        handleFunction('pow');
      } else if (key.toLowerCase() === 'p') {
        e.preventDefault();
        handleFunction('pi');
      } else if (key.toLowerCase() === 'e') {
        e.preventDefault();
        handleFunction('e');
      } else if (key.toLowerCase() === 's') {
        e.preventDefault();
        handleFunction('sin');
      } else if (key.toLowerCase() === 'c') {
        e.preventDefault();
        handleFunction('cos');
      } else if (key.toLowerCase() === 't') {
        e.preventDefault();
        handleFunction('tan');
      } else if (key.toLowerCase() === 'r') {
        e.preventDefault();
        handleFunction('sqrt');
      } else if (key.toLowerCase() === 'l') {
        e.preventDefault();
        handleFunction('log');
      } else if (key.toLowerCase() === 'n') {
        e.preventDefault();
        handleFunction('ln');
      } else if (key === '!') {
        e.preventDefault();
        handleFunction('fact');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClear,
    handleFunction,
  ]);

  const currentTheme = THEMES[themeId];

  return (
    <div className={`min-h-screen w-full transition-colors duration-200 flex flex-col ${currentTheme.bgClass}`}>
      {/* Top Header */}
      <Header
        currentMode={mode}
        onSelectMode={(m) => {
          setMode(m);
          sound('toggle');
        }}
        currentTheme={themeId}
        onSelectTheme={(t) => {
          setThemeId(t);
          sound('toggle');
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          if (next) playKeySound('toggle', true);
        }}
        historyOpen={historyOpen}
        onToggleHistory={() => {
          setHistoryOpen(!historyOpen);
          sound('toggle');
        }}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-3 sm:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
        {/* Primary Calculator Module Container */}
        <div
          className={`w-full transition-all duration-300 rounded-3xl p-4 sm:p-6 ${
            mode === 'scientific'
              ? 'max-w-lg'
              : mode === 'programmer'
              ? 'max-w-xl'
              : mode === 'converter' || mode === 'financial'
              ? 'max-w-2xl'
              : 'max-w-sm sm:max-w-md'
          } ${currentTheme.calcBodyClass}`}
        >
          {/* Top Display & Memory for Standard and Scientific */}
          {(mode === 'standard' || mode === 'scientific') && (
            <div className="space-y-2 mb-3">
              <Display
                expression={expression}
                currentValue={currentValue}
                angleUnit={angleUnit}
                onToggleAngleUnit={() => {
                  sound('toggle');
                  setAngleUnit((prev) => (prev === 'deg' ? 'rad' : 'deg'));
                }}
                showAngleUnit={mode === 'scientific'}
                hasMemory={memory !== 0}
                isSecondActive={isSecond}
                themeId={themeId}
              />
              <MemoryRow
                memory={memory}
                onMemoryClear={handleMemoryClear}
                onMemoryRecall={handleMemoryRecall}
                onMemoryAdd={handleMemoryAdd}
                onMemorySubtract={handleMemorySubtract}
                onMemoryStore={handleMemoryStore}
                themeId={themeId}
              />
            </div>
          )}

          {/* Keypads based on mode */}
          {mode === 'standard' && (
            <StandardKeypad
              onDigit={handleDigit}
              onOperator={handleOperator}
              onDecimal={handleDecimal}
              onClear={handleClear}
              onClearEntry={handleClearEntry}
              onBackspace={handleBackspace}
              onToggleSign={handleToggleSign}
              onEquals={handleEquals}
              onFunction={handleFunction}
              themeId={themeId}
            />
          )}

          {mode === 'scientific' && (
            <ScientificKeypad
              onDigit={handleDigit}
              onOperator={handleOperator}
              onDecimal={handleDecimal}
              onClear={handleClear}
              onClearEntry={handleClearEntry}
              onBackspace={handleBackspace}
              onToggleSign={handleToggleSign}
              onEquals={handleEquals}
              onFunction={handleFunction}
              isSecond={isSecond}
              onToggleSecond={() => {
                sound('toggle');
                setIsSecond(!isSecond);
              }}
              angleUnit={angleUnit}
              onToggleAngleUnit={() => {
                sound('toggle');
                setAngleUnit((prev) => (prev === 'deg' ? 'rad' : 'deg'));
              }}
              themeId={themeId}
            />
          )}

          {mode === 'programmer' && (
            <ProgrammerView
              themeId={themeId}
              onPlaySound={sound}
              onAddToHistory={(expr, res) => addHistoryItem(expr, res, 'programmer')}
            />
          )}

          {mode === 'converter' && (
            <ConverterView themeId={themeId} onPlaySound={sound} />
          )}

          {mode === 'financial' && (
            <FinancialView
              themeId={themeId}
              onPlaySound={sound}
              onAddToHistory={(expr, res) => addHistoryItem(expr, res, 'financial')}
            />
          )}
        </div>

        {/* History Tape Panel (Desktop side-by-side or responsive) */}
        {historyOpen && (
          <div className="w-full lg:w-80 h-[560px] shrink-0 animate-in fade-in slide-in-from-right-4 duration-200">
            <HistoryTape
              history={history}
              onSelectResult={(res) => {
                setCurrentValue(res);
                setOverwriteNext(true);
                sound('num');
              }}
              onSelectExpression={(expr) => {
                setExpression(expr);
                setOverwriteNext(true);
                sound('num');
              }}
              onClearHistory={() => {
                setHistory([]);
                sound('clear');
              }}
              onDeleteItem={(id) => {
                setHistory((prev) => prev.filter((item) => item.id !== id));
                sound('clear');
              }}
              onClose={() => setHistoryOpen(false)}
              themeId={themeId}
            />
          </div>
        )}
      </main>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        themeId={themeId}
      />
    </div>
  );
}
