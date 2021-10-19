import { RelayStore } from '../relay-store'
import { decode as atob } from 'base-64'
import * as e2e from 'lib/crypto/e2e'

export const pinEntered = async (self: RelayStore, pin: string) => {
  console.tron.log(`PIN entered: ${pin}`)

  const restoreString = atob(self.code)
  console.log('restoreString:', restoreString)

  if (restoreString.startsWith('keys::')) {
    const enc = restoreString.substr(6)
    console.tron.log('enc:', enc)
    const dec = await e2e.decrypt(enc, pin)
    console.log('DEC!', dec)
    console.tron.log('dec:', dec)
  }

  return true
}
