import { relay } from 'api'
import { reportError } from 'lib/errorHelper'
import { ChatsStore } from '../chats-store'

export const exitGroup = async (self: ChatsStore, chatID: number) => {
  try {
    await relay?.del(`chat/${chatID}`)
  } catch (e) {
    reportError(e)
  }

  try {
    self.removeChat(chatID.toString())
  } catch (e) {
    reportError(e)
  }
}
