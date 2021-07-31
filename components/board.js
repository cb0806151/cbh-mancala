import React from 'react'
import Store from './Store'
import House from './House'

export default function Board() {
    let board = [4,4,4,4,4,4,4,4,4,4,4,4]
    let points = [0, 0]
    return (<>
        <div>
            <Store points={points[0]}></Store>
            {
                board.slice(6).map((value, index) => <House key={index} houseIndex={index} pieces={value}></House>)
            }
            <br/>
            {
                board.slice(0, 6).map((value, index) => <House key={index} houseIndex={index} pieces={value}></House>)
            }
            <Store points={points[1]}></Store>
        </div>
    </>)
}