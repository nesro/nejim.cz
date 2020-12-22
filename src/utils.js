function timestampToHMS(timestamp) {
    const timestampSeconds = Math.floor(timestamp)
    return {
        fH: Math.floor(timestampSeconds / 60 / 60),
	    fM: Math.floor(timestampSeconds / 60 % 60),
	    fS: Math.floor(timestampSeconds % 60),
    }
}

export {timestampToHMS}