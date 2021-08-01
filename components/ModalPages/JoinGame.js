import React from 'react'
import { set } from '../../lib/State'

export default function JoinGame() {
    return (<>
        <p>paste invite in box below</p>
        <textarea></textarea>
        <button onClick={() => set(false, 'modalVisible')}>Join Game</button>
    </>)
}
