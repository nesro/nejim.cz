import { writable } from 'svelte/store'

export const active = writable(localStorage.getItem("active") || 'info') // info, stopwatch, history, import

export const drawer = writable(false)

export const fastingHours = writable(16)

export const fastStarted = writable(localStorage.getItem("fastStarted") || null)

export const fasts = writable(localStorage.getItem("fasts") || [])