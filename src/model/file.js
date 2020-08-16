import { action } from 'easy-peasy';

export default {
    fileName: "",
    setFileName: action((state, payload) => {
        state.fileName = payload;
    }),
    clearFileState: action((state, payload) => {
        state.fileName = "";
        state.data = null;
        state.headers = null;
    })
}