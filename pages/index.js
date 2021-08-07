import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Board from '../components/Board';
import Modal from '../components/Modal'
import { fundAccount, getAccount, getBalance } from '../lib/Layers/Wallet';
import { stateQuery, set } from '../lib/StateManagement/State'

export default function Home() {
  const [modalVisible, setModalVisible] = useState()

  useEffect(() => {
    const subscription = stateQuery.select('modalVisible').subscribe(setModalVisible)
    return () => subscription.unsubscribe()
  }, [])

  const connectWallet = async () => {
    await getAccount()
    await fundAccount()
    await getBalance()
    set(true, 'modalVisible')
  }

  return (
    <div>
      <Board></Board>
      <button onClick={connectWallet}>connect wallet</button><br/>
      <Modal visible={modalVisible}></Modal>
    </div>
  )
}
