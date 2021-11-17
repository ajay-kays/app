import { MsgStore } from '../msg-store'
import { display } from 'lib/logging'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { sleep } from 'lib/sleep'
import { constants } from 'lib/constants'
import Toast from 'react-native-simple-toast'

// After we've fetched contacts and chats, we populate direct messages (only).
export const getDirectMessages = async (self: MsgStore) => {
  // display({
  //   name: 'getDirectMessages',
  //   preview: `Lets grab direct messages.`,
  //   important: true,
  // })

  const root = getRoot(self) as RootStore
  const chatsArray = root.chats.chatsArray
  let chatsLoaded = 0
  for (let j = 0; j < chatsArray.length; j++) {
    const chat = chatsArray[j]
    if (
      chat.type === constants.chat_types.conversation
      // || chat.type === constants.chat_types.tribe // For experiment of getting tribes too
    ) {
      await self.getMessagesForChat(chat.id)
      chatsLoaded++
      await sleep(100)
      // Toast.showWithGravity(`Loaded ${chatsLoaded} chats`, 1.5, Toast.BOTTOM)
    }
  }

  display({
    name: 'getDirectMessages',
    preview: `Finished grabbing direct messages`,
  })

  return
}
