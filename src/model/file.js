import { action } from 'easy-peasy';

export default {
    fileName: "",
    setFileName: action((state, payload) => {
        state.fileName = payload;
    }),
    headers: null,
    setHeaders: action((state, payload) => {
        if (!payload) return;
        state.headers = payload;
    }),
    clearFileState: action((state, payload) => {
        state.fileName = "";
        state.data = null;
        state.headers = null;
    })
}