import { normalizeMessage } from 'store/normalize'
import { display } from 'lib/logging'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { decodeSingle, putIn } from '../msg-helpers'
import { MsgStore } from '../msg-store'

export const gotNewMessage = async (self: MsgStore, m: any) => {
  try {
    let newMsg = await decodeSingle(m)
    const normalizedMessage = normalizeMessage(newMsg)
    normalizedMessage && self.setMessage(normalizedMessage)
  } catch (e) {
    display({
      name: 'gotNewMessage',
      preview: 'Error decoding+setting',
      important: true,
    })
  }

  // const chatID = newMsg.chat_id
  // if (chatID) {
  //   putIn(self.messages, newMsg, chatID)
  //   // this.persister()
  //   const root = getRoot(self) as RootStore
  //   if (newMsg.chat) root.chats.gotChat(newMsg.chat)
  // }
}
