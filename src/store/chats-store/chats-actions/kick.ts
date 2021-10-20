import { relay } from 'api'
import { ChatsStore } from '../chats-store'

export const kick = async (self: ChatsStore, chatID: number, contactID: number) => {
  const r = await relay?.put(`kick/${chatID}/${contactID}`)
  if (r === true) {
    // success
    const chat = self.chats.get(chatID.toString())
    if (chat) {
      // TODO: Test this or refactor away from simple array
      chat.contact_ids.remove(contactID)
      //chat.contact_ids = chat.contact_ids.filter((cid) => cid !== contactID)
    }
  }
}
