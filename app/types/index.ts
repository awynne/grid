// GridPulse Type Definitions

export interface BalancingAuthority {
  id: string;
  code: string;
  name: string;
  timezone: string;
  region?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FeatureCardStatus = 'placeholder' | 'coming-soon' | 'active';

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  href: string;
  status: FeatureCardStatus;
}

export interface FreshnessBadgeProps {
  lastUpdated?: Date;
  status: 'fresh' | 'stale' | 'very-stale' | 'missing';
}

// Component Variant Types (using cva)
export type CardSize = 'sm' | 'md' | 'lg';
export type CardPriority = 'low' | 'medium' | 'high';
export type CardColumns = 1 | 2 | 3;