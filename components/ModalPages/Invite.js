import React, { useState, useEffect } from 'react'
import { stateQuery } from '../../lib/StateManagement/State'

export default function Invite() {
    const [inviteString, setInviteString] = useState();

    useEffect(() => {
        const subscription = stateQuery.select('inviteString').subscribe(setInviteString)
        return () => subscription.unsubscribe()
    }, [])

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteString);
    };

    return (<>
        <p>Send this invite to someone so that they can join the game.</p>
        <textarea value={inviteString} readOnly></textarea>
        <button onClick={copyInviteLink}>Copy Invite</button>
        <p>Once they join the game, this window will close and you can start the game.</p>
    </>)
}
