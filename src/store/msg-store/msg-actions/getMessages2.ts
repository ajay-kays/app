import { display } from 'lib/logging'
import moment from 'moment'
import { relay } from 'api'
import { getRealmMessages, hasData, initialLoad, updateRealmMsg } from 'services/realm/exports'
import { MsgStore } from '../msg-store'

// First we check Realm for the most recent message and check relay to see if there are any new messages since then.
// Then we make sure we have all messages from relay stored in Realm. (Do this check only once every how often...?)
export const getMessages2 = async (self: MsgStore) => {
  // First we ensure we have all messages from relay in Realm.
  const len = self.lengthOfAllMessages()

  display({
    name: 'getMessages2',
    preview: `${len} current messages. Checking for new messages...`,
  })

  // Check Realm for existing data.
  const hasRealmData = hasData()
  // display({
  //   name: 'getMessages2',
  //   preview: `hasRealmData: [con] ${hasRealmData.contacts}, [ch] ${hasRealmData.chats}, [msg] ${hasRealmData.msg}`,
  //   value: { hasRealmData },
  // })

  if (hasRealmData.msg) {
    // Messages exist. Let's get them.
    const rs = getRealmMessages()

    // Determine the dates of the newest messages.
    const newestMessage = rs.newestMessage as number

    // See if there were any new messages since then.
    let route = 'messages'
    const start = moment.utc(newestMessage + 1000).format('YYYY-MM-DD%20HH:mm:ss')

    display({
      name: 'getMessages2',
      preview: `Messages fetched. Newest: ${start}`,
      // important: true,
      value: { rs },
    })

    route += `?date=${start}`
    // display({
    //   name: 'getMessages2',
    //   preview: route,
    //   important: true,
    //   value: { route },
    // })

    const r = await relay?.get(route)

    /**
     * SORT MESSAGES BY CHATROOM
     */

    let msgs: { [k: number]: any[] } = ({} = {})

    if (r.new_messages && r.new_messages.length) {
      display({
        name: 'getMessages2',
        preview: `Fetched ${r.new_messages.length} new messages`,
        value: { route, r },
      })

      await self.batchDecodeMessages(r.new_messages)
      display({
        name: 'getMessages2',
        preview: `NOW UPDATING REALM`,
        important: true,
      })
      const updateRealmWith = {
        messages: self.messages,
        lastSeen: self.lastSeen,
        lastFetched: Date.now(),
      }
      updateRealmMsg(updateRealmWith)
      // display({
      //   name: 'getMessages2',
      //   preview: `here`,
      //   important: true,
      // })
      // display({
      //   name: 'getMessages2',
      //   preview: `UPDATED REALM?!??!`,
      //   important: true,
      // })
    } else {
      display({
        name: 'getMessages2',
        preview: `No new messages from relay.`,
        important: true,
        value: { r },
      })
    }
  } else {
    // No messages? Begin a full fetch starting with the last 3(?) days.
    display({
      name: 'getMessages2',
      preview: `NO msg object in Realm - fetching all newly.`,
      important: true,
      value: { hasRealmData },
    })
  }

  // Regardless of whether new messages were found or not, let's now go back and see ALL messages.
  const newRoute = 'messages?limit=20000'
  const r2 = await relay?.get(newRoute)
  if (!r2) {
    display({
      name: 'getMessages2',
      preview: `All messages check failed!`,
      important: true,
    })
    return
  }

  display({
    name: 'getMessages2',
    preview: `Returned from all messages check with...`,
    value: { r2 },
  })

  if (r2.new_messages && r2.new_messages.length) {
    const totalRelayMessages = r2.new_messages.length
    const realmMessages = getRealmMessages()
    const totalRealmMessages = realmMessages.totalMessages
    if (totalRelayMessages <= totalRealmMessages) {
      display({
        name: 'getMessages2',
        preview: `All relay messages loaded into Realm!`,
        important: true,
        value: { totalRealmMessages, totalRelayMessages },
      })
    } else {
      display({
        name: 'getMessages2',
        preview: `Missing messages! ${totalRelayMessages} in relay, ${totalRealmMessages} in realm.`,
        important: true,
        value: { totalRealmMessages, totalRelayMessages },
      })
      // Now we format this entire blob and throw into the thing
    }
  }
}
