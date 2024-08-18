'use client';

import { useWallet } from '../hooks/useWallet'

export function useWalletConnector() {
  const { isActive, account, isConnecting, connect, disconnect } = useWallet()

  const connectWallet = async () => {
    if (!isActive) {
      await connect()
    }
    return { isActive, account }
  }

  return { connectWallet, isActive, account, isConnecting, disconnect }
}