import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { loadStdlib } from '@reach-sh/stdlib'
const reach = loadStdlib('CFX');

export default function Home() {

  const connectWallet = async () => {
    await reach.getDefaultAccount()
  }

  return (
    <div>
      <button onClick={connectWallet}>connect wallet</button>
    </div>
  )
}
