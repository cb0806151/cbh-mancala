import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Board from '../components/Board';
import ModalWrapper from '../components/ModalWrapper'
import { fundAccount, getAccount, getBalance } from '../lib/Layers/Wallet';
import { stateQuery, set } from '../lib/StateManagement/State'
import { Button, Grid } from 'semantic-ui-react';
import HowToPlay from '../components/ModalPages/HowToPlay';

export default function Home() {
  const [loadingMessage, setLoadingMessage] = useState()
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadingMessage$ = stateQuery.select('loadingMessage').subscribe(setLoadingMessage)
    const account$ = stateQuery.select('account').subscribe(setAccount)
    return () => {
      loadingMessage$.unsubscribe()
      account$.unsubscribe()
    }
  }, [])

  const connectWallet = async () => {
    await getAccount()
    await fundAccount()
    await getBalance()
  }

  const openModal = () => {
    set(<HowToPlay/>, 'modalPage')
    set(true, 'modalVisible')
  }

  return (
      <Grid verticalAlign='middle' centered style={{height: '100vh'}} columns={2}>
        <Grid.Column textAlign="center">
          <Head>
            <title>Conflux Mancala</title>
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <Board/>
          <p>{loadingMessage}</p>
          <Grid centered columns={2}>
            <Grid.Row>
              <Button primary onClick={openModal} disabled={account === null ? true : false}>Start</Button>
            </Grid.Row>
            <Grid.Row>
              {account === null ? 
                <Button className="centered" onClick={connectWallet}>connect wallet to begin</Button>
              : null}
            </Grid.Row>
          </Grid>
          <ModalWrapper/>
        </Grid.Column>
      </Grid>
  )
}
