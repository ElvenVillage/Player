import { action } from 'easy-peasy';

export default {
    url: localStorage.getItem('app-fetch-url') || 'localhost:8000',
    changeURL: action((state, payload) => {
        if (!payload) return;
        state.url = payload;
        localStorage.setItem('app-fetch-url', payload);
    }),
    clearUrlState: action((state, payload) => {
        state.url = localStorage.getItem('app-fetch-url') || 'localhost:8000';
    })
}