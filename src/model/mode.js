import { action } from 'easy-peasy';

export default {
    mode: 0,
    setMode: action((state, payload) => {
        state.mode = payload;
    }),
    clearModeState: action((state, payload) => {
        state.mode = 0;
    })
}