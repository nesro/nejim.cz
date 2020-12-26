import { writable } from 'svelte/store'

export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'
//export const DATETIME_FORMAT = 'dd. MM. yyyy HH:mm:ss'

// Y-m-d H:i
export const DATETIME_FORMAT_NO_SECONDS = 'yyyy-MM-dd HH:mm'
//export const DATETIME_FORMAT_NO_SECONDS = 'dd. MM. yyyy HH:mm'


export const active = writable(localStorage.getItem("active") || 'info') // info, stopwatch, history, import

export const drawer = writable(false)

export const fastingHours = writable(localStorage.getItem("fastingHours") || 16)

export const fastStarted = writable(localStorage.getItem("fastStarted") || null)

export const fastEnded = writable(localStorage.getItem("fastEnded") || null)

export const fasts = writable(localStorage.getItem("fasts") || [])