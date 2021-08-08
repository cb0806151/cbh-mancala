import React, { useState, useEffect } from 'react'
import { Button, Form, Modal, TextArea } from 'semantic-ui-react';
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
        <Modal.Content>
            <p>Send this invite to someone so that they can join the game.</p>
            <Form>
                <TextArea value={inviteString} readOnly></TextArea>
            </Form>
            <Button onClick={copyInviteLink}>Copy Invite</Button>
            <p>Once they join the game, a coin will flip to determine who goes first, then this window will close, and you can start the game.</p>
        </Modal.Content>
    </>)
}
