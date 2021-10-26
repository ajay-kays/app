import { MsgStore } from '../msg-store'
import { relay } from 'api'
import moment from 'moment'
import { display, log } from 'lib/logging'
import { normalizeMessage } from 'store/normalize'
import { decodeMessages, Msg, skinny } from '..'

const DAYS = 7
const MSGS_PER_CHAT = 50

// Fetch all messages from the last DAYS days.
// Sort by chatroom.
// Prune to the most recent MSGS_PER_CHAT messages per chatroom.
// (While building separate mediaMessages array for tribes(?))
// Decode+normalize only those messages.
// Store in MST via 'map of arrays' structure.
export const getMessages = async (self: MsgStore, forceMore: boolean = false) => {
  /**
   * FETCH RECENT MESSAGES
   */
  let route = 'messages'
  const start = moment().subtract(DAYS, 'days').format('YYYY-MM-DD%20HH:mm:ss')
  route += `?date=${start}`

  display({
    name: 'getMessages',
    preview: `Fetching messages...`,
    value: { route },
  })

  const r = await relay?.get(route)

  /**
   * SORT MESSAGES BY CHATROOM
   */

  let msgs: { [k: number]: any[] } = ({} = {})

  if (r.new_messages && r.new_messages.length) {
    display({
      name: 'getMessages',
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
      name: 'getMessages',
      preview: `Finished building unsorted msgs map`,
      value: { msgs },
    })

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

    display({
      name: 'getMessages',
      preview: 'Finished sorting and pruning messages',
      value: { msgs, sortedAndFilteredMsgs },
    })

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

    display({
      name: 'getMessages',
      preview: 'Finished decoding+normalizing messages',
      value: { normalizedMsgs },
    })

    self.setMessages(normalizedMsgs)
  }
}

export const getMessagesOld = async (self: MsgStore, forceMore: boolean) => {
  let route = 'messages'
  const start = moment().subtract(DAYS, 'days').format('YYYY-MM-DD%20HH:mm:ss')
  route += `?date=${start}`

  display({
    name: 'getMessages',
    preview: `Fetching messages...`,
    value: { route },
  })

  const r = await relay?.get(route)

  if (r.new_messages && r.new_messages.length) {
    display({
      name: 'getMessages',
      preview: `Fetched ${r.new_messages.length} new messages`,
      value: { route, r },
    })
    const messagesToSave: any = []
    r.new_messages.forEach((message) => {
      const normalizedMessage = normalizeMessage(message)
      if (normalizedMessage) {
        messagesToSave.push(normalizedMessage)
      }
    })
    self.setMessages(messagesToSave)
  }
  return

  // const len = self.lengthOfAllMessages()
  // if (len === 0) {
  //   display({
  //     name: 'getMessages',
  //     preview: `Returning self.restoreMessages()`,
  //   })
  //   return self.restoreMessages()
  // }
  // let route = 'messages'
  // if (!forceMore && self.lastFetched) {
  //   console.log('fetch1')
  //   const mult = 1
  //   const dateq = moment.utc(self.lastFetched - 1000 * mult).format('YYYY-MM-DD%20HH:mm:ss')
  //   route += `?date=${dateq}`
  // } else {
  //   // console.log('FETCHING ALL MESSAGES')
  //   // route += '?'
  //   // console.log('fetch2')
  //   // else just get last week
  //   console.log(`=> GET LAST ${DAYS} DAYS`)
  //   const start = moment().subtract(DAYS, 'days').format('YYYY-MM-DD%20HH:mm:ss')
  //   route += `?date=${start}&limit=5000`
  // }
  // display({
  //   name: 'getMessages',
  //   preview: `Fetching messages. forceMore: ${forceMore}`,
  //   value: { route },
  // })
  // try {
  //   const r = await relay?.get(route)
  //   // display({
  //   //   name: 'getMessages',
  //   //   preview: `Returned with...`,
  //   //   value: { r },
  //   // })
  //   if (!r) return

  //   // throw 'TEST'

  //   if (r.new_messages?.length) {
  //     await self.batchDecodeMessages(r.new_messages)
  //   } else {
  //     display({
  //       name: 'getMessages',
  //       preview: `No new messages.`,
  //     })
  //   }
  // } catch (e) {
  //   console.log('getMessages error', e)
  // }
  // return true
}
