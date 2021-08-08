import React, { useEffect, useRef, useState } from 'react'
import Store from './Store'
import House from './House'
import { stateQuery, set } from '../lib/StateManagement/State'
import { defaultBoard, defaultPoints } from '../lib/Constants'
import { Grid, Segment } from 'semantic-ui-react'

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
        <Segment>
            <Grid className="middle aligned">
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Store points={points[0]}/>
                    </Grid.Column>
                    <Grid.Column width={12}>
                    <Grid columns='equal'>
                        <div className="row" ref={alicesHouses}>
                            {/* <div ref={alicesHouses}> */}
                            {
                                (board.slice(6).map((value, index) => <House key={index} houseIndex={index+6} mayTakeTurn={mayTakeTurn} notMyHouses={isAlice ? false : true} pieces={value}/>)).reverse()
                            }
                            {/* </div> */}
                        </div>
                        <div className="row" ref={bobsHouses}>
                            {/* <div ref={bobsHouses}> */}
                            {
                                board.slice(0, 6).map((value, index) => <House key={index} houseIndex={index} mayTakeTurn={mayTakeTurn} notMyHouses={isAlice ? true : false} pieces={value}/>)
                            }
                            {/* </div> */}
                        </div>
                    </Grid>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Store points={points[1]}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    </>)
}