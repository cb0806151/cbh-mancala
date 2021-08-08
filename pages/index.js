import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Board from '../components/Board';
import Modal from '../components/Modal'
import { fundAccount, getAccount, getBalance } from '../lib/Layers/Wallet';
import { stateQuery, set } from '../lib/StateManagement/State'
import { Button, Grid } from 'semantic-ui-react';

export default function Home() {
  const [modalVisible, setModalVisible] = useState()
  const [account, setAccount] = useState(null)
  const [loadingMessage, setLoadingMessage] = useState()

  useEffect(() => {
    const modalVisible$ = stateQuery.select('modalVisible').subscribe(setModalVisible)
    const account$ = stateQuery.select('account').subscribe(setAccount)
    const loadingMessage$ = stateQuery.select('loadingMessage').subscribe(setLoadingMessage)
    return () => {
      modalVisible$.unsubscribe()
      loadingMessage$.unsubscribe()
    }
  }, [])

  const connectWallet = async () => {
    await getAccount()
    await fundAccount()
    await getBalance()
    set(true, 'modalVisible')
  }

  return (
      <Grid centered columns={2}>
        <Grid.Column textAlign="center">
          <Head>
            <title>Conflux Mancala</title>
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <Board/>
          <p>{loadingMessage}</p>
          <Button primary className="centered" onClick={connectWallet} disabled={account === null ? false : true}>connect wallet to begin</Button>
          <Modal visible={modalVisible}/>
        </Grid.Column>
      </Grid>
  )
}
