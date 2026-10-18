import { WordSize, NumberBase } from '../types/calculator';

export function getWordMask(size: WordSize): bigint {
  switch (size) {
    case 8:
      return 0xffn;
    case 16:
      return 0xffffn;
    case 32:
      return 0xffffffffn;
    case 64:
    default:
      return 0xffffffffffffffffn;
  }
}

export function clampToWordSize(val: bigint, size: WordSize): bigint {
  const mask = getWordMask(size);
  return val & mask;
}

export function toSigned(val: bigint, size: WordSize): bigint {
  const unsigned = clampToWordSize(val, size);
  const signBit = 1n << BigInt(size - 1);
  if ((unsigned & signBit) !== 0n) {
    const fullMask = (1n << BigInt(size)) - 1n;
    return -((~unsigned + 1n) & fullMask);
  }
  return unsigned;
}

export function formatBinary(val: bigint, size: WordSize): string {
  const clamped = clampToWordSize(val, size);
  const rawBin = clamped.toString(2).padStart(size, '0');
  // Group in nibbles of 4
  const chunks: string[] = [];
  for (let i = 0; i < rawBin.length; i += 4) {
    chunks.push(rawBin.slice(i, i + 4));
  }
  return chunks.join(' ');
}

export function formatHex(val: bigint, size: WordSize): string {
  const clamped = clampToWordSize(val, size);
  const hexChars = size / 4;
  return clamped.toString(16).toUpperCase().padStart(hexChars, '0');
}

export function formatOctal(val: bigint, size: WordSize): string {
  const clamped = clampToWordSize(val, size);
  return clamped.toString(8);
}

export function getBit(val: bigint, bitIndex: number): number {
  return Number((val >> BigInt(bitIndex)) & 1n);
}

export function toggleBit(val: bigint, bitIndex: number, size: WordSize): bigint {
  const bitMask = 1n << BigInt(bitIndex);
  const toggled = val ^ bitMask;
  return clampToWordSize(toggled, size);
}

export function parseFromBase(input: string, base: NumberBase, size: WordSize): bigint {
  try {
    const clean = input.replace(/\s+/g, '');
    if (!clean) return 0n;
    let val: bigint;
    switch (base) {
      case 'HEX':
        val = BigInt('0x' + clean);
        break;
      case 'BIN':
        val = BigInt('0b' + clean);
        break;
      case 'OCT':
        val = BigInt('0o' + clean);
        break;
      case 'DEC':
      default:
        val = BigInt(clean);
        break;
    }
    return clampToWordSize(val, size);
  } catch {
    return 0n;
  }
}
