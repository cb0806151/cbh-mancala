import React, { useEffect } from 'react'
import { get, set } from '../../lib/StateManagement/State'
import StartOrJoinGame from './StartOrJoinGame'

export default function GameWonOrLost() {
    const gameEndMessage = get('gameEndMessage')

    return (<>
        <p>{gameEndMessage}</p>
        <button onClick={() => set(<StartOrJoinGame/>, 'modalPage')}>New Game</button>
    </>)
}
