import React, { useState, useEffect } from 'react'
import { stateQuery } from '../lib/StateManagement/State'
import { Modal } from 'semantic-ui-react'

export default function ModalWrapper() {
    const [modalPage, setModalPage] = useState();
    const [modalVisible, setModalVisible] = useState()

    useEffect(() => {
        const modalPage$ = stateQuery.select('modalPage').subscribe(setModalPage)
        const modalVisible$ = stateQuery.select('modalVisible').subscribe(setModalVisible)
        return () => {
            modalPage$.unsubscribe()
            modalVisible$.unsubscribe()
        }
    }, [])

    return (<>
        <Modal size='small' open={modalVisible}>
            {modalPage}
        </Modal>
    </>)
}