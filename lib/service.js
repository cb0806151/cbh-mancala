import { stateStore } from './Store';

export function set(value, field) {
    stateStore.update(state => {
        let newState = {...state}
        newState[field] = value
        return newState
    })
}