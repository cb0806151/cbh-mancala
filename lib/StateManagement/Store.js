import { createEntityStore } from '@datorama/akita';
import HowToPlay from '../../components/ModalPages/HowToPlay';
import { defaultBoard, defaultPoints } from '../Constants';

const initialState = {
    account: null,
    balance: 0,
    modalPage: <HowToPlay/>,
    modalVisible: false,
    inviteString: "",
    initialBet: 0,
    userHouseRefs: null,
    board: defaultBoard,
    points: defaultPoints,
    mayTakeTurn: false,
    isAlice: true,
    gameEndMessage: "",
}

export const stateStore = createEntityStore(initialState, {
    name: 'state'
})