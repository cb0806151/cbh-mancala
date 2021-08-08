import React from 'react'
import { Button, Grid } from 'semantic-ui-react'

export default function House({houseIndex, mayTakeTurn, notMyHouses, pieces}) {
    return (<>
        <Grid.Column >
            <Button circular id={houseIndex} disabled={(notMyHouses || (pieces === 0 || !mayTakeTurn)) ? true : false}>{pieces}</Button>
        </Grid.Column>
    </>)
}