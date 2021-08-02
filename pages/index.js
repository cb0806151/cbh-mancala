import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Board from '../components/Board';
import Modal from '../components/Modal'
import { getAccount, getBalance } from '../lib/WalletLayer';
import { stateQuery, set } from '../lib/State'

export default function Home() {
  const [modalVisible, setModalVisible] = useState()

  useEffect(() => {
    const subscription = stateQuery.select('modalVisible').subscribe(setModalVisible)
    return () => subscription.unsubscribe()
  }, [])

  const connectWallet = async () => {
    await getAccount()
    await getBalance()
  }

  return (
    <div>
      <Board></Board>
      <button onClick={connectWallet}>connect wallet</button>
      <button onClick={() => set(!modalVisible, 'modalVisible')}>Open/Close Modal</button>
      <Modal visible={modalVisible}></Modal>
    </div>
  )
}
