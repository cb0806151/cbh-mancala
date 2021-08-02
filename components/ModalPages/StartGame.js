import React, { useState } from 'react'
import { deploy } from '../../lib/ContractLayer'
import { set } from '../../lib/State'
import Invite from './Invite'

export default function StartGame() {
    const [bet, setBet] = useState(0)

    const startGame = async () => {
        // TODO validate bet value
        // TODO display loading icon while contract deploys
        set(bet, 'initialBet')
        await deploy()
        set(<Invite></Invite>, 'modalPage')
    }

    return (<>
        <div>
            <label>current bet</label>
            <input value={bet} onChange={(event) => setBet(event.target.value.replace(/\D/,''))}/>
        </div>
        <button onClick={() => startGame()}>Start Game with Current Bet</button>
    </>)
}
