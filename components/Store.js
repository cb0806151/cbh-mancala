import React from 'react'
import { Label } from 'semantic-ui-react'

export default function Store({points, name, color}) {
    return (<>
        <Label className={`${color} big`}>{name}<br/>{points}</Label>
    </>)
}