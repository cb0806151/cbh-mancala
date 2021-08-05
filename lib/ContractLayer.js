import { stateQuery, set, get } from './State'
import * as backend from '../contract/build/index.main.mjs'

export const deploy = async () => {
    const account = get('account')
    const ctc = account.deploy(backend)
    backend.Alice(ctc, { gameEnds, getMove, getBet })
    const ctcInfo = await ctc.getInfo()
    const ctcInfoString = JSON.stringify(ctcInfo, null, 2)
    set(ctcInfoString,'inviteString')
}

export const attachToContract = (ctcInfoStr) => {
    const account = get('account')
    const ctc = account.attach(backend, JSON.parse(ctcInfoStr));
    backend.Bob(ctc, { gameEnds, getMove, acceptBet, relayState });
}

export const acceptBet = () => {
    console.log("bet was accepted")
}

export const relayState = async (state) => {
    console.log(state)
}

export const gameEnds = () => {
    console.log("the game has ended")
}

export const getMove = async (state) => {
    console.table(state)
    return 0;
}

export const getBet = () => {
    let bet = get('initialBet')
    return {
        initialBet: 1,
        deadline: 10
    }
}