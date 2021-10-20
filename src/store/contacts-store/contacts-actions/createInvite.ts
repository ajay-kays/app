import { relay } from 'api'
import { ContactsStore } from '../contacts-store'

export const createInvite = async (
  self: ContactsStore,
  nickname: string,
  welcome_message: string
) => {
  try {
    await relay?.post('invites', {
      nickname,
      welcome_message: welcome_message || 'Welcome to Zion!',
    })
    self.getContacts()
  } catch (e) {
    console.log('could not create invite', e)
  }
}
