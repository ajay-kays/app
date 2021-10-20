import { relay } from 'api'
import { ContactsStore } from '../contacts-store'

export const payInvite = async (self: ContactsStore, invite_string: string) => {
  try {
    const inv = await relay?.post(`invites/${invite_string}/pay`, {})
    if (!inv) return
    console.log('inv', inv)

    self.updateInvite(inv.invite)
  } catch (e) {
    console.log('could not pay invite', e)
  }
}
