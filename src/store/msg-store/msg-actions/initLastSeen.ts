import { normalizeMessage } from 'store/normalize'
import { display } from 'lib/logging'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { decodeSingle, putIn } from '../msg-helpers'
import { MsgStore } from '../msg-store'

export const initLastSeen = async (self: MsgStore) => {
  const root = getRoot(self) as RootStore
  const obj = self.lastSeen ? JSON.parse(JSON.stringify(self.lastSeen)) : {}
  root.chats.chatsArray.forEach((c) => {
    if (!obj[c.id]) obj[c.id] = new Date().getTime()
  })
  self.setLastSeen(obj)
}
