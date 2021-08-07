import React, { useEffect, useRef, useState } from 'react'
import Store from './Store'
import House from './House'
import { stateQuery, set } from '../lib/StateManagement/State'

export default function Board() {
    const [board, setBoard] = useState([4,4,4,4,4,4,4,4,4,4,4,4])
    const [points, setPoints] = useState([0, 0])
    const [mayTakeTurn, setMayTakeTurn] = useState(false)
    const [isAlice, setIsAlice] = useState(true)
    const alicesHouses = useRef()
    const bobsHouses = useRef()

    useEffect(() => {
        set([alicesHouses, bobsHouses], 'userHouseRefs')
        const board$ = stateQuery.select('board').subscribe(setBoard)
        const points$ = stateQuery.select('points').subscribe(setPoints)
        const mayTakeTurn$ = stateQuery.select('mayTakeTurn').subscribe(setMayTakeTurn)
        const isAlice$ = stateQuery.select('isAlice').subscribe(setIsAlice)
        return () => {
            board$.unsubscribe()
            points$.unsubscribe()
            mayTakeTurn$.unsubscribe()
            isAlice$.unsubscribe()
        }
    }, [])

    return (<>
        <div>
            <Store points={points[0]}></Store>
            <div ref={alicesHouses}>
                {
                    (board.slice(6).map((value, index) => <House key={index} houseIndex={index+6} mayTakeTurn={mayTakeTurn} notMyHouses={isAlice ? false : true} pieces={value}></House>)).reverse()
                }
            </div>
            <div ref={bobsHouses}>
                {
                    board.slice(0, 6).map((value, index) => <House key={index} houseIndex={index} mayTakeTurn={mayTakeTurn} notMyHouses={isAlice ? true : false} pieces={value}></House>)
                }
            </div>
            <Store points={points[1]}></Store>
        </div>
    </>)
}