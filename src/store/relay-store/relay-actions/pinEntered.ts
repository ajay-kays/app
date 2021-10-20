import { RelayStore } from '../relay-store'
import { decode as atob } from 'base-64'
import * as e2e from 'lib/crypto/e2e'
import { log } from 'lib/logging'

export const pinEntered = async (self: RelayStore, pin: string) => {
  log(`PIN entered: ${pin}`)

  const restoreString = atob(self.code)
  console.log('restoreString:', restoreString)

  if (restoreString.startsWith('keys::')) {
    const enc = restoreString.substr(6)
    log('enc:', enc)
    const dec = await e2e.decrypt(enc, pin)
    console.log('DEC!', dec)
    log('dec:', dec)
  }

  return true
}
