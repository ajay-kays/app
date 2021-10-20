import { UserStore } from '../user-store'
import * as api from 'api'
import { INVITER_KEY } from 'lib/config'

export const signupWithIP = async (self: UserStore, ip: string) => {
  console.log(`Signup with IP: ${ip}`)
  try {
    self.setCurrentIP(ip)
    self.setInvite(supportContact)
    api.instantiateRelay(ip) // no token
    return ip
  } catch (e) {
    console.log('Error:', e)
    return null
  }
}

const supportContact = {
  inviterNickname: 'Zion Root',
  inviterPubkey: INVITER_KEY,
  welcomeMessage: 'Welcome to Zion!',
  action: '',
}
