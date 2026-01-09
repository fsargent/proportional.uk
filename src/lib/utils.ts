// Utility functions for Proportional.uk

/**
 * Clamp a value between 0 and 1
 */
export function clamp01(x: number): number {
	return Math.max(0, Math.min(1, x));
}

/**
 * Generate a normally distributed random number using Box-Muller transform
 */
export function normalRandom(mean = 0, std = 1): number {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	return mean + z * std;
}

/**
 * Format a number as a percentage
 */
export function formatPercent(n: number): string {
	return (n * 100).toFixed(1) + '%';
}

/**
 * Parse a clean integer from a string
 */
export function parseClean(s: string): number {
	return parseInt(String(s).replace(/[^0-9]/g, '') || '0', 10);
}

/**
 * Format a number with locale-aware separators
 */
export function formatNumber(n: number): string {
	return Math.round(n).toLocaleString();
}
