import { MsgStore } from '../msg-store'
import { relay } from 'api'
import moment from 'moment'
import { decodeMessages, orgMsgsFromExisting } from '../msg-helpers'
import { MAX_MSGS_RESTORE, Msg } from '../msg-models'
import { display, log } from 'lib/logging'
import { updateRealmMsg2 } from 'services/realm/exports'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'

let restoring = false

export const restoreMessages = async (self: MsgStore) => {
  if (restoring) return false
  restoring = true
  const root = getRoot(self) as RootStore
  root.ui.setMessagesRestored(0)
  root.ui.setRestoringModal(true)
  display({
    name: 'restoreMessages',
    preview: `Restoring messages...`,
  })
  try {
    let done = false
    let offset = 0
    // Not restoring from the beginning, but from Aug 15 after we updated memes server
    // https://github.com/getZION/app/issues/83  // '08-15-2021'
    const dateq = moment.utc('10-15-2021', 'MM-DD-YYYY').format('YYYY-MM-DD%20HH:mm:ss')
    let msgs: { [k: number]: Msg[] } = ({} = {})

    while (!done) {
      const r = await relay?.get(`msgs?limit=200&offset=${offset}&date=${dateq}`)

      if (r.new_messages?.length) {
        const decodedMsgs = await decodeMessages(r.new_messages)
        msgs = orgMsgsFromExisting(msgs, decodedMsgs)
        if (r && r.new_messages.length < 200) {
          done = true
        }
        display({
          name: 'restoreMessages',
          preview: `Fetched with offset ${offset}`,
          value: { msgs },
        })
      } else {
        done = true
      }

      root.ui.setMessagesRestored(offset)
      offset += 200

      if (offset >= MAX_MSGS_RESTORE) done = true
    }

    const sortedMsgs = self.sortAllMsgs(msgs)

    // Now we want to store these in REALM but NOT the store!

    const lastFetched = new Date().getTime()
    self.setLastFetched(lastFetched)

    const lastSeen = Object.keys(self.lastSeen).map((key) => ({
      key: parseInt(key),
      seen: self.lastSeen[key],
    }))

    const msgsForRealm = {
      lastFetched,
      lastSeen,
      msgs: sortedMsgs,
    }

    display({
      name: 'restoreMessages',
      preview: 'Formatted messages to save to Realm',
      important: true,
      value: { msgsForRealm },
    })

    updateRealmMsg2(msgsForRealm)
    restoring = false
    root.ui.setRestoringModal(false)
    // self.persister()
  } catch (error) {
    console.log('restoreMessages error', error)
    restoring = false
    root.ui.setRestoringModal(false)
  }
}
