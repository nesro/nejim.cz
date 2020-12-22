import { writable } from 'svelte/store'

export const active = writable('history') // info, stopwatch, history

export const drawer = writable(false)

export const fastingHours = writable(16)

export const fastStarted = writable(localStorage.getItem("fastStarted") || null)