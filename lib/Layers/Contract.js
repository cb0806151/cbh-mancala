import { stateQuery, set, get } from '../StateManagement/State'
import * as backend from '../contract/build/index.main.mjs'
import { loadStdlib } from '@reach-sh/stdlib'
import GameWonOrLost from '../../components/ModalPages/GameWonOrLost';
import { defaultBoard, defaultPoints, gameEndMessages, loadingMessages } from '../Constants';
const reach = loadStdlib('CFX');

export const deploy = async () => {
    set(true, 'isAlice')
    set(loadingMessages['deploying'], 'loadingMessage')
    set(true, 'gameInProgress')
    const account = get('account')
    const ctc = account.deploy(backend)
    backend.Alice(ctc, { gameEnds, getMove, getBet, ...reach.hasRandom, })
    const ctcInfo = await ctc.getInfo()
    const ctcInfoString = JSON.stringify(ctcInfo, null, 2)
    set(ctcInfoString,'inviteString')
}

export const attachToContract = (ctcInfoStr) => {
    set(false, 'isAlice')
    set(true, 'gameInProgress')
    const account = get('account')
    const ctc = account.attach(backend, JSON.parse(ctcInfoStr));
    backend.Bob(ctc, { gameEnds, getMove, acceptBet, relayState, ...reach.hasRandom, });
    set(loadingMessages['coinFlipping'], 'loadingMessage')
}

export const gameEnds = (messagesIndex) => {
    set(gameEndMessages[messagesIndex], 'gameEndMessage')
    set(defaultBoard, 'board')
    set(defaultPoints, 'points')
    set(<GameWonOrLost/>, 'modalPage')
    set(true, 'modalVisible')
    set(false, 'gameInProgress')
}

export const getMove = async (state) => {
    const board = state.board.map(value => reach.bigNumberToNumber(value))
    const points = state.points.map(value => reach.bigNumberToNumber(value))
    const refs = get('userHouseRefs')
    const usersHouses = refs[state.currentTurnIndex].current
    set("", 'loadingMessage')
    set(false, 'modalVisible')
    set(true, 'mayTakeTurn')
    set(board, 'board')
    set(points, 'points')
    
    const movedHouseIndex = await new Promise((resolve) => {
        usersHouses.addEventListener("click", (e) => resolve(e.target.id), {
            once: true,
        });
    });
    
    updateBoardAndPoints(board, points, movedHouseIndex, state.currentTurnIndex)
    set(false, 'mayTakeTurn')
    set(loadingMessages['waitingOnOtherPlayer'], 'loadingMessage')
    return movedHouseIndex;
}

export const getBet = () => {
    return reach.parseCurrency(get('initialBet'))
}

const updateBoardAndPoints = (board, points, houseIndex, currentTurnIndex) => {
    const piecesCount = board[houseIndex]
    const pointsEarned = updatePoints(points, piecesCount, houseIndex, currentTurnIndex)
    const updatedPiecesCount = piecesCount - pointsEarned
    updateBoard(board, houseIndex, updatedPiecesCount)
}

const updateBoard = (board, houseIndex, piecesCount) => {
    board[houseIndex] = 0
    const updatedBoard = board.map((originalPiecesCount, targetHouseIndex) => {
        const actualDistance = targetHouseIndex <= houseIndex ? (12 - houseIndex) + targetHouseIndex : targetHouseIndex - houseIndex;
        if (piecesCount < actualDistance) return originalPiecesCount;
        const newPieces = Math.floor(((piecesCount - actualDistance) / 12) + 1)
        const newPiecesCount = originalPiecesCount + newPieces
        return newPiecesCount
    })
    
    set(updatedBoard, 'board')
}

const updatePoints = (points, piecesCount, houseIndex, currentTurnIndex) => {
    const turnaroundPoint = currentTurnIndex == 0 ? 12 : 6;
    const actualDistance = turnaroundPoint < houseIndex ? (13 - houseIndex) + turnaroundPoint : turnaroundPoint - houseIndex;
    if (piecesCount < actualDistance) return 0;
    const laps = Math.floor(((piecesCount - actualDistance) / 12) + 1)
    points[currentTurnIndex] = points[currentTurnIndex] + laps
    set(points, 'points')
    return laps
}