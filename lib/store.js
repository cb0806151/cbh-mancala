import { createEntityStore } from '@datorama/akita';

const initialState = {
    account: {},
    balance: 0
}

export const stateStore = createEntityStore(initialState, {
    name: 'state'
})