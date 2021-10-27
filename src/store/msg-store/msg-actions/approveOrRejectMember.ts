import { relay } from 'api'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'
import { MsgStore } from '../msg-store'

export const approveOrRejectMember = async (
  self: MsgStore,
  contactID: number,
  status: string,
  msgId: number
) => {
  const r = await relay?.put(`member/${contactID}/${status}/${msgId}`)
  if (r?.chat && r.chat.id) {
    const msgs = self.msgsForChatroom(r.chat.id)
    const msg = msgs.find((m) => m.id === msgId)
    if (msg) {
      msg.type = r.message.type
      // self.persister()
    }
    // update chat
    const root = getRoot(self) as RootStore
    root.chats.gotChat(r.chat)
  }
}
