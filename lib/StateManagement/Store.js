import { createEntityStore } from '@datorama/akita';
import { defaultBoard, defaultPoints } from '../Constants';

const initialState = {
    account: null,
    balance: 0,
    modalPage: null,
    modalVisible: false,
    inviteString: "",
    initialBet: 0,
    userHouseRefs: null,
    board: defaultBoard,
    points: defaultPoints,
    mayTakeTurn: false,
    isAlice: true,
    gameEndMessage: "",
    loadingMessage: "",
    gameInProgress: false,
}

export const stateStore = createEntityStore(initialState, {
    name: 'state'
})