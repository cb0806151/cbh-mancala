import React from 'react'
import { set } from '../../lib/StateManagement/State'
import StartOrJoinGame from './StartOrJoinGame'

export default function GameWonOrLost() {
    return (<>
        <p>Evie wins the game and takes home 2 CFX</p>
        <button onClick={() => set(<StartOrJoinGame></StartOrJoinGame>, 'modalPage')}>New Game</button>
        <button onClick={() => set(false, 'modalVisible')}>Quit</button>
    </>)
}
