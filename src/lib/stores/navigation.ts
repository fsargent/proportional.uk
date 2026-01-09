// Navigation store for managing user's system choice
import { writable, derived } from 'svelte/store';

export type VotingSystem = 'ams-plus' | 'proportional-approval' | null;

// The user's chosen voting system to explore
export const selectedSystem = writable<VotingSystem>(null);

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
