import React, { useState } from 'react'
import { Button, Input, Modal, Dimmer, Loader } from 'semantic-ui-react'
import { deploy } from '../../lib/Layers/Contract'
import { set } from '../../lib/StateManagement/State'
import HowToPlay from './HowToPlay'
import Invite from './Invite'

export default function StartGame() {
    const [bet, setBet] = useState(0)
    const [startingGame, setStartingGame] = useState(false)

    const startGame = async () => {
        set(bet, 'initialBet')
        setStartingGame(true)
        await deploy()
        set("", 'loadingMessage')
        set(<Invite/>, 'modalPage')
    }

    return (<>
        {startingGame ? 
            <Loader content='Starting Game...'/>
        : 
        <>
            <Modal.Content>
                <Input label="Current Bet" value={bet} onChange={(event) => setBet(parseInt(event.target.value.replace(/\D/,'')))}/>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={() => set(<HowToPlay/>, 'modalPage')}>Back</Button>
                <Button positive onClick={() => startGame()}>Start Game with Current Bet</Button>
            </Modal.Actions>
        </>
        }
    </>)
}
