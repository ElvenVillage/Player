import {action, computed} from 'easy-peasy';
import {convertBoatTimeToUTC, coordsOnTime} from "../misc/timeservice";

export default {
    boats: [], // {name, currentBoatSpeed, currentBoatCoords, coords, color, center}

    appendDataToBoat: action(((state, payload) => {
        const {id, append} = payload
        convertBoatTimeToUTC(append)
        state.boats[id].data = [...state.boats[id].data, ...append]
    })),
    clearBoatsState: action((state, payload) => {
        state.boats = [];
        state.startLine = [];
        state.isPlacing = false;
    }),
    setupBoat: action((state, payload) => {
        if (!payload) return;
        convertBoatTimeToUTC(payload)
        state.boats.push({...payload});
        console.log(payload)
        state.center = payload.coords[0]
    }),
    updateBoat: action((state, payload) => {
        if (!payload) return;
        const {id} = payload;
        state.boats[id] = payload.boat;
    }),
    center: [0, 0],
    setCenter: action((state, payload) => {
       state.center = payload
    }),
    setCurrentBoatsSpeed: action((state, payload) => {
        if (!payload || payload.length === 0) return;
        payload.forEach((speed, ind) => state.boats[ind].currentBoatSpeed = speed);
    }),
    loadingFiles: computed(state => state.countOfBoats != state.boats.length + 1),
    countOfBoats: 1,
    setCountOfBoats: action((state, payload) => {
        state.countOfBoats = payload
    }),
    progress: computed(state => state.boats.length * 100 / state.countOfBoats),
    currentTime: 0,
    visible: false,
    startTime: null,
    endTime: null,
    isReady: false,
    needToSliceRoute: false,
    setNeedToSliceRoute: action((state, payload) => {
        state.needToSliceRoute = payload
    }),
    setVisible: action(((state, payload) => {
        state.visible = payload
    })),
    setIsReady: action((state, payload) => {
        state.isReady = payload
    }),
    updatePlayer: action((state, payload) => {
        if (!payload) return;
        const endTime = Math.max(state.endTime, payload.endTime);
        state.endTime = endTime;
        state.startTime = payload.startTime

        if (state.currentTime === 0) {
            state.currentTime = payload.startTime
            for (let i = 0; i < state.boats.length; i++) {
                state.boats[i].currentBoatCoords = coordsOnTime(state.boats[i], state.currentTime)
            }
        }
    }),
    setCurrentTime: action((state, payload) => {
        if (!payload) return;
        if (payload > state.endTime) return;
        state.currentTime = payload;
        for (let i = 0; i < state.boats.length; i++) {
            state.boats[i].currentBoatCoords = coordsOnTime(state.boats[i], state.currentTime)
        }
    }),
    setPlayer: action((state, payload) => {
        if (!payload) return;
        state.endTime = payload.endTime;
        state.startTime = payload.startTime
    }),
    clearPlayerState: action((state, payload) => {
        state.currentTime = 0;
        state.startTime = null;
        state.endTime = null;
    })
}