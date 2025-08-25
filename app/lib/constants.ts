// GridPulse Constants for Development

export const BALANCING_AUTHORITIES = [
  { code: 'CAISO', name: 'California ISO' },
  { code: 'ERCOT', name: 'Electric Reliability Council of Texas' },
  { code: 'PJM', name: 'PJM Interconnection' },
  { code: 'MISO', name: 'Midcontinent ISO' },
  { code: 'SPP', name: 'Southwest Power Pool' },
] as const;

export const FUEL_TYPES = {
  SOLAR: { color: 'hsl(var(--fuel-solar))', name: 'Solar' },
  WIND: { color: 'hsl(var(--fuel-wind))', name: 'Wind' },
  GAS: { color: 'hsl(var(--fuel-gas))', name: 'Natural Gas' },
  COAL: { color: 'hsl(var(--fuel-coal))', name: 'Coal' },
  NUCLEAR: { color: 'hsl(var(--fuel-nuclear))', name: 'Nuclear' },
  HYDRO: { color: 'hsl(var(--fuel-hydro))', name: 'Hydro' },
} as const;

export const FEATURE_CARDS = [
  {
    id: 'daily',
    title: 'Daily Pulse',
    description: 'Auto-generated daily narrative with annotated chart',
    href: '/daily',
    status: 'placeholder' as const,
  },
  {
    id: 'wpm',
    title: "What's Powering Me",
    description: 'Current CO₂ intensity and next clean window',
    href: '/wpm',
    status: 'placeholder' as const,
  },
  {
    id: 'ducks',
    title: 'Duck Days',
    description: 'Discoverable gallery of duck curve patterns',
    href: '/ducks',
    status: 'placeholder' as const,
  },
  {
    id: 'diff',
    title: 'What Changed',
    description: 'Daily diff cards vs baseline metrics',
    href: '/diff',
    status: 'placeholder' as const,
  },
] as const;