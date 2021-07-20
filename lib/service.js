import { stateStore } from './store';

export function set(value, field) {
    stateStore.update(state => {
        let newState = {...state}
        newState[field] = value
        return newState
    })
}