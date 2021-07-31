import React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Board from '../components/Board';
import { getAccount, getBalance } from '../lib/WalletLayer';

export default function Home() {

  const connectWallet = async () => {
    await getAccount()
    getBalance()
  }

  return (
    <div>
      <Board></Board>
      <button onClick={connectWallet}>connect wallet</button>
    </div>
  )
}
