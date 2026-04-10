import { writable } from "svelte/store";

export type VotingSystem =
  | "single-winner-approval"
  | "ams-plus"
  | "proportional-approval"
  | null;

export const selectedSystem = writable<VotingSystem>(null);
