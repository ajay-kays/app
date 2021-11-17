import Toast from 'react-native-simple-toast'
import { UserStore } from '../user-store'
import { sleep } from 'lib/sleep'
import * as api from 'api'
import { randString } from 'lib/crypto/rand'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { navigate } from 'nav'

export const generateToken = async (self: UserStore, pwd: string) => {
  const root = getRoot(self) as RootStore
  if (api.relay === null && self.currentIP) {
    api.instantiateRelay(self.currentIP)
    await sleep(1)
  }
  try {
    const token = await randString(20)
    console.log('OK GEN TOKEN!', self.currentIP, pwd)
    const r = await api.relay?.post(`contacts/tokens?pwd=${pwd}`, {
      token,
    })
    if (!r) {
      console.log('failed to reach relay')
      Toast.showWithGravity(
        'You already used this access key. Log in with your backup key, or reset your node to get a new access key.',
        Toast.LONG,
        Toast.CENTER
      )
      await self.logout()
      self.setOnboardStep(0)
      navigate('Home')
      return false
    }
    if (r.id) self.setMyID(r.id)
    self.setAuthToken(token)
    api.instantiateRelay(
      self.currentIP,
      token,
      () => root.ui.setConnected(true),
      () => root.ui.setConnected(false)
    )
    return token
  } catch (e) {
    console.log(e)
    return 'error'
  }
}
