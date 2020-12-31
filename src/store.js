import { writable } from 'svelte/store'

// TODO use cookies to store the token
// https://dev.to/rdegges/please-stop-using-local-storage-1i04
export const authToken = writable(localStorage.getItem('authToken') || null)

export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'
//export const DATETIME_FORMAT = 'dd. MM. yyyy HH:mm:ss'

// Y-m-d H:i
export const DATETIME_FORMAT_NO_SECONDS = 'yyyy-MM-dd HH:mm'
//export const DATETIME_FORMAT_NO_SECONDS = 'dd. MM. yyyy HH:mm'

//localStorage.setItem('fasts', JSON.stringify([]))

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
        fasts: fasts,
        authToken, authToken
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