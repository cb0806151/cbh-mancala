import React from 'react'

export default function House({houseIndex, pieces}) {
    return (<>
        <button id={houseIndex} disabled={pieces === 0 ? true : false}>{pieces}</button>
    </>)
}