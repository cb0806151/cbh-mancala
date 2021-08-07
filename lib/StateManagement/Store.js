import { createEntityStore } from '@datorama/akita';
import HowToPlay from '../../components/ModalPages/HowToPlay';

const initialState = {
    account: null,
    balance: 0,
    modalPage: <HowToPlay></HowToPlay>,
    modalVisible: false,
    inviteString: "",
    initialBet: 0,
    userHouseRefs: null,
    board: [4,4,4,4,4,4,4,4,4,4,4,4],
    points: [0, 0],
    mayTakeTurn: false,
    isAlice: true,
}

export const stateStore = createEntityStore(initialState, {
    name: 'state'
})