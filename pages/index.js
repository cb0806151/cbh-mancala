import React, { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Board from '../components/Board';
import Modal from '../components/Modal'
import { getAccount, getBalance } from '../lib/WalletLayer';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false)

  const connectWallet = async () => {
    await getAccount()
    getBalance()
  }

  return (
    <div>
      <Board></Board>
      <button onClick={connectWallet}>connect wallet</button>
      <button onClick={() => setModalVisible(!modalVisible)}>Open/Close Modal</button>
      <Modal visible={modalVisible}></Modal>
    </div>
  )
}
