import { createEntityStore } from '@datorama/akita';
import HowToPlay from '../components/ModalPages/HowToPlay';

const initialState = {
    account: {},
    balance: 0,
    modalPage: <HowToPlay></HowToPlay>,
    modalVisible: false,
    inviteString: "",
    initialBet: 0,
}

export const stateStore = createEntityStore(initialState, {
    name: 'state'
})