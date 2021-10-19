// @ts-ignore
import { BACKUPCODE as code, MYPIN as pin } from '@env'
import { decode as atob } from 'base-64'
import * as e2e from 'lib/crypto/e2e'
import * as rsa from 'lib/crypto/rsa'
import * as api from 'api'
import { setPinCode } from 'lib/pin'

export const skipLogin = async () => {
  const restoreString = atob(code)

  if (restoreString.startsWith('keys::')) {
    const enc = restoreString.substr(6)
    const dec = await e2e.decrypt(enc, pin)
    if (!dec) return
    await setPinCode(pin)
    const arr = dec.split('::')
    if (arr.length !== 4) return false
    const priv = arr[0]
    const ip = arr[2]
    const token = arr[3]
    await rsa.setPrivateKey(priv)
    console.log('PIN and priv key set')
    api.instantiateRelay(
      ip,
      token,
      () => console.log('setConnected(true) placeholder'),
      () => console.log('setConnected(false) placeholder'),
      () => console.log('resetIP placeholder')
    )
  }
}
