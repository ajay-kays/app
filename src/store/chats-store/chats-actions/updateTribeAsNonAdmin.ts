import { relay } from 'api'
import { ChatsStore } from '../chats-store'

export const updateTribeAsNonAdmin = async (
  self: ChatsStore,
  tribeID: number,
  name: string,
  img: string
) => {
  const r = await relay?.put(`group/${tribeID}`, { name, img })

  if (r) {
    const chat = self.chats.get(tribeID.toString())
    if (chat) {
      chat.updateTribeAliasAndImg(name, img)
    }
  }
}
