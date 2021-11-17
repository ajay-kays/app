import { getRoot } from 'mobx-state-tree'
import EncryptedStorage from 'react-native-encrypted-storage'
import { reportError } from 'lib/errorHelper'
import { RootStore, ROOT_STATE_STORAGE_KEY } from 'store'
import { UserStore } from '../user-store'
import { display } from 'lib/logging'
import storage from '@react-native-async-storage/async-storage'

export const logout = async (self: UserStore) => {
  try {
    const root = getRoot(self) as RootStore
    root.reset()
  } catch (e) {
    reportError(e)
  }

  try {
    await storage.removeItem(ROOT_STATE_STORAGE_KEY)
    console.log('storage cleared')
  } catch (e) {
    console.log(e)
  }

  try {
    const pin = await EncryptedStorage.getItem('pin')
    if (pin) {
      display({
        name: 'logout',
        preview: 'PIN found, removing from storage.',
        important: true,
      })
      await EncryptedStorage.removeItem('pin')
    } else {
      display({
        name: 'logout',
        preview: 'No PIN found, nothing to clear',
        important: true,
      })
    }
  } catch (e) {
    reportError(e)
  }

  try {
    const priv = await EncryptedStorage.getItem('private')
    if (priv) {
      display({
        name: 'logout',
        preview: 'PrivKey found, removing from storage.',
        important: true,
      })
      await EncryptedStorage.removeItem('private')
    } else {
      display({
        name: 'logout',
        preview: 'No PrivKey found, nothing to clear',
        important: true,
      })
    }
  } catch (e) {
    reportError(e)
  }

  display({
    name: 'logout',
    preview: 'Logged out successfully?',
  })
}
