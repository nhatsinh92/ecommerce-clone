'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export type CartWrite =
  | { kind: 'add'; productId: string; quantity: number } // product page. POST
  | { kind: 'set'; productId: string; quantity: number } // cart stepper. PUT
  | { kind: 'remove'; productId: string } // Xóa. DELETE

const METHOD = {
  add: 'POST',
  set: 'PUT',
  remove: 'DELETE',
} as const

export function useCartWrite(): {
  pending: boolean
  failed: boolean
  write: (command: CartWrite) => Promise<boolean>
} {
  const router = useRouter()
  const [transitionPending, startTransition] = useTransition()
  const [refreshing, setRefreshing] = useState(false)
  const [failed, setFailed] = useState(false)

  function write(command: CartWrite): Promise<boolean> {
    setFailed(false)
    setRefreshing(true)
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const ok = await send(command)
          if (!ok) {
            setFailed(true)
            setRefreshing(false)
            resolve(false)
            return
          }
          // Waiting for refresh inside this promise deadlocks: the refresh
          // cannot commit until the transition ends. The badge changes when it does.
          const refreshed = watchBadge()
          router.refresh()
          refreshed.then(() => {
            setRefreshing(false)
            resolve(true)
          })
        } catch {
          setFailed(true)
          setRefreshing(false)
          resolve(false)
        }
      })
    })
  }

  return { pending: transitionPending || refreshing, failed, write }
}

function watchBadge(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      observer.disconnect()
      window.clearTimeout(timer)
      resolve()
    }
    const header = document.querySelector('header.top')
    const observer = new MutationObserver(finish)
    const timer = window.setTimeout(finish, 4000)
    if (!header) {
      finish()
      return
    }
    observer.observe(header, { attributes: true, childList: true, characterData: true, subtree: true })
  })
}

async function send(command: CartWrite): Promise<boolean> {
  const init: RequestInit = { method: METHOD[command.kind] }
  if (command.kind !== 'remove') {
    init.headers = { 'content-type': 'application/json' }
    init.body = JSON.stringify({ quantity: command.quantity })
  }
  const res = await fetch(`/api/cart/lines/${encodeURIComponent(command.productId)}`, init)
  return res.ok
}
