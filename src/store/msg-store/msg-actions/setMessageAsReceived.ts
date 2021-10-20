import { constants } from 'lib/constants'
import { MsgStore } from '../msg-store'

export const setMessageAsReceived = async (self: MsgStore, m: any) => {
  if (!m.chat_id) return
  const msgsForChat = self.messages[m.chat_id]
  const ogMessage = msgsForChat?.find((msg) => msg.id === m.id || msg.id === -1)
  if (ogMessage) {
    ogMessage.status = constants.statuses.received
  } else {
    // add anyway (for on another app)
    self.gotNewMessage(m)
  }
}
