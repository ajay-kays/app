import { MsgStore } from '../msg-store'
import { relay } from 'api'
import { display, log } from 'lib/logging'

export const seeChat = async (self: MsgStore, id: number) => {
  if (!id) return
  self.lastSeen[id] = new Date().getTime()
  await relay?.post(`messages/${id}/read`)
  // self.persister()
}
