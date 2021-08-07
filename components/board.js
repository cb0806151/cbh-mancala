import React, { useEffect, useRef, useState } from 'react'
import Store from './Store'
import House from './House'
import { stateQuery, set } from '../lib/StateManagement/State'
import { defaultBoard, defaultPoints } from '../lib/Constants'

export default function Board() {
    const [board, setBoard] = useState(defaultBoard)
    const [points, setPoints] = useState(defaultPoints)
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
            <Store points={points[0]}/>
            <div ref={alicesHouses}>
                {
                    (board.slice(6).map((value, index) => <House key={index} houseIndex={index+6} mayTakeTurn={mayTakeTurn} notMyHouses={isAlice ? false : true} pieces={value}/>)).reverse()
                }
            </div>
            <div ref={bobsHouses}>
                {
                    board.slice(0, 6).map((value, index) => <House key={index} houseIndex={index} mayTakeTurn={mayTakeTurn} notMyHouses={isAlice ? true : false} pieces={value}/>)
                }
            </div>
            <Store points={points[1]}/>
        </div>
    </>)
}