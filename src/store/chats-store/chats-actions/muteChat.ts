import { ChatsStore } from '../chats-store'
import { relay } from 'api'

export const muteChat = async (self: ChatsStore, chatID: number, muted: boolean) => {
  relay?.post(`chats/${chatID}/${muted ? 'mute' : 'unmute'}`)
  const chat = self.chats?.get(chatID.toString())
  if (chat) {
    chat.setMuted(muted)
  }
}
