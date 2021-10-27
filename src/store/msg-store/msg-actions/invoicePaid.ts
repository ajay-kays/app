import { constants } from 'lib/constants'
import { MsgStore } from '../msg-store'
import { getRoot } from 'mobx-state-tree'
import { RootStore } from 'store'

export const invoicePaid = async (self: MsgStore, m: any) => {
  if (m.chat_id) {
    const msgs = self.msgsForChatroom(m.chat_id)
    if (msgs) {
      const invoice = msgs.find((c) => c.payment_hash === m.payment_hash)
      if (invoice) {
        invoice.status = constants.statuses.confirmed
        // this.persister()
      }
    }
  }
  const root = getRoot(self) as RootStore
  if (m.amount) root.details.addToBalance(m.amount * -1)
}
