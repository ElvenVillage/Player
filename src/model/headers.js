import {action} from 'easy-peasy'
/*
* Заголовки таблицы (отображаемые поля)
*/

export default {
    headers: [],
    selectedHeaders: [],

    setHeaders: action((state, payload) => {
        if (!payload) return
        state.headers = payload
    }),

    selectHeader: action((state, payload) => {
        if (state.selectedHeaders.includes(payload)) {
            state.selectedHeaders = state.selectedHeaders.filter(header => header != payload)
        } else {
            if (state.selectedHeaders.length >= 4)
                return
            else
                state.selectedHeaders = state.headers
                    .filter(header => ((header == payload) || (state.selectedHeaders.includes(header))))
        }
    }),

    clearHeaders: action((state, payload) => {
        state.headers = []
    }),

    selectHeaders: action((state, payload) => {
        state.selectedHeaders = payload
    })
}