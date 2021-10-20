import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { constants } from 'lib/constants'
import { ChatsStore } from '../chats-store'

export const checkRoute = async (self: ChatsStore, cid: string, myid: number) => {
  const chat = self.chats.get(cid)

  if (!chat) return

  let pubkey
  if (chat.type === constants.chat_types.tribe) {
    pubkey = chat.owner_pubkey
  } else if (chat.type === constants.chat_types.conversation) {
    // TODO: Check types later and fix eslint error
    // eslint-disable-next-line eqeqeq
    const contactid = chat.contact_ids.find((contid) => contid != myid)
    const root = getRoot(self) as RootStore
    if (contactid) {
      const contact = root.contacts.contacts.get(contactid.toString())
      if (contact) {
        pubkey = contact.public_key
      }
    }
  }

  if (!pubkey) return
  const r = await relay?.get(`route?pubkey=${pubkey}`)

  if (r) return r
}
