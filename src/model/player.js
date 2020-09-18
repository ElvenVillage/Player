import { action } from 'easy-peasy';

export default {
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
    }),
    setCurrentTime: action((state, payload) => {
        if (!payload) return;
        if (payload > state.endTime) return;
        state.currentTime = payload;
    }),
    setPlayer: action((state, payload) => {
        if (!payload) return;
        state.endTime = payload.endTime;
    }),
    clearPlayerState: action((state, payload) => {
        state.currentTime = 0;
        state.startTime = null;
        state.endTime = null;
    })
}