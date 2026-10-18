export type CalculatorMode = 'standard' | 'scientific' | 'programmer' | 'converter' | 'financial';

export type ThemeId = 'oled' | 'nordic' | 'retro' | 'cyberpunk' | 'minimal';

export interface HistoryItem {
  id: string;
  timestamp: number;
  expression: string;
  result: string;
  mode: CalculatorMode;
  note?: string;
}

export type AngleUnit = 'deg' | 'rad';

export type WordSize = 64 | 32 | 16 | 8;

export type NumberBase = 'HEX' | 'DEC' | 'OCT' | 'BIN';

export interface UnitCategory {
  id: string;
  name: string;
  iconName: string;
  baseUnit: string;
  units: {
    id: string;
    name: string;
    symbol: string;
    ratioToBase: number; // For non-temperature
    offset?: number; // For temperature
  }[];
}
