import { relay } from 'api'
import { ChatsStore } from '../chats-store'

export const updateMyInfoInChat = async (
  self: ChatsStore,
  tribeID: number,
  my_alias: string,
  my_photo_url: string
) => {
  const r = await relay?.put(`chats/${tribeID}`, { my_alias, my_photo_url })
  if (r) {
    const chat = self.chats.get(tribeID.toString())
    if (chat) {
      chat.updateMyInfo(my_alias, my_photo_url)
    }
  }
}
