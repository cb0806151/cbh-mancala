import React from 'react'
import { set } from '../../lib/StateManagement/State'
import StartGame from './StartGame'
import JoinGame from './JoinGame'

export default function StartOrJoinGame() {
    return (<>
        <button onClick={() => set(<StartGame/>, 'modalPage')}>Start Game</button>
        <button onClick={() => set(<JoinGame/>, 'modalPage')}>Join Game</button>
    </>)
}