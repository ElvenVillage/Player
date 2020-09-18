import { action } from 'easy-peasy';

export default {
    boats: [], // {name, currentBoatSpeed, currentBoatCoords, coords, color, center}
    setCurrentBoatCoords: action((state, payload) => {
        if (!payload) return;
        const { id, currentBoatCoords } = payload;
        state.boats[id].currentBoatCoords = currentBoatCoords;
    }),
    appendDataToBoat: action(((state, payload) => {
        const { id, append } = payload
        state.boats[id].data = [...state.boats[id].data, ...append]
    })),
    clearBoatsState: action((state, payload) => {
        state.boats = [];
        state.startLine = [];
        state.isPlacing = false;
    }),
    setupBoat: action((state, payload) => {
        console.log(payload)
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
    })
}