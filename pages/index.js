import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { loadStdlib } from '@reach-sh/stdlib'
import { stateQuery, set } from '../lib/state'
const reach = loadStdlib('CFX');

export default function Home() {
  let account = stateQuery.select('account')

  const connectWallet = async () => {
    await getAccount()
    account.subscribe(x => getBalance(x))
  }

  const getAccount = async () => {
    let acc = await reach.getDefaultAccount()
    set(acc, 'account')
  }

  const getBalance = async (account) => {
    let rawBalance = await reach.balanceOf(account)
    set(reach.formatCurrency(rawBalance, 4), 'balance')
  }

  return (
    <div>
      <button onClick={connectWallet}>connect wallet</button>
    </div>
  )
}
