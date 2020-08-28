import { action } from 'easy-peasy';

export default {
    started: 'false',
    setStarted: action(((state, payload) => {
        state.started = payload
    }))
}