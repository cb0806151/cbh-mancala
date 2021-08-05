import React from 'react';
import StartOrJoinGame from './StartOrJoinGame'
import { set } from '../../lib/StateManagement/State'

export default function HowToPlay() {
    return (<>
        <p>Mancala is a very old game</p>
        <button onClick={() => set(<StartOrJoinGame></StartOrJoinGame>, 'modalPage')}>Start or Join a Game</button>
    </>)
}