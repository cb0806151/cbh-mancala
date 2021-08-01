import React, { useState, useEffect } from 'react'
import { stateQuery } from '../lib/State'

export default function Modal({visible}) {
    const [modalPage, setModalPage] = useState();

    useEffect(() => {
        const subscription = stateQuery.select('modalPage').subscribe(setModalPage)
        return () => subscription.unsubscribe()
    }, [])

    return (<>
    {
        visible ? modalPage : null
    }
    </>)
}