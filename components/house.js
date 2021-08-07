import React from 'react'

export default function House({houseIndex, mayTakeTurn, notMyHouses, pieces}) {
    return (<>
        <button id={houseIndex} disabled={(notMyHouses || (pieces === 0 || !mayTakeTurn)) ? true : false}>{pieces}</button>
    </>)
}