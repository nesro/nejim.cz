import { writable } from "svelte/store";

export const active = writable("info");
export const drawer = writable(false);