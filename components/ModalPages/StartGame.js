import React from 'react'
import { set } from '../../lib/State'

export default function StartGame() {
    return (<>
        <div>
            <label>current bet</label>
            <input />
        </div>
        <button onClick={() => set(false, 'modalVisible')}>Start Game with Current Bet</button>
    </>)
}
