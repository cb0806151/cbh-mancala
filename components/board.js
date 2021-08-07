import React, { useEffect, useRef, useState } from 'react'
import Store from './Store'
import House from './House'
import { stateQuery, set } from '../lib/StateManagement/State'

export default function Board() {
    const [board, setBoard] = useState([4,4,4,4,4,4,4,4,4,4,4,4])
    const [points, setPoints] = useState([0, 0])
    const alicesHouses = useRef()
    const bobsHouses = useRef()

    useEffect(() => {
        set([alicesHouses, bobsHouses], 'userHouseRefs')
        const board$ = stateQuery.select('board').subscribe(setBoard)
        const points$ = stateQuery.select('points').subscribe(setPoints)
        return () => {
            board$.unsubscribe()
            points$.unsubscribe()
        }
    }, [])

    return (<>
        <div>
            <Store points={points[0]}></Store>
            <div ref={alicesHouses}>
                {
                    (board.slice(6).map((value, index) => <House key={index} houseIndex={index+6} pieces={value}></House>)).reverse()
                }
            </div>
            <div ref={bobsHouses}>
                {
                    board.slice(0, 6).map((value, index) => <House key={index} houseIndex={index} pieces={value}></House>)
                }
            </div>
            <Store points={points[1]}></Store>
        </div>
    </>)
}