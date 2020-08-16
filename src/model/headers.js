import { action } from 'easy-peasy'

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
            state.selectedHeaders.push(payload)
        }
    }),

    clearHeaders: action((state, payload) => {
        state.headers = []
    }),

    selectHeaders: action((state, payload) => {
        state.selectedHeaders = payload
    })
}