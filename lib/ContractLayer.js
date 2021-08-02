import { stateQuery, set, get } from './State'
import * as backend from '../contract/build/index.main.mjs'

export const deploy = async () => {
    let account = get('account')
    const ctc = account.deploy(backend)
    backend.Auctioneer(ctc, { gameEnds, getMove, getBet })
    const ctcInfoString = JSON.stringify(await ctc.getInfo(), null, 2)
    set('inviteString', ctcInfoString)
}

export const gameEnds = () => {
    console.log("the game has ended")
}

export const getMove = async (state) => {
    console.table(state)
}

export const getBet = () => {
    return {
        initialBet: get('initialBet'),
        deadline: 10
    }
}