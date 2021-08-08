import React, { useRef } from 'react'
import { Button, Form, Modal, TextArea } from 'semantic-ui-react'
import { attachToContract } from '../../lib/Layers/Contract'
import { set } from '../../lib/StateManagement/State'
import HowToPlay from './HowToPlay'

export default function JoinGame() {
    const textArea = useRef()

    const joinGame = (ctcInfoString) => {
        attachToContract(ctcInfoString)
        set(false, 'modalVisible')
    }

    return (<>
        <Modal.Content>
            <form className="ui form">
                <textarea placeholder="Paste invite in this box" rows="3" ref={textArea}></textarea>
            </form>
        </Modal.Content>
        <Modal.Actions>
            <Button negative onClick={() => set(<HowToPlay/>, 'modalPage')}>Back</Button>
            <Button positive onClick={() => joinGame(textArea.current.value)}>Join Game</Button>
        </Modal.Actions>
    </>)
}
