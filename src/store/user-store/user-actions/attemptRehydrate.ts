import { UserStore } from '../user-store'
import * as rsa from 'lib/crypto/rsa'
import { display } from 'lib/logging'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { create } from 'mobx-persist'

const DEBOUNCE_TIME = 280

export const attemptRehydrate = async (self: UserStore) => {
  try {
    // ADD: If we've already rehydrated via MST, skip this.

    // Ensure we have private key. If not, we need to log in with code.
    const priv = await rsa.getPrivateKey()
    display({
      name: 'attemptRehydrate',
      preview: 'Attempting to rehydrate',
      important: true,
      value: { priv },
    })
    if (!priv) return false

    // We attempt to rehydrate by grabbing the user authToken and currentIP from
    // legacy (pre-1.15) localstorage.
    // const hydrate = create({
    //   storage: AsyncStorage,
    //   debounce: DEBOUNCE_TIME,
    // })

    // const hydrated = hydrate('user', )

    const userStorage = (await AsyncStorage.getItem('user')) ?? '{}'
    // alert(userStorage)
    const parsedUser = JSON.parse(userStorage)
    // alert(parsedUser)
    if (!parsedUser) return false
    const { currentIP, authToken } = parsedUser
    if (!currentIP || !authToken) {
      return false
    }
    self.setAuthToken(authToken)
    self.setCurrentIP(currentIP)

    display({
      name: 'userStorage',
      preview: 'Fetched userStorage - set currentIP and authToken',
      important: true,
      value: {
        parsedUser,
        currentIP,
        authToken,
        nowCurrentIP: self.currentIP,
        nowAuthToken: self.authToken,
      },
    })

    return true
  } catch (e) {
    console.log('error rehydrating:', e)
    return false
  }
}
