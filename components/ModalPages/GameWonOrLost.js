import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { get, set } from '../../lib/StateManagement/State'
import JoinGame from './JoinGame'
import StartGame from './StartGame'

export default function GameWonOrLost() {
    const gameEndMessage = get('gameEndMessage')

    return (<>
        <Modal.Content>
            <p>{gameEndMessage}</p>
        </Modal.Content>
        <Modal.Actions>
            <Button negative onClick={() => set(false, 'modalVisible')}>Close</Button>
            <Button positive onClick={() => set(<StartGame/>, 'modalPage')}>Start a New Game</Button>
            <Button positive onClick={() => set(<JoinGame/>, 'modalPage')}>Join a New Game</Button>
        </Modal.Actions>
    </>)
}
