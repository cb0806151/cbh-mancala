import React from 'react'
import { set } from '../../lib/State'
import StartGame from './StartGame'
import JoinGame from './JoinGame'

export default function StartOrJoinGame() {
    return (<>
        <button onClick={() => set(<StartGame></StartGame>, 'modalPage')}>Start Game</button>
        <button onClick={() => set(<JoinGame></JoinGame>, 'modalPage')}>Join Game</button>
    </>)
}