import React, { useState } from 'react'
import { deploy } from '../../lib/Layers/Contract'
import { set } from '../../lib/StateManagement/State'
import Invite from './Invite'

export default function StartGame() {
    const [bet, setBet] = useState(0)

    const startGame = async () => {
        set(bet, 'initialBet')
        await deploy()
        set("", 'loadingMessage')
        set(<Invite/>, 'modalPage')
    }

    return (<>
        <div>
            <label>current bet</label>
            <input value={bet} onChange={(event) => setBet(event.target.value.replace(/\D/,''))}/>
        </div>
        <button onClick={() => startGame()}>Start Game with Current Bet</button>
    </>)
}
