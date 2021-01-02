import { writable } from 'svelte/store'

// this format is compatible with fns parseISO
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'
//export const DATETIME_FORMAT = 'dd. MM. yyyy HH:mm:ss'

export const active = writable(localStorage.getItem('active') || 'info') // info, stopwatch, history, import

export const drawer = writable(false)

export const fastingHours = writable(localStorage.getItem('fastingHours') || 16)

export const fastStarted = writable(localStorage.getItem('fastStarted') || null)

export const fastEnded = writable(localStorage.getItem('fastEnded') || null)


console.log('localStorage.getItem(fasts)='+localStorage.getItem('fasts'))
export const fasts = writable(localStorage.getItem('fasts') !== null ? JSON.parse(localStorage.getItem('fasts')) : [])

export function setStore(name, value) {
    const stores = {
        active: active,
        drawer: drawer,
        fastingHours: fastingHours,
        fastStarted: fastStarted,
        fastEnded: fastEnded,
        fasts: fasts
    }

    if (!Object.prototype.hasOwnProperty.call(stores, name)) {
        throw new Error('Unknown store: ' + name)
    }

    if (name === 'fasts') {    
        console.log('saving=', JSON.stringify(value))
        localStorage.setItem(name, JSON.stringify(value))
    } else {
        localStorage.setItem(name, value)
    }
    stores[name].set(value)
}