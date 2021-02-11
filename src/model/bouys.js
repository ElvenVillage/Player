import {action} from 'easy-peasy';

/*
* Параметры буев сохраняются в localStorage
*/

export default {
    bouys: [],
    polyline: [],
    updateBouys: action(((state, payload) => {
        state.bouys = payload
        if ((state.bouys.lats) && (state.bouys.lats[1])) {
            state.polyline = [[state.bouys.lats[0], state.bouys.lngs[0]],
                [state.bouys.lats[1], state.bouys.lngs[1]]]
        } else state.polyline = []
        localStorage.setItem('data', JSON.stringify(payload))
    })),
    loadBouys: action(((state) => {
        try {
            state.bouys = JSON.parse(localStorage.getItem('data'))
            if ((state.bouys.lats) && (state.bouys.lats[1])) {
                state.polyline = [[state.bouys.lats[0], state.bouys.lngs[0]],
                    [state.bouys.lats[1], state.bouys.lngs[1]]]
            } else state.polyline = []
        } catch (e) {
            state.bouys = []
        }
    }))
}