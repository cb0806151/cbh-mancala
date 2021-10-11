import { stateQuery, set, get } from '../StateManagement/State'
import * as backend from './buildv1/index.main.mjs'
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
    backend.Bob(ctc, { gameEnds, getMove, ...reach.hasRandom, });
    set(loadingMessages['coinFlipping'], 'loadingMessage')
}

export const gameEnds = (messagesIndex, totalBoard) => {
    const closingMessage = `${gameEndMessages[messagesIndex]} Alice finishes with a final score of ${reach.bigNumberToNumber(totalBoard[13])} and Bob with a final score of ${reach.bigNumberToNumber(totalBoard[6])}.`
    set(closingMessage, 'gameEndMessage')
    set('', 'loadingMessage')
    set(defaultBoard, 'board')
    set(defaultPoints, 'points')
    set(<GameWonOrLost/>, 'modalPage')
    set(true, 'modalVisible')
    set(false, 'gameInProgress')
}

export const getMove = async (totalBoard, currentTurnIndex) => {
    const formattedBoard = totalBoard.map(value => reach.bigNumberToNumber(value))
    const points = [formattedBoard[13], formattedBoard[6]]
    const board = formattedBoard.slice(0, 6).concat(formattedBoard.slice(7,13))
    const refs = get('userHouseRefs')
    const usersHouses = refs[currentTurnIndex].current
    set("", 'loadingMessage')
    set(false, 'modalVisible')
    set(true, 'mayTakeTurn')
    set(board, 'board')
    set(points, 'points')
    
    let movedHouseIndex = await new Promise((resolve) => {
        usersHouses.addEventListener("click", (e) => resolve(parseInt(e.target.id)), {
            once: true,
        });
    });
    
    updateBoardAndPoints(board, points, movedHouseIndex, currentTurnIndex)
    set(false, 'mayTakeTurn')
    set(loadingMessages['waitingOnOtherPlayer'], 'loadingMessage')
    const updatedMoveHouseIndex = movedHouseIndex > 5 ? movedHouseIndex + 1 : movedHouseIndex;
    return updatedMoveHouseIndex
}

export const getBet = () => {
    return reach.parseCurrency(get('initialBet'))
}

const updateBoardAndPoints = (board, points, houseIndex, currentTurnIndex) => {
    const turnaroundPoint = currentTurnIndex == 0 ? 12 : 6;
    const piecesCount = board[houseIndex]
    const pointsEarned = updatePoints(points, piecesCount, houseIndex, currentTurnIndex, turnaroundPoint)
    const updatedPiecesCount = piecesCount - pointsEarned
    updateBoard(board, houseIndex, updatedPiecesCount)
    checkIfOppositeHouseWasTaken(houseIndex, piecesCount, turnaroundPoint, currentTurnIndex)
}

const checkIfOppositeHouseWasTaken = (houseIndex, piecesCount, turnaroundPoint, currentTurnIndex) => {
    const updatedBoard = get('board')
    const points = get('points')
    const lastHouseIndexVisited = (houseIndex + piecesCount) % 13
    
    if (lastHouseIndexVisited == turnaroundPoint) return

    const piecesInLastHouseVisited = updatedBoard[lastHouseIndexVisited]
    const lastHouseVisitedBelongsToAlice = lastHouseIndexVisited > 5;
    const houseIndexOppositeTheOneVisited = lastHouseVisitedBelongsToAlice ? (11 - lastHouseIndexVisited) : ((((5 - lastHouseIndexVisited) * 2) + 1) + lastHouseIndexVisited)
    const piecesInOppositeHouse = updatedBoard[houseIndexOppositeTheOneVisited]
    const canTakeOppositeHouse = (currentTurnIndex == 0 && lastHouseVisitedBelongsToAlice) || (currentTurnIndex == 1 && !lastHouseVisitedBelongsToAlice)

    if (canTakeOppositeHouse && piecesInOppositeHouse > 0 && piecesInLastHouseVisited == 1) {
        calculateUpdatedBoardAndPoints(updatedBoard, houseIndexOppositeTheOneVisited, points, lastHouseIndexVisited, currentTurnIndex)
    }
}

const calculateUpdatedBoardAndPoints = (updatedBoard, houseOppositeTheOneVisited, points, lastHouseIndexVisited, currentTurnIndex) => {
    const updatedPoints = updatedBoard[houseOppositeTheOneVisited] + 1
    const newStorePoints = updatedPoints + points[currentTurnIndex]
    updatedBoard[houseOppositeTheOneVisited] = 0;
    updatedBoard[lastHouseIndexVisited] = 0
    points[currentTurnIndex] = newStorePoints
    set(updatedBoard, 'board')
    set(points, 'points')
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

const updatePoints = (points, piecesCount, houseIndex, currentTurnIndex, turnaroundPoint) => {
    const actualDistance = turnaroundPoint < houseIndex ? (13 - houseIndex) + turnaroundPoint : turnaroundPoint - houseIndex;
    if (piecesCount < actualDistance) return 0;
    const laps = Math.floor(((piecesCount - actualDistance) / 12) + 1)
    points[currentTurnIndex] = points[currentTurnIndex] + laps
    set(points, 'points')
    return laps
}