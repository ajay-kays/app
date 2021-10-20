import { ChatsStore } from '../chats-store'
import { relay } from 'api'
import { normalizeChat } from 'store/normalize'
import { display, log } from 'lib/logging'

export const getChats = async (self: ChatsStore) => {
  const chats = await relay?.get('chats')

  if (!chats?.length) return false
  // const parsedChats = chats.map((c) => self.parseChat(c))
  const parsedChats = chats.map((c) => normalizeChat(c))
  display({
    name: 'getChats',
    preview: `Got ${chats.length} chats`,
    value: { chats, parsedChats },
  })
  self.setChats(parsedChats)

  return true
}
