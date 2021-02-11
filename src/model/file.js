import { action } from 'easy-peasy';

/*
* Файл, загруженный пользователем локально.
*/

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