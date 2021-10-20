import { UserStore } from '../user-store'
import * as api from 'api'
import { sleep } from 'lib/sleep'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'

export const restore = async (self: UserStore, restoreString: string) => {
  const root = getRoot(self) as RootStore
  const arr = restoreString.split('::')
  if (arr.length !== 4) return false
  const priv = arr[0]
  // const pub = arr[1]
  const ip = arr[2]
  const token = arr[3]
  self.setCurrentIP(ip)

  self.setAuthToken(token)
  console.log('RESTORE NOW!')
  api.instantiateRelay(
    ip,
    token,
    // () => console.log('placeholder setConnected true'), // uiStore.setConnected(true),
    // () => console.log('placeholder setConnected false'), // uiStore.setConnected(false)
    () => root.ui.setConnected(true),
    () => root.ui.setConnected(false),
    () => console.log('resetIP placeholder')
    // self.resetIP
  )
  await sleep(650)
  return priv
}
