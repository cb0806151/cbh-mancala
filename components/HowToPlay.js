import React from 'react';
import StartOrJoinGame from './StartOrJoinGame';
import { set } from '../lib/State'

export default function HowToPlay() {
    return (<>
        <p>Mancala is a very old game</p>
        <button onClick={() => set(<StartOrJoinGame></StartOrJoinGame>, 'modalPage')}>Next</button>
    </>)
}