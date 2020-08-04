import { action } from 'easy-peasy';

export default {
    boats: [], // {name, currentBoatSpeed, currentBoatCoords, coords, color, center}
    setCurrentBoatCoords: action((state, payload) => {
        if (!payload) return;
        const { id, currentBoatCoords } = payload;
        state.boats[id].currentBoatCoords = currentBoatCoords;
    }),
    clearBoatsState: action((state, payload) => {
        state.boats = [];
        state.startLine = [];
        state.isPlacing = false;
    }),
    setupBoat: action((state, payload) => {
        if (!payload) return;
        state.boats.push({...payload});
    }),
    updateBoat: action((state, payload) => {
        if (!payload) return;
        const {id} = payload; 
        state.boats[id] = payload.boat;
    }),
    setCurrentBoatsSpeed: action((state, payload) => {
        if (!payload || payload.length === 0) return;
        payload.forEach((speed, ind) => state.boats[ind].currentBoatSpeed = speed);
    }),
    startLine: [],
    setStartLine: action((state, payload) => {
        if (!payload) return;
        if (state.startLine.length === 2) {
            state.isPlacing = false;
            return;
        }
        state.startLine.push(payload);
        if (state.startLine.length === 2) {
            state.isPlacing = false;
            return;
        }
    }),
    updateStartLine: action((state, payload) => {
        if (!payload) return;
        if (payload.id > state.startLine.length - 1) return;
        state.startLine[payload.id] = payload.coords;
    }),
    isPlacing: false,
    setPlacing: action((state, payload) => {
        state.isPlacing  = payload;
    })
}