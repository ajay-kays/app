import { relay } from 'api'
import { ChatsStore } from '../chats-store'

export const exitGroup = async (self: ChatsStore, chatID: number) => {
  await relay?.del(`chat/${chatID}`)
  self.chats.delete(chatID.toString())
}
