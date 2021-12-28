import { UserStore } from '../user-store'
import * as api from 'api'

export const resetIP = async (self: UserStore) => {
  console.log('user.RESET_IP')
  const pubkey = self.publicKey
  if (!(pubkey && pubkey.length === 66)) return
  try {
    const r = await api.invite.get(`nodes/${pubkey}`)
    if (!(r && r.node_ip)) return
    console.log('NEW IP', r.node_ip)
    self.setCurrentIP(r.node_ip)
    return r.node_ip
  } catch (e) {
    console.log('Error:', e)
  }
}
