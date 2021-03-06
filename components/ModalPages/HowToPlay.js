import React from 'react';
import { set } from '../../lib/StateManagement/State'
import { Button, Modal } from 'semantic-ui-react';
import StartGame from './StartGame';
import JoinGame from './JoinGame';

export default function HowToPlay() {
    return (<>
        <Modal.Content>
            <p>
                Mancala is a family of games with some similarities; the specific variant here is a modified version of Kalah. The board is made up of twelve houses, 
                that each start with four pieces, and one store on each side. Each player owns one store and half of the houses on the board.<br/><br/>Every turn, a 
                player disperses the pieces from a house in a counter-clockwise motion around the board; when they get to their store, they&apos;ll drop a piece in 
                but they will ignore the other players store when they pass it. If a player drops the last piece they picked up into their store, they get an additional 
                move; there is no limit to the amount of additonal moves you can get using this rule.<br/><br/>The game finishes when one side of the board is 
                cleared of pieces; at that point, the remaining pieces are transfered to the store of the player whose side still had pieces. Whichever player then 
                has more pieces in their store wins the game. Enjoy!
            </p>
        </Modal.Content>
        <Modal.Actions>
            <Button negative onClick={() => set(false, 'modalVisible')}>Close</Button>
            <Button positive onClick={() => set(<StartGame/>, 'modalPage')}>Start Game</Button>
            <Button positive onClick={() => set(<JoinGame/>, 'modalPage')}>Join Game</Button>
        </Modal.Actions>
    </>)
}