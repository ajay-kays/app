import { display } from 'lib/logging'
import moment from 'moment'
import { relay } from 'api'
import { getRealmMessages, hasData, initialLoad, updateRealmMsg } from 'services/realm/exports'
import { MsgStore } from '../msg-store'

export const getMessages2 = async (self: MsgStore) => {
  display({
    name: 'getMessages2',
    preview: 'Beginning new message fetching.',
    important: true,
  })

  // Check Realm for existing data.
  const hasRealmData = hasData()
  display({
    name: 'getMessages2',
    preview: `hasRealmData: [con] ${hasRealmData.contacts}, [ch] ${hasRealmData.chats}, [msg] ${hasRealmData.msg}`,
    important: true,
    value: { hasRealmData },
  })

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
      important: true,
      value: { rs },
    })

    route += `?date=${start}`
    display({
      name: 'getMessages2',
      preview: route,
      important: true,
      value: { route },
    })

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
        preview: `No new messages.`,
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
}
