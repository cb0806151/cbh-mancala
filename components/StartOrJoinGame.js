import React from 'react'
import HowToPlay from './HowToPlay'
import { set } from '../lib/State'

export default function StartOrJoinGame() {
    return (<>
        <button>Start Game</button>
        <button>Join Game</button>
        <button onClick={() => set(<HowToPlay></HowToPlay>, 'modalPage')}>Back</button>
    </>)
}