import { MsgStore } from '../msg-store'
import { relay } from 'api'
import moment from 'moment'
import { display, log } from 'lib/logging'
import { normalizeMessage } from 'store/normalize'
import { decodeMessages, Msg, skinny } from '..'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'

const MSGS_PER_CHAT = 250

export const getMessagesForChat = async (self: MsgStore, chatId: number) => {
  if (!chatId) return

  const root = getRoot(self) as RootStore
  root.ui.setChatMsgsLoading(chatId)

  // display({
  //   name: 'getMessagesForChat',
  //   preview: `Lets grab messages for chatId ${chatId}`,
  //   important: true,
  // })
  let route = `msgsForChat?chatId=${chatId}`
  const r = await relay?.get(route)
  // display({
  //   name: 'getMessagesForChat',
  //   preview: `Fetched messages for chatId ${chatId}`,
  //   value: { r, route },
  // })

  /**
   * SORT MESSAGES BY CHATROOM
   */

  let msgs: { [k: number]: any[] } = ({} = {})

  if (r.new_messages && r.new_messages.length) {
    display({
      name: 'getMessagesForChat',
      preview: `Fetched ${r.new_messages.length} new messages for chatId ${chatId}`,
      value: { route, r },
    })

    r.new_messages.forEach((msg) => {
      if (msgs[msg.chat_id]) {
        msgs[msg.chat_id].push(skinny(msg))
      } else {
        msgs[msg.chat_id] = [skinny(msg)]
      }
    })

    // display({
    //   name: 'getMessagesForChat',
    //   preview: `Finished building unsorted msgs map`,
    //   value: { msgs },
    // })

    /**
     * SORT BY DATE AND PRUNE TO {MSGS_PER_CHAT} MESSAGES PER CHATROOM
     */
    let sortedAndFilteredMsgs: { [k: number]: any[] } = ({} = {})
    Object.entries(msgs).forEach((chat) => {
      sortedAndFilteredMsgs[chat[0]] = chat[1]
        .sort((a, b) => {
          const bd: any = new Date(b.created_at)
          const ad: any = new Date(a.created_at)
          return bd - ad
        })
        .slice(0, MSGS_PER_CHAT)
    })

    // display({
    //   name: 'getMessagesForChat',
    //   preview: 'Finished sorting and pruning messages',
    //   value: { msgs, sortedAndFilteredMsgs },
    // })

    /**
     * NORMALIZE AND DECODE ONLY THESE MESSAGES
     */
    let normalizedMsgs: { [k: number]: any[] } = ({} = {}) // collapse all these down to 1 obj?
    const sortedChats = Object.entries(sortedAndFilteredMsgs)
    for (const chat of sortedChats) {
      const msgs = await decodeMessages(chat[1])
      const msgsToSave: Msg[] = []
      msgs.forEach((msg) => {
        const normMsg = normalizeMessage(msg)
        if (normMsg) {
          msgsToSave.push(normMsg)
        }
      })
      normalizedMsgs[chat[0]] = msgsToSave
    }

    // display({
    //   name: 'getMessagesForChat',
    //   preview: 'Finished decoding+normalizing messages',
    //   value: { normalizedMsgs },
    // })

    self.setMessages(normalizedMsgs)
  }
  root.ui.setChatMsgsLoading(null)
  return
}
