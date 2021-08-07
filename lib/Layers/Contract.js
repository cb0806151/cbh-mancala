import { stateQuery, set, get } from '../StateManagement/State'
import * as backend from '../contract/build/index.main.mjs'
import { loadStdlib } from '@reach-sh/stdlib'
const reach = loadStdlib('ETH');

export const deploy = async () => {
    const account = get('account')
    const ctc = account.deploy(backend)
    backend.Alice(ctc, { gameEnds, getMove, getBet })
    const ctcInfo = await ctc.getInfo()
    const ctcInfoString = JSON.stringify(ctcInfo, null, 2)
    set(ctcInfoString,'inviteString')
}

export const attachToContract = (ctcInfoStr) => {
    set(false, 'isAlice')
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
    set(false, 'modalVisible')
    set(true, 'mayTakeTurn')
    set(state.board.map(value => reach.bigNumberToNumber(value)), 'board')
    set(state.points.map(value => reach.bigNumberToNumber(value)), 'points')
    const refs = get('userHouseRefs')
    const usersHouses = refs[state.currentTurnIndex].current
    const houseIndex = await new Promise((resolve) => {
        usersHouses.addEventListener("click", (e) => resolve(e.target.id), {
            once: true,
        });
    });
    set(false, 'mayTakeTurn')
    return houseIndex;
}

export const getBet = () => {
    let bet = get('initialBet')
    return {
        initialBet: 1,
        deadline: 10
    }
}