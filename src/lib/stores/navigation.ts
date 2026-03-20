// Navigation store for managing user's system choice
import { writable, derived } from 'svelte/store';

export type VotingSystem =
	| 'single-winner-approval'
	| 'ams-plus'
	| 'proportional-approval'
	| null;

export type ReadingMode = 'pager' | 'all';

// The user's chosen voting system to explore
export const selectedSystem = writable<VotingSystem>(null);

// The current homepage reading mode
export const readingMode = writable<ReadingMode>('pager');

// Whether the user has made a choice
export const hasChosenSystem = derived(
	selectedSystem,
	($selectedSystem) => $selectedSystem !== null
);

// Helper to reset the choice
export function resetChoice(): void {
	selectedSystem.set(null);
}

// Helper to select a system
export function selectSystem(system: VotingSystem): void {
	selectedSystem.set(system);
}

// Helper to switch homepage reading mode
export function setReadingMode(mode: ReadingMode): void {
	readingMode.set(mode);
}
