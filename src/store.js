import { writable } from "svelte/store";

export const active = writable("stopwatch"); // info, stopwatch
export const drawer = writable(false);