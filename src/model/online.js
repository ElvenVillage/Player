import { action } from 'easy-peasy';

export default {
    lastSeemed: {},
    updateLastSeemed: action(((state, payload) => {
        state.lastSeemed[payload.id] = payload.value
    }))
}