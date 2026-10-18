import { UnitCategory } from '../types/calculator';

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    iconName: 'Ruler',
    baseUnit: 'm',
    units: [
      { id: 'km', name: 'Kilometer', symbol: 'km', ratioToBase: 1000 },
      { id: 'm', name: 'Meter', symbol: 'm', ratioToBase: 1 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', ratioToBase: 0.01 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', ratioToBase: 0.001 },
      { id: 'um', name: 'Micrometer', symbol: 'µm', ratioToBase: 1e-6 },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', ratioToBase: 1e-9 },
      { id: 'mi', name: 'Mile', symbol: 'mi', ratioToBase: 1609.344 },
      { id: 'yd', name: 'Yard', symbol: 'yd', ratioToBase: 0.9144 },
      { id: 'ft', name: 'Foot', symbol: 'ft', ratioToBase: 0.3048 },
      { id: 'in', name: 'Inch', symbol: 'in', ratioToBase: 0.0254 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', ratioToBase: 1852 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    iconName: 'Scale',
    baseUnit: 'kg',
    units: [
      { id: 't', name: 'Metric Ton', symbol: 't', ratioToBase: 1000 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', ratioToBase: 1 },
      { id: 'g', name: 'Gram', symbol: 'g', ratioToBase: 0.001 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', ratioToBase: 1e-6 },
      { id: 'ug', name: 'Microgram', symbol: 'µg', ratioToBase: 1e-9 },
      { id: 'lb', name: 'Pound', symbol: 'lb', ratioToBase: 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', ratioToBase: 0.028349523125 },
      { id: 'st', name: 'Stone', symbol: 'st', ratioToBase: 6.35029318 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    iconName: 'Thermometer',
    baseUnit: 'C',
    units: [
      { id: 'C', name: 'Celsius', symbol: '°C', ratioToBase: 1 },
      { id: 'F', name: 'Fahrenheit', symbol: '°F', ratioToBase: 1 },
      { id: 'K', name: 'Kelvin', symbol: 'K', ratioToBase: 1 },
    ],
  },
  {
    id: 'data',
    name: 'Data Storage',
    iconName: 'HardDrive',
    baseUnit: 'B',
    units: [
      { id: 'B', name: 'Byte', symbol: 'B', ratioToBase: 1 },
      { id: 'KB', name: 'Kilobyte', symbol: 'KB', ratioToBase: 1024 },
      { id: 'MB', name: 'Megabyte', symbol: 'MB', ratioToBase: 1024 ** 2 },
      { id: 'GB', name: 'Gigabyte', symbol: 'GB', ratioToBase: 1024 ** 3 },
      { id: 'TB', name: 'Terabyte', symbol: 'TB', ratioToBase: 1024 ** 4 },
      { id: 'PB', name: 'Petabyte', symbol: 'PB', ratioToBase: 1024 ** 5 },
      { id: 'b', name: 'Bit', symbol: 'bit', ratioToBase: 0.125 },
      { id: 'Kb', name: 'Kilobit', symbol: 'Kb', ratioToBase: 128 },
      { id: 'Mb', name: 'Megabit', symbol: 'Mb', ratioToBase: 128 * 1024 },
      { id: 'Gb', name: 'Gigabit', symbol: 'Gb', ratioToBase: 128 * (1024 ** 2) },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    iconName: 'Square',
    baseUnit: 'sqm',
    units: [
      { id: 'sqkm', name: 'Square Kilometer', symbol: 'km²', ratioToBase: 1e6 },
      { id: 'sqm', name: 'Square Meter', symbol: 'm²', ratioToBase: 1 },
      { id: 'sqcm', name: 'Square Centimeter', symbol: 'cm²', ratioToBase: 0.0001 },
      { id: 'sqmi', name: 'Square Mile', symbol: 'mi²', ratioToBase: 2589988.110336 },
      { id: 'sqyd', name: 'Square Yard', symbol: 'yd²', ratioToBase: 0.83612736 },
      { id: 'sqft', name: 'Square Foot', symbol: 'ft²', ratioToBase: 0.09290304 },
      { id: 'sqin', name: 'Square Inch', symbol: 'in²', ratioToBase: 0.00064516 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', ratioToBase: 10000 },
      { id: 'ac', name: 'Acre', symbol: 'ac', ratioToBase: 4046.8564224 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    iconName: 'Box',
    baseUnit: 'L',
    units: [
      { id: 'cum', name: 'Cubic Meter', symbol: 'm³', ratioToBase: 1000 },
      { id: 'L', name: 'Liter', symbol: 'L', ratioToBase: 1 },
      { id: 'mL', name: 'Milliliter', symbol: 'mL', ratioToBase: 0.001 },
      { id: 'gal', name: 'US Gallon', symbol: 'gal', ratioToBase: 3.785411784 },
      { id: 'qt', name: 'US Quart', symbol: 'qt', ratioToBase: 0.946352946 },
      { id: 'pt', name: 'US Pint', symbol: 'pt', ratioToBase: 0.473176473 },
      { id: 'cup', name: 'US Cup', symbol: 'cup', ratioToBase: 0.2365882365 },
      { id: 'floz', name: 'Fluid Ounce', symbol: 'fl oz', ratioToBase: 0.0295735295625 },
      { id: 'tbsp', name: 'Tablespoon', symbol: 'tbsp', ratioToBase: 0.01478676478125 },
      { id: 'tsp', name: 'Teaspoon', symbol: 'tsp', ratioToBase: 0.00492892159375 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    iconName: 'Gauge',
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'Meters / second', symbol: 'm/s', ratioToBase: 1 },
      { id: 'kmh', name: 'Kilometers / hour', symbol: 'km/h', ratioToBase: 1 / 3.6 },
      { id: 'mph', name: 'Miles / hour', symbol: 'mph', ratioToBase: 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', ratioToBase: 0.51444444444 },
      { id: 'mach', name: 'Mach (sea level)', symbol: 'Ma', ratioToBase: 340.29 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    iconName: 'Clock',
    baseUnit: 's',
    units: [
      { id: 'yr', name: 'Year (365.25 d)', symbol: 'yr', ratioToBase: 31557600 },
      { id: 'mo', name: 'Month (avg)', symbol: 'mo', ratioToBase: 2629800 },
      { id: 'wk', name: 'Week', symbol: 'wk', ratioToBase: 604800 },
      { id: 'd', name: 'Day', symbol: 'd', ratioToBase: 86400 },
      { id: 'hr', name: 'Hour', symbol: 'h', ratioToBase: 3600 },
      { id: 'min', name: 'Minute', symbol: 'min', ratioToBase: 60 },
      { id: 's', name: 'Second', symbol: 's', ratioToBase: 1 },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', ratioToBase: 0.001 },
      { id: 'us', name: 'Microsecond', symbol: 'µs', ratioToBase: 1e-6 },
      { id: 'ns', name: 'Nanosecond', symbol: 'ns', ratioToBase: 1e-9 },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    iconName: 'Compass',
    baseUnit: 'Pa',
    units: [
      { id: 'Pa', name: 'Pascal', symbol: 'Pa', ratioToBase: 1 },
      { id: 'kPa', name: 'Kilopascal', symbol: 'kPa', ratioToBase: 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', ratioToBase: 100000 },
      { id: 'psi', name: 'Pound / sq inch', symbol: 'psi', ratioToBase: 6894.757293 },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', ratioToBase: 101325 },
      { id: 'torr', name: 'Torr / mmHg', symbol: 'Torr', ratioToBase: 133.32236842 },
    ],
  },
];

export function convertUnits(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  categoryId: string
): number {
  if (isNaN(value)) return NaN;
  if (fromUnitId === toUnitId) return value;

  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return NaN;

  // Temperature special conversion
  if (categoryId === 'temperature') {
    let inCelsius: number;
    if (fromUnitId === 'C') inCelsius = value;
    else if (fromUnitId === 'F') inCelsius = ((value - 32) * 5) / 9;
    else if (fromUnitId === 'K') inCelsius = value - 273.15;
    else return NaN;

    if (toUnitId === 'C') return inCelsius;
    if (toUnitId === 'F') return (inCelsius * 9) / 5 + 32;
    if (toUnitId === 'K') return inCelsius + 273.15;
    return NaN;
  }

  // Standard ratio conversions
  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);
  if (!fromUnit || !toUnit) return NaN;

  const baseValue = value * fromUnit.ratioToBase;
  return baseValue / toUnit.ratioToBase;
}
