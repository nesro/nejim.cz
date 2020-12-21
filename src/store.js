import { writable } from "svelte/store";

export const active = writable("stopwatch"); // info, stopwatch

export const drawer = writable(false);

export const fastingHours = writable(16);

export const fastStarted = writable(null);