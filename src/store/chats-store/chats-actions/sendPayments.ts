import { relay } from 'api'
import { reportError } from 'lib/errorHelper'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { Destination } from 'store/feed'
import { Chat, ChatsStore } from '../'

export const sendPayments = async (
  self: ChatsStore,
  destinations: Destination[],
  text: string,
  amount: number,
  chat_id: number,
  update_meta: boolean
) => {
  const root = getRoot(self) as RootStore
  await relay?.post('stream', {
    destinations,
    text,
    amount,
    chat_id,
    update_meta,
  })
  if (chat_id && update_meta && text) {
    let meta
    try {
      meta = JSON.parse(text)
    } catch (e) {
      reportError(e)
    }
    if (meta) {
      root.chats.updateChatMeta(chat_id, meta)
    }
  }
  if (amount) root.details.addToBalance(amount * -1)
}
