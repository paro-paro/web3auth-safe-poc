import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'

const CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID

export async function initAuth() {
  const auth = new Web3Auth({
    clientId: CLIENT_ID,
    web3AuthNetwork: 'testnet',
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x5',
      rpcTarget: 'https://goerli.infura.io/v3/f7f0e336b82345ef99a6710b0ba3a98d',
    }
  })
  
  await auth.initModal()
  return auth
}
