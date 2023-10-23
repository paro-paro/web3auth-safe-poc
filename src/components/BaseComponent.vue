<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import type { Web3Auth } from '@web3auth/modal'
import type { IProvider } from '@web3auth/base'

const instance = getCurrentInstance()
const auth = instance?.appContext.config.globalProperties.$auth as Web3Auth
let provider: ethers.providers.Web3Provider | null = null

const AMOUNT = '0.0000001'

async function onCheck() {
  console.log('auth', auth)
  console.log('provider', auth.provider)
}

async function onSignIn() {
  try {
    await auth.connect()
    provider = new ethers.providers.Web3Provider(auth.provider as IProvider)
  }
  catch (e) {
    if (e instanceof Error)
      console.log('error:', e.message)
  }
}

async function onSignOut() {
  try {
    await auth.logout()
    provider = null
  }
  catch (e) {
    if (e instanceof Error)
      console.log('error:', e.message)
  }
}

async function onRelay() {
  try {
    console.log('Sending RELAY TX')
    const relayPack = new GelatoRelayPack()
    const signer = provider?.getSigner()
    console.log('signer', signer)

    if (!signer)
      throw new Error('No signer')

    const eoa = await signer.getAddress()
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer })
    const safeApiKit = new SafeApiKit({ txServiceUrl: 'https://safe-transaction-goerli.safe.global', ethAdapter })
    const { safes } = await safeApiKit.getSafesByOwner(eoa)

    if (!safes.length)
      throw new Error(`No safes owned by Signer: ${eoa} (goerli)`)
    else 
      console.log(`EOA: ${eoa}`, `Safe: ${safes[0]}`)

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: safes[0],
    })

    // send gelato-relay (syncfee) tx (from safe to eoa)
    console.log(`Sending ${AMOUNT} ETH from Safe to EOA`)
    const transactions = [
      {
        to: eoa,
        data: '0x',
        value: ethers.utils.parseUnits(AMOUNT, 'ether').toString(),
      },
    ]

    const safeTransaction = await relayPack.createRelayedTransaction({ safe: safeSdk, transactions })
    const safeTransactionSigned = await safeSdk.signTransaction(safeTransaction)

    const res = await relayPack.executeRelayTransaction(safeTransactionSigned, safeSdk)
    console.log('url: ', `https://relay.gelato.digital/tasks/status/${res.taskId}`)
  }
  catch (e) {
    if (e instanceof Error)
      console.log('error:', e.message)
  }
}
</script>

<template>
  <div style="display: flex; gap: 1rem;">
    <button @click="onSignIn">
      Sign In
    </button>
    <button @click="onSignOut">
      Sign Out
    </button>
    <button @click="onCheck">
      Check
    </button>
    <button @click="onRelay">
      Relay
    </button>
  </div>
</template>
