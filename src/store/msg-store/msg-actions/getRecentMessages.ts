import { MsgStore } from '../msg-store'
import { relay } from 'api'
import moment from 'moment'
import { display, log } from 'lib/logging'
import { normalizeMessage } from 'store/normalize'
import { decodeMessages, Msg, skinny } from '..'

const DAYS = 7
const MSGS_PER_CHAT = 1

// Fetch all messages from the last DAYS days.
// Sort by chatroom.
// Prune to the most recent MSGS_PER_CHAT messages per chatroom.
// (While building separate mediaMessages array for tribes(?))
// Decode+normalize only those messages.
// Store in MST via 'map of arrays' structure.
export const getRecentMessages = async (self: MsgStore) => {
  display({
    name: 'getRecentMessages',
    preview: "Let's get recent messages...",
    important: true,
  })

  /**
   * FETCH RECENT MESSAGES
   */
  let route = 'messages'
  const start = moment().subtract(DAYS, 'days').format('YYYY-MM-DD%20HH:mm:ss')
  route += `?date=${start}`

  const r = await relay?.get(route)

  display({
    name: 'getRecentMessages',
    preview: `Fetched messages:`,
    value: { r },
    important: true,
  })

  /**
   * SORT MESSAGES BY CHATROOM
   */

  let msgs: { [k: number]: any[] } = ({} = {})

  if (r.new_messages && r.new_messages.length) {
    display({
      name: 'getRecentMessages',
      preview: `Fetched ${r.new_messages.length} new messages`,
      value: { route, r },
    })

    r.new_messages.forEach((msg) => {
      if (msgs[msg.chat_id]) {
        msgs[msg.chat_id].push(skinny(msg))
      } else {
        msgs[msg.chat_id] = [skinny(msg)]
      }
    })

    display({
      name: 'getRecentMessages',
      preview: `Finished building unsorted msgs map`,
      value: { msgs },
    })

    /**
     * SORT BY DATE AND PRUNE TO {MSGS_PER_CHAT} MESSAGES PER CHATROOM. KEEP ALL UNREADS
     */
    let lastMsgs: { [k: number]: any[] } = ({} = {})
    Object.entries(msgs).forEach((chat) => {
      lastMsgs[chat[0]] = chat[1]
        .sort((a, b) => {
          const bd: any = new Date(b.created_at)
          const ad: any = new Date(a.created_at)
          return bd - ad
        })
        .slice(0, MSGS_PER_CHAT)
    })

    let unreadMsgs: { [k: number]: any[] } = ({} = {})
    Object.entries(msgs).forEach((chat) => {
      unreadMsgs[chat[0]] = chat[1]
        .sort((a, b) => {
          const bd: any = new Date(b.created_at)
          const ad: any = new Date(a.created_at)
          return bd - ad
        })
        .filter((a) => a.seen === 0)
    })

    display({
      name: 'getRecentMessages',
      preview: 'Finished sorting/filtering messages',
      value: { msgs, lastMsgs, unreadMsgs },
    })

    /**
     * NORMALIZE AND DECODE ONLY THESE MESSAGES
     */

    const normalizedLastMsgs = await normalizeAndDecode(lastMsgs)
    const normalizedUnreadMsgs = await normalizeAndDecode(unreadMsgs)

    // const merged = new Set([normalizedLastMsgs, normalizedUnreadMsgs])

    display({
      name: 'getRecentMessages',
      preview: 'Finished decoding+normalizing messages',
      value: { normalizedLastMsgs, normalizedUnreadMsgs },
    })

    let mergedMsgs: { [k: number]: any[] } = ({} = {})
    Object.entries(normalizedLastMsgs).forEach((chat) => {
      mergedMsgs[chat[0]] = awkwardlyCombineTheseArrays(chat[1], normalizedUnreadMsgs[chat[0]])
    })

    self.setMessages(mergedMsgs)
    // self.setMessages(normalizedLastMsgs)
    // self.setMessages(normalizedUnreadMsgs)

    return
  }
}

const normalizeAndDecode = async (msgs) => {
  let normalizedMsgs: { [k: number]: any[] } = ({} = {}) // collapse all these down to 1 obj?
  const sortedChats = Object.entries(msgs)
  for (const chat of sortedChats as any) {
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
  return normalizedMsgs
}

const awkwardlyCombineTheseArrays = (a1: Msg[], a2: Msg[]) => {
  a2.forEach((m) => {
    if (!a1.find((m2) => m2.id === m.id)) {
      a1.push(m)
    }
  })
  return a1.sort((a, b) => {
    const bd: any = new Date(b.created_at)
    const ad: any = new Date(a.created_at)
    return bd - ad
  })
}
