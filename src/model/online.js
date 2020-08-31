import { action } from 'easy-peasy';

export default {
    started: 'false',
    setStarted: action(((state, payload) => {
        state.started = payload
    })),

    lastSeemed: {},
    updateLastSeemed: action(((state, payload) => {
        state.lastSeemed[payload.id] = payload.value
    }))
}