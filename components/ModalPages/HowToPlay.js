import React from 'react';
import StartOrJoinGame from './StartOrJoinGame'
import { set } from '../../lib/StateManagement/State'

export default function HowToPlay() {
    return (<>
        <p>
            Mancala is a family of games with some similarities; the specific variant here is a modified version of Kalah. The board is made up of twelve houses, that each start with four pieces, and one store on each side. 
            Each player owns one store and half of the houses on the board.<br/>Every turn, a player disperses the pieces from a house in a counter-clockwise motion 
            around the board; dropping one in their store while ignoring the other players store.<br/>The game finishes when one side of the board is cleared
            of pieces; at that point, whichever player has more pieces in their store wins the game. Enjoy!
        </p>
        <button onClick={() => set(<StartOrJoinGame/>, 'modalPage')}>Start or Join a Game</button>
    </>)
}