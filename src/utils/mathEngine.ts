import { AngleUnit } from '../types/calculator';

/**
 * High-precision math utility for OmniCalc Pro
 */

// Factorial helper
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // JS Number overflow limit
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Clean floating point artifacts like 0.1 + 0.2 = 0.30000000000000004
export function sanitizeNumber(num: number): number {
  if (!Number.isFinite(num)) return num;
  // Use 12 significant digits to eliminate floating point rounding errors
  const fixed = parseFloat(num.toPrecision(12));
  return Object.is(fixed, -0) ? 0 : fixed;
}

export function formatNumberForDisplay(num: number | string, maxDigits: number = 12): string {
  if (typeof num === 'string') {
    if (num === 'Error' || num === 'Cannot divide by zero' || num === 'Infinity' || num === '-Infinity' || num === 'NaN') {
      return num;
    }
    const parsed = Number(num);
    if (isNaN(parsed)) return num;
    num = parsed;
  }

  if (isNaN(num)) return 'Error';
  if (!Number.isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  const clean = sanitizeNumber(num);
  const abs = Math.abs(clean);

  // If extremely large or tiny, use scientific notation
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-9)) {
    return clean.toExponential(6).replace('e+', 'e');
  }

  // Format with standard localization grouping
  const parts = clean.toString().split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (parts.length > 1) {
    // Truncate decimals if overall string is too long
    const availableDecimals = Math.max(0, maxDigits - integerPart.length - 1);
    const decimals = parts[1].slice(0, Math.min(10, availableDecimals));
    return decimals.length > 0 ? `${integerPart}.${decimals}` : integerPart;
  }
  return integerPart;
}

// Evaluate expressions safely
export function evaluateExpression(expr: string, angleUnit: AngleUnit = 'deg'): { result: number; error?: string } {
  try {
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `${Math.PI}`)
      .replace(/e(?![a-z0-9])/gi, `${Math.E}`)
      .replace(/φ/g, `${(1 + Math.sqrt(5)) / 2}`)
      .replace(/τ/g, `${Math.PI * 2}`);

    // Pre-process factorial: number! -> fact(number)
    sanitized = sanitized.replace(/(\d+(\.\d+)?|\([^)]+\))!/g, (_, p1) => `fact(${p1})`);

    // Pre-process percentage: e.g. 50 + 10% or standalone 50%
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Custom functions scope
    const isDeg = angleUnit === 'deg';
    const toRad = (x: number) => (isDeg ? (x * Math.PI) / 180 : x);
    const fromRad = (x: number) => (isDeg ? (x * 180) / Math.PI : x);

    const context = {
      sin: (x: number) => sanitizeNumber(Math.sin(toRad(x))),
      cos: (x: number) => {
        // Fix cos(90 deg) = 0
        if (isDeg && Math.abs(x % 180) === 90) return 0;
        return sanitizeNumber(Math.cos(toRad(x)));
      },
      tan: (x: number) => {
        if (isDeg && Math.abs(x % 180) === 90) throw new Error('Undefined');
        return sanitizeNumber(Math.tan(toRad(x)));
      },
      asin: (x: number) => sanitizeNumber(fromRad(Math.asin(x))),
      acos: (x: number) => sanitizeNumber(fromRad(Math.acos(x))),
      atan: (x: number) => sanitizeNumber(fromRad(Math.atan(x))),
      sinh: (x: number) => sanitizeNumber(Math.sinh(x)),
      cosh: (x: number) => sanitizeNumber(Math.cosh(x)),
      tanh: (x: number) => sanitizeNumber(Math.tanh(x)),
      sqrt: (x: number) => {
        if (x < 0) throw new Error('Invalid input');
        return sanitizeNumber(Math.sqrt(x));
      },
      cbrt: (x: number) => sanitizeNumber(Math.cbrt(x)),
      ln: (x: number) => {
        if (x <= 0) throw new Error('Invalid input');
        return sanitizeNumber(Math.log(x));
      },
      log: (x: number) => {
        if (x <= 0) throw new Error('Invalid input');
        return sanitizeNumber(Math.log10(x));
      },
      log2: (x: number) => {
        if (x <= 0) throw new Error('Invalid input');
        return sanitizeNumber(Math.log2(x));
      },
      abs: (x: number) => Math.abs(x),
      fact: (x: number) => factorial(x),
      pow: (x: number, y: number) => sanitizeNumber(Math.pow(x, y)),
      exp: (x: number) => sanitizeNumber(Math.exp(x)),
    };

    // Replace power x ^ y with Math.pow(x, y) or pow(x, y)
    // Simple regex parser for ^
    while (sanitized.includes('^')) {
      const powRegex = /([a-zA-Z0-9_.]+|\([^\(\)]+\))\s*\^\s*([a-zA-Z0-9_.]+|\([^\(\)]+\))/;
      const match = sanitized.match(powRegex);
      if (!match) break;
      sanitized = sanitized.replace(match[0], `pow(${match[1]},${match[2]})`);
    }

    // Check for division by zero before evaluation
    if (/\/\s*0(?![0-9.])/.test(sanitized)) {
      return { result: NaN, error: 'Cannot divide by zero' };
    }

    // Safe parser evaluator using Function with strict arguments
    const allowedKeys = Object.keys(context);
    const allowedValues = Object.values(context);

    // Validate sanitized string only contains math characters and function names
    const validCharactersRegex = /^[0-9+\-*/().,\s^eE_a-zA-Z]+$/;
    if (!validCharactersRegex.test(sanitized)) {
      return { result: NaN, error: 'Invalid characters' };
    }

    const evaluator = new Function(...allowedKeys, `return (${sanitized});`);
    const rawResult = evaluator(...allowedValues);

    if (typeof rawResult !== 'number' || isNaN(rawResult)) {
      return { result: NaN, error: 'Invalid calculation' };
    }

    if (!Number.isFinite(rawResult)) {
      return { result: rawResult, error: 'Cannot divide by zero' };
    }

    return { result: sanitizeNumber(rawResult) };
  } catch (err: any) {
    return { result: NaN, error: err.message || 'Syntax Error' };
  }
}
