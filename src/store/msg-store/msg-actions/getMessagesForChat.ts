import { MsgStore } from '../msg-store'
import { relay } from 'api'
import moment from 'moment'
import { display, log } from 'lib/logging'
import { normalizeMessage } from 'store/normalize'
import { decodeMessages, Msg, skinny } from '..'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { getById, getRealmMessagesForChat } from 'services/realm/api'
// import { getRealmMessagesForChatId } from 'services/realm/exports'
import { sleep } from 'lib/sleep'
// import { getRealmMessagesForChatId, getRealmMessagesForChatId2 } from 'services/realm/exports'

const MSGS_PER_CHAT = 350

export const getMessagesForChat = async (self: MsgStore, chatId: number, limit: number = 0) => {
  display({
    name: 'getMessagesForChat',
    preview: `Loading getMessagesForChat id ${chatId} from Realm`,
  })
  // return
  // await sleep(1000)

  const messages = getRealmMessagesForChat({ id: chatId, schema: 'Message' }) as Msg[]

  const root = getRoot(self) as RootStore
  root.ui.setChatMsgsLoading(chatId)
  // const messages = getRealmMessagesForChatId(chatId)

  display({
    name: 'getMessagesForChat',
    preview: `Retrieved from Realm ${messages.length} messages for chat ID ${chatId}`, //
    important: true,
    value: { messages },
  })

  let normalizedMsgs: { [k: number]: any[] } = ({} = {}) // collapse all these down to 1 obj?
  // const sortedChats = Object.entries(messages)
  // for (const chat of sortedChats) {
  // const msgs = await decodeMessages(chat[1])
  const msgsToSave: Msg[] = []
  if (messages && messages.length)
    messages.forEach((msg) => {
      const normMsg = normalizeMessage(msg)
      if (normMsg) {
        msgsToSave.push(normMsg)
      }
    })
  normalizedMsgs[chatId] = msgsToSave
  // }

  self.setMessages(normalizedMsgs)
  root.ui.setChatMsgsLoading(null)

  display({
    name: 'getMessagesForChat',
    preview: `Done fetching ${messages.length} messages for chat ${chatId}`,
    value: { messages },
  })
  return
}
