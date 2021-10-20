import { ChatsStore } from '../chats-store'
import { relay } from 'api'

export const createGroup = async (self: ChatsStore, contact_ids: number[], name: string) => {
  const r = await relay?.post('group', {
    name,
    contact_ids,
  })
  if (!r) return
  self.gotChat(r)
  return r
}
