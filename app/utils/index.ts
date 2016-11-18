'use strict';
import exceptions from './exceptions';

export function getShortInteger(value) {
  const absValue = Math.abs(value);
  if (absValue < 1e3) return value;
  if (absValue < 1e6) return `${Math.floor(value * 1e-3)}K`;
  if (absValue < 1e9) return `${Math.floor(value * 1e-6)}M`;
  if (absValue < 1e12) return `${Math.floor(value * 1e-9)}G`;
  if (absValue < 1e15) return `${Math.floor(value * 1e-12)}T`;
  return value;
}

export default function(app) {
  exceptions(app);
};
