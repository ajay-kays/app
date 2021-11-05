import { MsgStore } from '../msg-store'
import { display } from 'lib/logging'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { sleep } from 'lib/sleep'
import { constants } from 'lib/constants'

// After we've fetched contacts and chats, we populate direct messages (only).
export const getDirectMessages = async (self: MsgStore) => {
  // display({
  //   name: 'getDirectMessages',
  //   preview: `Lets grab direct messages.`,
  //   important: true,
  // })

  const root = getRoot(self) as RootStore
  const chatsArray = root.chats.chatsArray
  for (let j = 0; j < chatsArray.length; j++) {
    const chat = chatsArray[j]
    if (chat.type === constants.chat_types.conversation) {
      await self.getMessagesForChat(chat.id)
      await sleep(100)
    }
  }

  display({
    name: 'getDirectMessages',
    preview: `Finished grabbing direct messages`,
  })

  return
}
