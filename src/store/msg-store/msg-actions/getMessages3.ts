import { relay } from 'api'
import { display } from 'lib/logging'
import moment from 'moment'
import { realm } from 'services/realm/api/realm.instance'
import { MsgStore } from '../msg-store'

// Ensure we have all relevant messages in Realm.
export const getMessages3 = async (self: MsgStore, forceOverwrite: boolean = true) => {
  let messages = realm.objects('Message')
  display({
    name: 'getMessages3',
    important: true,
    preview: `Realm has ${messages.length} messages stored:`,
    value: { messages },
  })

  // If forceOverwrite, delete all Realm data and start fresh.
  if (forceOverwrite) {
    realm.write(() => {
      realm.deleteAll()
    })

    messages = realm.objects('Message')
    display({
      name: 'getMessages3',
      important: true,
      preview: `Deleted realm. Down to ${messages.length} messages`,
      value: { messages },
    })
  }

  // If no messages, do a full restore.
  if (messages.length === 0) {
    display({
      name: 'getMessages3',
      important: true,
      preview: `No realm messages. Restoring all...`,
    })
    return self.restoreMessages()
  } else {
    display({
      name: 'getMessages3',
      important: true,
      preview: `Found ${messages.length} existing messages. Checking for new...`,
    })
    let route = 'messages'
    const dateq = moment.utc(self.lastFetched - 1000).format('YYYY-MM-DD%20HH:mm:ss')
    route += `?date=${dateq}`
    try {
      const r = await relay?.get(route)
      // display({
      //   name: 'getMessages3',
      //   preview: `Returned with...`,
      //   value: { r },
      // })
      if (!r) return
      if (r.new_messages?.length) {
        await self.batchDecodeMessages(r.new_messages)
      } else {
        display({
          name: 'getMessages3',
          preview: `No new messages.`,
        })
      }
    } catch (e) {
      console.log('getMessages error', e)
    }
  }
  // Grab the latest message stored in Realm, see if we need to grab more
}
