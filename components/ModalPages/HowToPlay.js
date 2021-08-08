import React from 'react';
import { set } from '../../lib/StateManagement/State'
import { Button, Modal } from 'semantic-ui-react';
import StartGame from './StartGame';
import JoinGame from './JoinGame';

export default function HowToPlay() {
    return (<>
        <Modal.Content>
            <p>
                Mancala is a family of games with some similarities; the specific variant here is a modified version of Kalah. The board is made up of twelve houses, that each start with four pieces, and one store on each side. 
                Each player owns one store and half of the houses on the board.<br/>Every turn, a player disperses the pieces from a house in a counter-clockwise motion 
                around the board; dropping one in their store while ignoring the other players store.<br/>The game finishes when one side of the board is cleared
                of pieces; at that point, whichever player has more pieces in their store wins the game. Enjoy!
            </p>
        </Modal.Content>
        <Modal.Actions>
            <Button negative onClick={() => set(false, 'modalVisible')}>Close</Button>
            <Button positive onClick={() => set(<StartGame/>, 'modalPage')}>Start Game</Button>
            <Button positive onClick={() => set(<JoinGame/>, 'modalPage')}>Join Game</Button>
        </Modal.Actions>
    </>)
}