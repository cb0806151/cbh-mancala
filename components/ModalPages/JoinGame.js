import React, { useRef } from 'react'
import { attachToContract } from '../../lib/ContractLayer'
import { set } from '../../lib/State'

export default function JoinGame() {
    const textArea = useRef()

    const joinGame = (ctcInfoString) => {
        attachToContract(ctcInfoString)
        set(false, 'modalVisible')
    }

    return (<>
        <p>paste invite in box below</p>
        <textarea ref={textArea}></textarea>
        <button onClick={() => joinGame(textArea.current.value)}>Join Game</button>
    </>)
}
