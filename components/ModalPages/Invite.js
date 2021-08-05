import React, { useState, useEffect } from 'react'
import { stateQuery } from '../../lib/StateManagement/State'

export default function Invite() {
    const [inviteString, setInviteString] = useState();

    useEffect(() => {
        const subscription = stateQuery.select('inviteString').subscribe(setInviteString)
        return () => subscription.unsubscribe()
    }, [])

    return (<>
        <p>Send this invite to someone so that they can join the game.</p>
        <textarea value={inviteString} readOnly></textarea>
        <p>Once they join the game, this window will close and you can start the game.</p>
    </>)
}
