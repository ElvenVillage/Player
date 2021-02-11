import { action } from 'easy-peasy';

export default {
    lastSeemed: {},//id последнего выданного сервером пакета
    updateLastSeemed: action(((state, payload) => {
        state.lastSeemed[payload.id] = payload.value
    }))
}