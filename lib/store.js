import { createEntityStore } from '@datorama/akita';
import HowToPlay from '../components/HowToPlay';

const initialState = {
    account: {},
    balance: 0,
    modalPage: <HowToPlay></HowToPlay>
}

export const stateStore = createEntityStore(initialState, {
    name: 'state'
})