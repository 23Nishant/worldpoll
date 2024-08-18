'use client';

import { useState, useEffect } from 'react'
import { hooks, metaMask } from './metaMask'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks

export function useWallet() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()
  const isActive = useIsActive()
  const provider = useProvider()

  const [isConnecting, setIsConnecting] = useState(false)

  const account = accounts ? accounts[0] : null

  async function connect() {
    setIsConnecting(true)
    try {
      await metaMask.activate()
    } catch (error) {
      console.error('Failed to connect:', error)
    }
    setIsConnecting(false)
  }

  async function disconnect() {
    try {
      if (metaMask?.deactivate) {
        await metaMask.deactivate()
      } else {
        await metaMask.resetState()
      }
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  useEffect(() => {
    metaMask.connectEagerly().catch(() => {
      console.log('Failed to connect eagerly')
    })
  }, [])

  return { isActive, account, chainId, isConnecting, connect, disconnect, provider }
}